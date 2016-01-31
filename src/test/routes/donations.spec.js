import sinon from 'sinon';
import chai from 'chai';

const should = chai.should();
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import asPromised from 'chai-as-promised';
chai.use(asPromised);

import request from 'supertest-as-promised';
import app from '../../main/app';
import { getStripeD, ds, dResponse } from '../support/sampleDonations';
import Donation from '../../main/models/donation/schema';
import md from '../support/mockDonation';

//import express from 'express';
import route from '../../main/routes/donations';
import validations from '../../main/models/donation/validate';
import stripe from '../../main/modules/stripe';
import dao from '../../main/models/donation/dao';
import donations from '../../main/routes/donations';

describe('Donation routes', () => {

  const error = d => Promise.reject(new Error("Oh noes!"));

  let validate;
  let charge;
  let create;
  let getAll;

  beforeEach(() => {
    validate = sinon.stub(route, 'validate', d => Promise.resolve(d));
    charge = sinon.stub(route, 'charge', d => Promise.resolve(d));
    create = sinon.stub(route, 'create', d => Promise.resolve(d));
    getAll = sinon.stub(route, 'getAll', () => Promise.resolve(dResponse));
  });

  afterEach(() => {
    validate.restore();
    charge.restore();
    create.restore();
    getAll.restore();
  });

  describe('POST /donations', () => {

    const postDonation = () => 
            request(app)
            .post('/donations')
            .set('Accept', 'application/json')
            .send(ds[0])
            .expect('Content-Type', /json/);

    describe('happy path', () => {

      it('dispatches to #validate, #charge, and #create', done => {
        postDonation()
          .then(() => {
            validate.should.have.been.calledWith(ds[0]);
            charge.should.have.been.calledWith(ds[0]);
            create.should.have.been.calledWith(ds[0]);
          }).should.notify(done);
      });

      it('returns just-recorded donation', done => {
        postDonation().expect(200, ds[0], done);
      });
    });

    describe('when validation fails', () => {

      beforeEach(() => {
        validate.restore();
        validate = sinon.stub(route, 'validate', error);
      });
      
      it('only dispatches to #validate', done => {
        postDonation()
          .then(() => {
            validate.should.have.been.calledWith(ds[0]);
            charge.should.not.have.been.called;
            create.should.not.have.been.called;
          }).should.notify(done);
      });

      it('returns an error message', done => {
        postDonation()
          .expect(500, {error: 'Oh noes!'})
          .should.notify(done);
      });
    });

    describe('when charge fails', () => {

      beforeEach(() => {
        charge.restore();
        charge = sinon.stub(route, 'charge', error);
      });
      
      it('only dispatches to #validate and #charge', done => {
        postDonation()
          .then(() => {
            validate.should.have.been.calledWith(ds[0]);
            charge.should.have.been.calledWith(ds[0]);
            create.should.not.have.been.called;
          }).should.notify(done);
      });

      it('returns an error message', done => {
        postDonation()
          .expect(500, {error: 'Oh noes!'})
          .should.notify(done);
      });
    });

    describe('when db write fails', () => {

      beforeEach(() => {
        create.restore();
        create = sinon.stub(route, 'create', error);
      });
      
      it('dispatches to #validate, #charge, and #create', done => {
        postDonation()
          .then(() => {
            validate.should.have.been.calledWith(ds[0]);
            charge.should.have.been.calledWith(ds[0]);
            create.should.have.been.calledWith(ds[0]);
          }).should.notify(done);
      });

      it('returns an error message', done => {
        postDonation()
          .expect(500, {error: 'Oh noes!'})
          .should.notify(done);
      });
    });
  });

  describe('GET /donations', () => {

    const getDonations = () => {
      return request(app)
        .get('/donations')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
    };

    describe('happy path', () => {

      it('dispatches to #getAll', done => {
        getDonations()
          .then(() => getAll.should.have.been.called)
          .should.notify(done);
      });

      it('returns just-recorded donations', done => {
        getDonations()
          .expect(200, dResponse)
          .should.notify(done);
      });
    });

    describe('when db read fails', () => {

      beforeEach(() => {
        getAll.restore();
        getAll = sinon.stub(route, 'getAll', error);
      });

      it('dispatches to #getAll', done => {
        getDonations()
          .then(() => getAll.should.have.been.called)
          .should.notify(done);
      });

      it('returns error message', done => {
        getDonations()
          .expect(500, {error: 'Oh noes!'})
          .should.notify(done);
      });
    });
  });
});
