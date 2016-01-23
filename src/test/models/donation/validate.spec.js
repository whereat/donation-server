import sinon from 'sinon';

import chai from 'chai';
const should = chai.should();
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import asPromised from 'chai-as-promised';
chai.use(asPromised);

import { omit, assign, chain } from 'lodash';

import {
  ds, anon, missing, extra, empty, badEmail1, badEmail2, badEmail3
} from '../../support/sampleDonations';


import {
  validate, badFieldMsg, emptyMsg, badEmailMsg
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
