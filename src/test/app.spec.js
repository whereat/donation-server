import chai from 'chai';
const should = chai.should();
import app from '../main/app';
import request from 'supertest-as-promised';

describe('Donations Server', () => {

  describe('hello world', () => {

    it('says hello world', done => {
      request(app).get('/')
        .expect('Content-Type', /json/)
        .expect(200, { hello: 'world!'}, done);
    });
  });
});
