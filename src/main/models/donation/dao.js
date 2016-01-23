import Donation from './schema';
import { validate } from './validate';
import { assign, flow, map, reduce, sortBy, pick, pluck, omit, sum } from 'lodash';

export const domainFields = [
  'email',
  'name',
  'anonymous',
  'token',
  'date',
  'amount',
];

// parse a donation from a mongo record
const getDoc = d => d._doc ? d._doc : d;
const stripDbFields = d => omit(d, ['__v', '_id']);
const resolveDateField = d => assign(d, {date: new Date(d.date).toString()});
export const demongoify = flow(getDoc, stripDbFields, resolveDateField);

// parse a donation collection from a mongo collection
const anonymize = d => d.anonymous ? 'Anonymous' : d.name;
const getShortFields = d => assign(pick(d, 'amount', 'date'), { name: anonymize(d) });
const parseFields = ds => map(ds, flow(getDoc, getShortFields, resolveDateField));
const sortByTime = ds => sortBy(ds, d => - new Date(d).getTime());
export const demongoifyMany = flow(parseFields, sortByTime);

// calculate total donation amount
const pluckAmounts = ds => pluck(ds, 'amount');
export const getTotal = flow(pluckAmounts, sum);

// pull it all together!
export default {
  create: d =>
    validate(d)
    .then(d_ => Donation.create(d_)) // note: `Donation.create` can't be passed as lambda
    .then(demongoify),
  getAll: () =>
    Donation.find({})
    .then(ds => ({
      total: getTotal(ds),
      donations: demongoifyMany(ds)
    }))
};

