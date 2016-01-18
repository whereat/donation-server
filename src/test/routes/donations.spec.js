import sinon from 'sinon';
import chai from 'chai';

const should = chai.should();
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import asPromised from 'chai-as-promised';
chai.use(asPromised);

import request from 'supertest-as-promised';
import app from '../../main/app';
import { ds, dResponse } from '../support/sampleDonations';
import Donation from '../../main/db/models/donation';
import md from '../support/mockDonation';
import dao from '../../main/db/dao/donations';
import route from '../../main/routes/donations';

describe('Donation routes', () => {

  describe('POST /donations', () => {

    let create;
    beforeEach(() => create = sinon.stub(Donation, 'create', md.create));
    afterEach(() => create.restore());

    const postDonation = () => {
      return request(app)
        .post('/donations')
        .set('Accept', 'application/json')
        .send(ds[0])
        .expect('Content-Type', /json/);
    };

    describe('when handling any request', () => {

      it('dispatches to dao#create', done => {
        postDonation()
          .then(() =>create.should.have.been.calledWith(ds[0]))
          .should.notify(done);
      });
    });

    describe('when db write succeeds', () => {

      it('returns just-recorded donation', done => {
        postDonation().expect(200, ds[0], done);
      });
    });

    describe('when db write fails', () => {

      beforeEach(() => {
        create.restore();
        create = sinon.stub(
          dao, 'create', d => Promise.reject((new Error("Oh noes!"))));
      });

      it('returns error message', done => {
        postDonation()
          .expect(500, {error: 'Oh noes!'})
          .should.notify(done);
      });
    });
  });

  describe('GET /donations', () => {

    let find;
    let getAll;
    
    beforeEach(() => {
      find = sinon.stub(Donation, 'find', md.find);
      getAll = sinon.spy(dao, 'getAll');
    });
    afterEach(() => {
      find.restore();
      getAll.restore();
    });

    const getDonations = () => {
      return request(app)
        .get('/donations')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
    };

    describe('when handling any request', () => {

      it('dispatches to dao#getAll', done => {
        getDonations()
          .then(() => getAll.should.have.been.called)
          .should.notify(done);
      });
    });

    describe('when db write succeeds', () => {

      it('returns just-recorded donations', done => {
        getDonations()
          .expect(200, dResponse)
          .should.notify(done);
      });
    });

    describe('when db write fails', () => {

      beforeEach(() => {
        find.restore();
        find = sinon.stub(
          Donation, 'find', d => Promise.reject((new Error("Oh noes!"))));
      });

      it('returns error message', done => {
        getDonations()
          .expect(500, {error: 'Oh noes!'})
          .should.notify(done);
      });
    });
  });
});
