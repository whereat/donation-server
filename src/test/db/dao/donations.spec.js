import sinon from 'sinon';

import chai from 'chai';
const should = chai.should();
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import asPromised from 'chai-as-promised';
chai.use(asPromised);

import Donation from '../../../main/db/models/donation';
import md from '../../support/mockDonation';
import { mongoify } from '../../support/dbHelpers';

import dao, {
  validate, demongoify, demongoifyMany, getTotal,
  badFieldMsg, emptyMsg, badEmailMsg
} from '../../../main/db/dao/donations';

import {
  ds, dResponse, anon, missing, extra, empty,
  badEmail1, badEmail2, badEmail3
} from '../../support/sampleDonations';

import { omit, assign, chain } from 'lodash';

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
      ;
    });

    describe('#create helpers', () => {

      describe('demongoify', () => {

        it('parses a donation from a mongo document', done => {
          md.create(ds[0])
            .then(d => demongoify(d).should.eql(ds[0]))
            .should.notify(done);
        });
      });

      describe('#validate', () => {

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

            const fubar = chain(ds[0])
                    .omit('name')
                    .assign({foo: 'bar', amount: '', email: 'foo@bar'})
                    .value();

            validate(fubar)
              .should.be.rejectedWith(badEmailMsg(fubar))
              .should.notify(done);

          });
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

