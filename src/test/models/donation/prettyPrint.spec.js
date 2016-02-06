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

import {
  prettyPrint, toDollarStr, anonymize, pickFields, toMDY,
  prettyPrintMany, sortByTime, getTotal
} from '../../../main/models/donation/prettyPrint';
import { inDs, ds, outDs, outDsResponse } from '../../support/sampleDonations';
import { keys } from 'lodash';

describe('Donation pretty print module', () => {

  describe('#prettyPrint', () => {

    it('converts an anonymous Donation to an OutDonation', () => {
      prettyPrint(ds[0]).should.eql(outDs[0]);
    });

    it('converts a non-anonymous Donation to an OutDonation', () => {
      prettyPrint(ds[1]).should.eql(outDs[1]);
    });

    describe('helpers', () => {

      describe('#anonymize', () => {

        it('anonymizes a donation if needed', () => {
          anonymize({name: 'Austin', anonymous: true}).name.should.equal('Anonymous');
          anonymize({name: 'Austin', anonymous: false}).name.should.equal('Austin');
        });
      });

      describe('#pickFields', () => {

        it('picks the amount, date, and name fields', () => {
          keys(pickFields(ds[0])).should.eql(['amount', 'date', 'name']);
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

      describe('#toMDY', () => {

        it('converts a date string to M/D/YY', () => {

          toMDY(ds[0].date).should.equal('12/27/15');
          toMDY(ds[1].date).should.equal('1/4/16');
          toMDY(ds[2].date).should.equal('12/30/15');
        });
      });
    });
  });

  describe('prettyPrintMany', () => {

    it('converts an Array of Donations to an OutDonationsResponse', () => {
      prettyPrintMany(ds).should.eql(outDsResponse);
    });

    describe('helpers', () => {

      describe('#sortByTime', () => {

        it('sorts donations in reverse chronological order', () => {
          sortByTime(ds).should.eql([ds[1], ds[2], ds[0]]);
        });
      });

      describe('#getTotal', () => {

        it('sums the amounts in a collection of donations', () => {

          getTotal([
            {name: 'foo', amount: 100 },
            { name: 'bar', amount: 200 },
            { name: 'baz', amount: 300 }
          ]).should.equal("$6.00");

          
          getTotal([
            {name: 'foo', amount: 0 },
            { name: 'bar', amount: 0 },
            { name: 'baz', amount: 0 }
          ]).should.equal("$0.00");

          getTotal([]).should.equal("$0.00");
          
        });
      });
    });
  });
});




