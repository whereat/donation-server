import chai from 'chai';
const should = chai.should();
import asPromised from 'chai-as-promised';
chai.use(asPromised);


import mg from 'mongoose';
mg.Promise = Promise;
import mm from 'mocha-mongoose';
import { dbUri } from '../main/config';
const clearDb = mm(dbUri);
import { demongoify, demongoifyMany } from './support/dbHelpers';

import request from 'supertest-as-promised';
import { omit } from 'lodash';

import app from '../main/app';
import ds from './support/sampleDonations';
import Donation from '../main/db/models/donation';

describe('Application', () => {

  beforeEach(done => mg.connection.db ? done() : mg.connect(dbUri, done));

  describe('submitting a donation', () => {

    describe('when correctly formatted', () => {

      it('writes donation to db & returns it', done => {

        request(app)
          .post('/donations')
          .set('Accept', 'application/json')
          .send(ds[0])
          .expect('Content-Type', /json/)
          .expect(200)
          .then(res =>  demongoify(res.body).should.eql(ds[0]))
          .should.notify(done);
      });
    });
  });

  describe('listing donations', () => {

    describe('when db has contents', () => {

      it('returns all donations in DB', done => {

        Donation.create(ds)
          .then(() =>
                request(app)
                .get('/donations')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => demongoifyMany(res.body).should.eql(ds)))
          .should.notify(done);
      });
    });

    describe('when db is empty', () => {

      it('returns an empty list', done => {

        request(app)
          .get('/donations')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, [])
          .should.notify(done);

      });
    });
  });
});
