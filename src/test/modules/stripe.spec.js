import sinon from 'sinon';

import chai from 'chai';
const should = chai.should();
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import asPromised from 'chai-as-promised';
chai.use(asPromised);

import { ds, getStripeD } from '../support/sampleDonations';
import { ommit, assign } from 'lodash';

import { getToken, toCents, toCharge, charge } from '../../main/modules/stripe';

describe('stripe module', () => {

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
          charge(assign({}, ds[0], { token: { foo: 'bar'}}))
            .should.be.rejectedWith('The card object must have a value for \'number\'.')
            .should.notify(done);
        });
      });
    });

    describe('helpers', () => {

      describe('#toCents', () => {

        it('converts dollar strings to cent integers', () => {
          toCents(100).should.equal(10000);
          toCents(100.00).should.equal(10000);
          toCents(100.99).should.equal(10099);
          toCents('100.00').should.equal(10000);
          toCents('$100.00').should.equal(10000);
          toCents('$100.99').should.equal(10099);
          toCents(' $100.99 ').should.equal(10099);
        });
      });

      describe('#toCharge', () => {

        it('parses a charge from a donation', () => {
          toCharge(ds[0]).should.eql({
            amount: toCents(ds[0].amount),
            currency: "usd",
            source: ds[0].token,
            description: "Riseup Labs Donation"
          });
        });
      });
    });
  });
});
