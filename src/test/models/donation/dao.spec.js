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

import Donation from '../../../main/models/donation/schema';
import md from '../../support/mockDonation';
import { mongoify } from '../../support/dbHelpers';
import { inDs, ds, outDs, outDsResponse } from '../../support/sampleDonations';

import { create, getAll, demongoify, demongoifyMany, getTotal } from '../../../main/models/donation/dao';

describe('Donation DAO', () => {

  describe('#create', () => {

    let dbCreate;
    beforeEach(() => dbCreate = sinon.stub(Donation, 'create', md.create));
    afterEach(() => dbCreate.restore());

    it('dispatches to Donation#create', done => {
      create(ds[0])
        .should.become(ds[0])
        .then(() => dbCreate.should.have.been.calledWith(ds[0]))
        .should.notify(done);
    });

    describe('#create helpers', () => {

      describe('demongoify', () => {

        it('parses a donation from a mongo document', done => {
          md.create(ds[0])
            .then(d => demongoify(d).should.eql(ds[0]))
            .should.notify(done);
        });
      });
    });
  });

  describe('#getAll', () => {

    let find;
    beforeEach(() => find = sinon.stub(Donation, 'find', md.find));
    afterEach(() => find.restore());
    
    it('dispatches to Donation#find and Donation#short', done => {
      getAll()
        .then(() => find.should.have.been.calledOnce)
        .should.notify(done);
    });

    
    it('returns a list of short donations, newest first', done => {
      getAll()
        .then(ds => ds.should.eql(ds))
        .should.notify(done);
    });
  });
});

