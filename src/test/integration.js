import chai from 'chai';
const should = chai.should();
import asPromised from 'chai-as-promised';
chai.use(asPromised);

import { getStripeInD } from '../test/support/sampleDonations';
import { prettyPrint } from '../main/models/donation/prettyPrint';
import { parse } from '../main/models/donation/parse';

import { keys } from 'lodash';
import sa from 'superagent';
import sap from 'superagent-promise';
const request = sap(sa, Promise);
const port = process.env.PORT;

describe('Live server', () => {

  it('posts donations and gets them', done => {
    
    getStripeInD()
      .then(d =>
            request
            .post(`http://localhost:${port}/donations`)
            .set('Accept', 'application/json')
            .send(d)
            .end()
            .then(res =>
                  parse(d).then(prettyPrint).should.become(res.body))
            .then(
              request
                .get('http://localhost:3000/donations')
                .set('Accept', 'application/json')
                .end()
                .then(res => {
                  keys(res.body).should.eql(['total', 'donations']);
                  res.body.donations[0].should.equal(d);
                }))).should.notify(done);
  });
});










