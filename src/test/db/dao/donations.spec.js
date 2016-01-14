import chai from 'chai';
const should = chai.should();
import sinon from 'sinon';

import ds from '../../support/sampleDonations';
import Donation from '../../../main/db/models/donation';
import dao from '../../../main/db/dao/donations';

describe('Donation DAO', () => {

  let create;
  let getAll;

  before(() => {
    create = sinon.stub(Donation, 'create');
    getAll = sinon.stub(Donation, 'find');
  });

  after(() => {
    create.restore();
    getAll.restore();
  });

  describe('#create', () => {

    it('dispatches to Donation#create', () => {
      dao.create(ds[0]);
      create.should.have.been.calledWith(ds[0]);
    });
  });

  describe('#getAll', () => {

    it('dispatches to Donation#getAll', () => {
      dao.getAll();
      getAll.should.have.been.calledOnce;
    });
  });
});
