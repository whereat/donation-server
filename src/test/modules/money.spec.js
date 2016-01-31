import chai from 'chai';
const should = chai.should();

import { toCents, toDollarStr } from '../../main/modules/money';

describe('Money module', () => {

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

  describe('#toDollarStr', () => {

    it('converts cent integers to dollar strings', () => {

      toDollarStr(100).should.equal("$1.00");
      toDollarStr(100000).should.equal("$1000.00");
      toDollarStr(0).should.equal("$0.00");
      toDollarStr(99).should.equal("$0.99");
      
    });
  });
});



