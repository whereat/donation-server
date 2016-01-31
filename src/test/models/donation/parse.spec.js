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




