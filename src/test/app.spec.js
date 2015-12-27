import chai from 'chai';
const should = chai.should();

import app from '../main/app';
import request from 'supertest-as-promised';
import donations from './support/sampleDonations';

describe('Donations Server', () => {

  describe('POST /donation', () => {

    it('writes donation to db & returns it', done => {
      request(app)
        .post('/donation')
        .set('Accept', 'application/json')
        .send(donations[0])
        .expect('Content-Type', /json/)
        .expect(200, donations[0], done);
    });
  });

  describe('GET /donations', () => {

    it('returns all donations in DB', done => {
      request(app)
        .get('/donations')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, donations, done);
    });
  });
});
