import sinon from 'sinon';

import chai from 'chai';
const should = chai.should();
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import asPromised from 'chai-as-promised';
chai.use(asPromised);

import { inDs, getStripeD } from '../support/sampleDonations';
import { ommit, assign } from 'lodash';
import { toCents } from '../../main/modules/money';
import { getToken, toCharge, charge } from '../../main/modules/stripe';

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
          getStripeD()
            .then(d => charge(d).should.become(d))
            .should.notify(done);
        });
      });

      describe('when charge fails', () => {
        
        it('rejects a promise with an error', done => {
          charge(assign({}, inDs[0], { token: { foo: 'bar'}}))
            .should.be.rejectedWith('The card object must have a value for \'number\'.')
            .should.notify(done);
        });
      });
    });

    describe('helpers', () => {

      describe('#toCharge', () => {

        it('parses a charge from a donation', () => {
          toCharge(inDs[0]).should.eql({
            amount: toCents(inDs[0].amount),
            currency: "usd",
            source: inDs[0].token,
            description: "Riseup Labs Donation"
          });
        });
      });
    });
  });
});
