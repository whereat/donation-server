import Donation from '../models/donation';

export default {
  create: (d) => Donation.create(d),
  getAll: () => Donation.find({})
};
