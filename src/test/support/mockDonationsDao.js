import ds from '../../test/support/sampleDonations';

export default {
  create: (d) => Promise.resolve(d),
  getAll: () => Promise.resolve(ds)
};
