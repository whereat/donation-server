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
import { ds, dResponse } from '../../support/sampleDonations';

import dao, { demongoify, demongoifyMany, getTotal } from '../../../main/models/donation/dao';

describe('Donation DAO', () => {

  describe('#create', () => {

    let create;
    before(() => create = sinon.stub(Donation, 'create', md.create));
    after(() => create.restore());

    it('dispatches to Donation#create', done => {
      dao.create(ds[0])
        .should.become(ds[0])
        .then(() => create.should.have.been.calledWith(ds[0]))
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
      dao.getAll()
        .then(() => find.should.have.been.calledOnce)
        .should.notify(done);
    });

    
    it('returns a list of short donations, newest first', done => {
      dao.getAll()
        .then(ds => ds.should.eql(dResponse))
        .should.notify(done);
    });

    describe('#getAll helpers', () => {

      describe('#demongoifyMany', () => {

        it('parses sorted donations from a mongo collectoion', done => {
          md.find({})
            .then(ds_ => demongoifyMany(ds_).should.eql(dResponse.donations))
            .should.notify(done);
        });
      });

      describe('#getTotal', () => {

        it('sums donations from a mongo collection', done => {
          md.find({})
            .then(ds_ => getTotal(ds_).should.eql(dResponse.total))
            .should.notify(done);
        });
      });
    });
  });
});

