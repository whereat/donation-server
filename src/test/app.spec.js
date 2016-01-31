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
import { assign, omit } from 'lodash';

import app from '../main/app';

import {
  getStripeInD, inDs, ds, outDs,
  outDsResponse,
  inNonDollar,
  inBadAmount, badAmount,
  inBadAmountStr, badAmountStr,
  inMissing, missing,
  inExtra, extra,
  inEmpty, empty,
  inBadEmail1, badEmail1 }
from './support/sampleDonations';

import { badFieldMsg, emptyMsg, badEmailMsg, badAmountMsg } from '../main/models/donation/validate';
import { prettyPrint } from '../main/models/donation/prettyPrint';
import { parse, nonDollarMsg } from '../main/models/donation/parse';
import Donation from '../main/models/donation/schema';

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
        getStripeInD()
          .then(
            d => 
              submitDonation(d)
              .expect(200)
              .then(res =>  parse(d).then(prettyPrint).should.become(res.body))
          ).should.notify(done);
      });
    });

    describe('when incorrectly formatted', () => {

      it('returns error for non-dollar amount', done => {
        submitDonation(inNonDollar)
          .expect(500, {error: nonDollarMsg(inNonDollar)})
          .should.notify(done);
      });

      it('returns error on missing field', done => {
        submitDonation(inMissing)
          .expect(500, {error: badFieldMsg(missing)})
          .should.notify(done);
      });

      it('returns error on extra field', done => {
        submitDonation(inExtra)
          .expect(500, {error: badFieldMsg(extra)})
          .should.notify(done);
      });

      it('returns error on empty value', done => {
        submitDonation(inEmpty)
          .expect(500, {error: emptyMsg(empty)})
          .should.notify(done);
      });

      it('returns error on zero dollar donation (num)', done => {
        submitDonation(inBadAmount)
          .expect(500, { error: badAmountMsg(badAmount) })
          .should.notify(done);
      });

      it('returns error on zero dollar donation (str)', done => {
        submitDonation(inBadAmountStr)
          .expect(500, { error: badAmountMsg(badAmount) })
          .should.notify(done);
      });

      it('returns error on bad email adddress', done => {
        submitDonation(inBadEmail1)
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
                .then(res => res.body.should.eql(outDsResponse))
               ).should.notify(done);
      });
    });

    describe('when db is empty', () => {

      it('returns an empty list', done => {
        getDonations()
          .expect(200, { total: "$0.00", donations: [] })
          .should.notify(done);
      });
    });
  });
});
