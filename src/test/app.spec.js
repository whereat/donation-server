import chai from 'chai';
const should = chai.should();
import asPromised from 'chai-as-promised';
chai.use(asPromised);


import mg from 'mongoose';
mg.Promise = Promise;
import mm from 'mocha-mongoose';
import { dbUri } from '../main/config';
const clearDb = mm(dbUri);

import request from 'supertest-as-promised';
import { omit } from 'lodash';

import app from '../main/app';
import { ds, dResponse, missing, extra, empty, badEmail1 } from './support/sampleDonations';
import { badFieldMsg, emptyMsg, badEmailMsg } from '../main/db/dao/donations';
import Donation from '../main/db/models/donation';

describe('Application', () => {

  beforeEach(done => mg.connection.db ? done() : mg.connect(dbUri, done));

  describe('submitting a donation', () => {

    const submitDonation = (d) =>
            request(app)
            .post('/donations')
            .set('Accept', 'application/json')
            .send(d)
            .expect('Content-Type', /json/);    
    
    describe('when correctly formatted', () => {

      it('writes donation to db & returns it', done => {
        submitDonation(ds[0])
          .expect(200)
          .then(res =>  res.body.should.eql(ds[0]))
          .should.notify(done);
      });
    });

    describe('when incorrectly formatted', () => {

      it('returns error on missing field', done => {
        submitDonation(missing)
          .expect(500, {error: badFieldMsg(missing)})
          .should.notify(done);
      });

      it('returns error on extra field', done => {
        submitDonation(extra)
          .expect(500, {error: badFieldMsg(extra)})
          .should.notify(done);
      });

      it('returns error on empty value', done => {
        submitDonation(empty)
          .expect(500, {error: emptyMsg(empty)})
          .should.notify(done);
      });

      it('returns error on bad email adddress', done => {
        submitDonation(badEmail1)
          .expect(500, {error: badEmailMsg(badEmail1)})
          .should.notify(done);
      });

    });
  });

  describe('listing donations', () => {

    const getDonations = () => request(app)
            .get('/donations')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/);
    
    describe('when db has contents', () => {

      it('returns all donations in DB', done => {
        Donation.create(ds)
          .then(() =>
                getDonations()
                .expect(200)
                .then(res => res.body.should.eql(dResponse))
               ).should.notify(done);
      });
    });

    describe('when db is empty', () => {

      it('returns an empty list', done => {
        getDonations()
          .expect(200, { total: 0, donations: [] })
          .should.notify(done);
      });
    });
  });
});
