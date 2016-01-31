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

import { omit, assign, chain } from 'lodash';

import {
  inDs, ds, anon, anon_, missing, extra, empty, badAmount, badEmail1, badEmail2, badEmail3
} from '../../support/sampleDonations';


import {
  validate, badFieldMsg, emptyMsg, badAmountMsg, badEmailMsg
} from '../../../main/models/donation/validate' ;

describe('Donation validation', () => {

  describe('happy path', () => {

    it('accepts a well-formed request', done => {
      validate(ds[0])
        .should.become(ds[0])
        .should.notify(done);
    });

    it('accepts a well-formed anonymous request', done => {
      validate(anon)
        .should.become(anon)
        .should.notify(done);
    });
  });

  describe('sad path', () => {

    it('rejects request with missing fields', done => {
      validate(missing)
        .should.be.rejectedWith(badFieldMsg(missing))
        .should.notify(done);
    });
    
    it('rejects request with extra fields', done => {
      validate(extra)
        .should.be.rejectedWith(badFieldMsg(extra))
        .should.notify(done);
    });

    it('rejects request with empty value', done => {
      validate(empty)
        .should.be.rejectedWith(emptyMsg(empty))
        .should.notify(done);
    });

    it('rejects request with invalid email', done => {
      Promise.all([
        validate(badEmail1).should.be.rejectedWith(badEmailMsg(badEmail1)),
        validate(badEmail2).should.be.rejectedWith(badEmailMsg(badEmail2)),
        validate(badEmail3).should.be.rejectedWith(badEmailMsg(badEmail3))
      ]).should.notify(done);
    });

    it('rejects request with many problems (but notifies of only one)', done => {

      const fubar = chain(inDs[0])
              .omit('name')
              .assign({foo: 'bar', amount: '', email: 'foo@bar'})
              .value();

      validate(fubar)
        .should.be.rejectedWith(badEmailMsg(fubar))
        .should.notify(done);
    });
  });
});
