import Donation from './schema';
import { assign, flow, map, omit } from 'lodash';

export const domainFields = [
  'email',
  'name',
  'anonymous',
  'token',
  'date',
  'amount',
];

// helpers
const getDoc = d => d._doc ? d._doc : d;
const stripDbFields = d => omit(d, ['__v', '_id']);
const resolveDateField = d => assign(d, {date: new Date(d.date).toString()});
export const demongoify = flow(getDoc, stripDbFields, resolveDateField);

// main funcs
export const create = d => Donation.create(d).then(demongoify);
export const getAll = () => Donation.find({}).then(ds => ds.map(demongoify));

