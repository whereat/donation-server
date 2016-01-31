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
import { ds, ds_, outDs } from '../../support/sampleDonations';
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
      const d = new Donation(ds_[0]);

      keys(d._doc).should.eql(['_id'].concat(domainFields));
    });

    it('populates fields correctly', () => {
      const d = new Donation(ds_[0]);

      d.get('amount').should.equal(ds_[0].amount);
      d.get('date').should.eql(new Date(ds_[0].date));
      d.get('token').should.eql(ds_[0].token);
      d.get('anonymous').should.equal(ds_[0].anonymous);
      d.get('email').should.equal(ds_[0].email);
      d.get('name').should.equal(ds_[0].name);
    });
  });

  describe('queries', () => {

    it('creates a document', done => {

      Donation.count().should.become(0)
        .then(() => Donation.create(ds_[0]))
        .then(() => Promise.all([

          Donation.count().should.become(1),
          Donation.find({})
            .then(ds => demongoify(ds[0]))
            .should.become(outDs[0])

        ])).should.notify(done);
    });

    it('creates many documents', done => {

      Donation.count().should.become(0)

        .then(() => Donation.create(ds_))
        .then(() => Promise.all([

          Donation.count().should.become(3),
          Donation.find({})
            .then(ds => ds.map(demongoify))
            .should.become(outDs)

        ])).should.notify(done);
    });
  });
});


