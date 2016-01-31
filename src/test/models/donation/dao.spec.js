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

