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
import datetime from 'chai-datetime';
chai.use(datetime);

import mg from 'mongoose';
mg.Promise = Promise;
import mm from 'mocha-mongoose';
import { dbUri } from '../../../main/config';
const clearDb = mm(dbUri);
import { domainFields, demongoify, demongoifyMany } from '../../../main/db/dao/donations';

import { keys } from 'lodash';
import Donation from '../../../main/db/models/donation';
import { ds } from '../../support/sampleDonations';
import { mongoify } from '../../support/dbHelpers';

describe('Donation model', () => {

  beforeEach(done => {
    mg.connection.db ? done() : mg.connect(dbUri, done);
  });

  it('connects to correct db URI', () => {
    dbUri.should.equal('mongodb://localhost/whereat-donations-test');
  });

  describe('fields', () => {

    it('has correct fields', () =>{
      const d = new Donation(ds[0]);

      keys(d._doc).should.eql(['_id'].concat(domainFields));
    });

    it('populates fields correctly', () => {
      const d = new Donation(ds[0]);

      d.get('amount').should.equal(ds[0].amount);
      d.get('date').should.eql(new Date(ds[0].date));
      d.get('token').should.eql(ds[0].token);
      d.get('anonymous').should.equal(ds[0].anonymous);
      d.get('email').should.equal(ds[0].email);
      d.get('name').should.equal(ds[0].name);
    });
  });

  describe('queries', () => {

    it('creates a document', done => {

      Donation.count().should.become(0)
        .then(() => Donation.create(ds[0]))
        .then(() => Promise.all([

          Donation.count().should.become(1),
          Donation.find({})
            .then(ds_ => demongoify(ds_[0]))
            .should.become(ds[0])

        ])).should.notify(done);
    });

    it('creates many documents', done => {

      Donation.count().should.become(0)

        .then(() => Donation.create(ds))
        .then(() => Promise.all([

          Donation.count().should.become(3),
          Donation.find({})
            .then(ds_ => ds_.map(demongoify))
            .should.become(ds)

        ])).should.notify(done);
    });
  });
});


