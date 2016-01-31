import { ds, ds_ } from '../../test/support/sampleDonations';
import { assign } from 'lodash';
import { mongoify } from '../support/dbHelpers';

export default {
  create: d => Promise.resolve(mongoify(d)),
  find: () => Promise.resolve(ds_.map(mongoify))
};


