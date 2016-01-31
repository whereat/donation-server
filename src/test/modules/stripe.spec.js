/**
 *
 * Copyright (c) 2016-present, Total Location Test Paragraph.
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

import { ds, getStripeInD } from '../support/sampleDonations';
import { parse } from '../../main/models/donation/parse';
import { getToken, toCharge, charge } from '../../main/modules/stripe';
import { ommit, assign } from 'lodash';

describe('Stripe module', () => {

  describe('#getToken', () => {

    it('resolves a promise with a token', done => {
      getToken()
        .then(t => {
          t.id.length.should.equal(28);
          t.id.should.include('tok_');
        })
        .should.notify(done);
    });
  });

  describe('#charge', () => {

    describe('main function', () => {

      describe('when charge succeeds', () => {

        it('resolves a promise with a donation', done => {
          getStripeInD()
            .then(parse)
            .then(d => charge(d).should.become(d))
            .should.notify(done);
        });
      });

      describe('when charge fails', () => {

        it('rejects a promise with an error', done => {
          charge(assign({}, ds[0], { token: { foo: 'bar'}}))
            .should.be.rejectedWith('The card object must have a value for \'number\'.')
            .should.notify(done);
        });
      });
    });

    describe('helpers', () => {

      describe('#toCharge', () => {

        it('parses a charge from a donation', () => {
          toCharge(ds[0]).should.eql({
            amount: ds[0].amount,
            currency: "usd",
            source: ds[0].token,
            description: "Riseup Labs Donation"
          });
        });
      });
    });
  });
});
