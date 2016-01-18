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
import { domainFields, demongoify, demongoifyMany } from '../../../main/models/donation/dao';

import { keys } from 'lodash';
import Donation from '../../../main/models/donation/schema';
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


