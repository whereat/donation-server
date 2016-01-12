import chai from 'chai';
import asPromised from 'chai-as-promised';
chai.use(asPromised);
const should = chai.should();

import mg from 'mongoose';
import mm from 'mocha-mongoose';
const dbUri = 'mongodb://localhost/whereat-donations-test';
const clearDb = mm(dbUri);

import { assign, contains, keys, pick } from 'lodash';
import Donation from '../../../main/db/models/donation';

describe('Donation model', () => {

  const d1 = {
    name: 'donor1',
    email: 'donor1@example.com',
    amount: 100,
    date: new Date('Sun Dec 27 2015 00:00:01 GMT-0500')
  };

  const d2 = {
    name: 'donor2',
    email: 'donor2@example.com',
    amount: 200,
    date: new Date('Sun Dec 27 2025 00:00:02 GMT-0500')
  };

  const domainFields = [
    'date',
    'amount',
    'email',
    'name'
  ];


  const stripDbFields = rec => pick(rec, domainFields);
  const demongoify = recs => Promise.resolve(recs.map(stripDbFields));

  beforeEach(done => {
    mg.connection.db ? done() : mg.connect(dbUri, done);
  });

  it('has correct fields', () =>{
    const d = new Donation(d1);

    keys(d._doc).should.eql(['_id','date','amount','email','name']);
  });

  it('populates fields correctly', () => {
    const d = new Donation(d1);

    d.get('date').should.eql(d1.date);
    d.get('amount').should.equal(d1.amount);
    d.get('email').should.equal(d1.email);
    d.get('name').should.equal(d1.name);
  });

  it('creates a document', done => {

    Donation.count().should.become(0)

      .then(() => Donation.create(d1))
      .then(() => Promise.all([

        Donation.count().should.become(1),
        Donation.find({}).then(demongoify).should.become([d1])

      ])).should.notify(done);
  });

  it('creates many documents', done => {

    Donation.count().should.become(0)

      .then(() => Donation.create([d1, d2]))
      .then(() => Promise.all([

        Donation.count().should.become(2),
        Donation.find({}).then(demongoify).should.become([d1, d2])

      ])).should.notify(done);
  });
});
