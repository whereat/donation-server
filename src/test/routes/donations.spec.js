/**
 *
 * Copyright (c) 2015-present, Total Location Test Paragraph.
 * All rights reserved.
 *
 * This file is part of Where@. Where@ is free software:
 * you can redistribute it and/or modify it under the terms of
 * the GNU General Public License (GPL), either version 3
 * of the License, or (at your option) any later version.
 *
 * Where@ is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For more details,
 * see the full license at <http://www.gnu.org/licenses/gpl-3.0.en.html>
 *
 */

import sinon from 'sinon';
import chai from 'chai';

const should = chai.should();
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import asPromised from 'chai-as-promised';
chai.use(asPromised);

import request from 'supertest-as-promised';
import app from '../../main/app';
import { getStripeInD, inDs, ds, outDs, outDsResponse } from '../support/sampleDonations';
import Donation from '../../main/models/donation/schema';
import md from '../support/mockDonation';

import route from '../../main/routes/donations';
import stripe from '../../main/modules/stripe';
import dao from '../../main/models/donation/dao';
import donations from '../../main/routes/donations';

describe('Donation routes', () => {

  const error = d => Promise.reject(new Error("Oh noes!"));

  describe('POST /donations', () => {

    let parse;
    let validate;
    let charge;
    let create;
    let prettyPrint;
    
    beforeEach(() => {
      parse = sinon.spy(route, 'parse');
      validate = sinon.stub(route, 'validate', d => Promise.resolve(d));
      charge = sinon.stub(route, 'charge', d => Promise.resolve(d));
      create = sinon.stub(route, 'create', d => Promise.resolve(d));
      prettyPrint = sinon.spy(route, 'prettyPrint');
    });

    afterEach(() => {
      parse.restore();
      validate.restore();
      charge.restore();
      create.restore();
      prettyPrint.restore();
    });

    const postDonation = () => 
            request(app)
            .post('/donations')
            .set('Accept', 'application/json')
            .send(inDs[0])
            .expect('Content-Type', /json/);

    describe('happy path', () => {

      it('dispatches to chain of helper promises', done => {
        postDonation()
          .then(() => {
            parse.should.have.been.calledWith(inDs[0]);
            validate.should.have.been.calledWith(ds[0]);
            charge.should.have.been.calledWith(ds[0]);
            create.should.have.been.calledWith(ds[0]);
            prettyPrint.should.have.been.calledWith(ds[0]);
          }).should.notify(done);
      });

      it('returns just-recorded donation', done => {
        postDonation().expect(200, outDs[0], done);
      });
    });

    describe('when parsing fails', () => {

      beforeEach(() => {
        parse.restore();
        parse = sinon.stub(route, 'parse', error);
      });

      it('stops execution of promise chain at #parse', done => {
        postDonation()
          .then(() => {
            parse.should.have.been.calledWith(inDs[0]);
            validate.should.not.have.been.called;
            charge.should.not.have.been.called;
            create.should.not.have.been.called;
            prettyPrint.should.not.have.been.called;
          }).should.notify(done);
      });

      it('returns an error message', done => {
        postDonation()
          .expect(500, {error: 'Oh noes!'})
          .should.notify(done);
      });
    });

    describe('when validation fails', () => {

      beforeEach(() => {
        validate.restore();
        validate = sinon.stub(route, 'validate', error);
      });
      
      it('stops execution of promise chain at #validate', done => {
        postDonation()
          .then(() => {
            parse.should.have.been.calledWith(inDs[0]);
            validate.should.have.been.calledWith(ds[0]);
            charge.should.not.have.been.called;
            create.should.not.have.been.called;
            prettyPrint.should.not.have.been.called;
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
      
      it('stops execution of promise chain at #charge', done => {
        postDonation()
          .then(() => {
            parse.should.have.been.calledWith(inDs[0]);
            validate.should.have.been.calledWith(ds[0]);
            charge.should.have.been.calledWith(ds[0]);
            create.should.not.have.been.called;
            prettyPrint.should.not.have.been.called;
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
      
      it('stops execution of promise chain at #create', done => {
        postDonation()
          .then(() => {
            parse.should.have.been.calledWith(inDs[0]);
            validate.should.have.been.calledWith(ds[0]);
            charge.should.have.been.calledWith(ds[0]);
            create.should.have.been.calledWith(ds[0]);
            prettyPrint.should.not.have.been.called;
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

    let getAll;
    let prettyPrintMany;

    beforeEach(() => {
      getAll = sinon.stub(route, 'getAll', () => Promise.resolve(ds));
      prettyPrintMany = sinon.spy(route, 'prettyPrintMany');
    });

    afterEach(() => {
      getAll.restore();
      prettyPrintMany.restore();
    });

    const getDonations = () => {
      return request(app)
        .get('/donations')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
    };

    describe('happy path', () => {

      it('dispatches to #getAll', done => {
        getDonations()
          .then(() => {
            getAll.should.have.been.calledOnce;
            prettyPrintMany.should.have.been.calledWith(ds);
          }).should.notify(done);
      });

      it('returns just-recorded donations', done => {
        getDonations()
          .expect(200, outDsResponse)
          .should.notify(done);
      });
    });

    describe('when db read fails', () => {

      beforeEach(() => {
        getAll.restore();
        getAll = sinon.stub(route, 'getAll', error);
      });

      it('stops execution of promise chain at #getAll', done => {
        getDonations()
          .then(() => {
            getAll.should.have.been.called;
            prettyPrintMany.should.not.have.been.called;
          }).should.notify(done);
      });

      it('returns error message', done => {
        getDonations()
          .expect(500, {error: 'Oh noes!'})
          .should.notify(done);
      });
    });
  });
});
