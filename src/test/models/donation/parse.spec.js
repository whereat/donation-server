import chai from 'chai';
const should = chai.should();
import asPromised from 'chai-as-promised';
chai.use(asPromised);

import { parse, toCents, nonDollarMsg } from '../../../main/models/donation/parse';
import { inDs, ds, inNonDollar } from '../../support/sampleDonations';

describe('Donation parse module', () => {

  describe('#parse', () => {

    it('parses a proper InDonation to a Donation', done => {
      parse(inDs[0])
        .should.become(ds[0])
        .should.notify(done);
    });

    it('rejects an InDonation with an improper dollar amount', done => {
      parse(inNonDollar)
        .should.be.rejectedWith(nonDollarMsg(inNonDollar))
        .should.notify(done);
    });
  });

  describe('#toCents', () => {

    it('converts dollar strings to cent integers', () => {

      toCents(100).should.equal(10000);
      toCents(100.00).should.equal(10000);
      toCents(100.99).should.equal(10099);

      toCents('$100').should.equal(10000);
      toCents('$100.00').should.equal(10000);
      toCents('$100.99').should.equal(10099);
      toCents('100.00').should.equal(10000);

      toCents(' $100.00 ').should.equal(10000);
      toCents('$100.0').should.equal(10000);
      toCents('$100.000').should.equal(10000);
      toCents(' 100 ').should.equal(10000);
      toCents(' 100.00 ').should.equal(10000);
      
      toCents('foobar').should.equal(0);
    });
  });
});




