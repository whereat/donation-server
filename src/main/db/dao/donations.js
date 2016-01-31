/**
 *
 * Copyright (c) 2015-present, Total Location Test Paragraph.
 * All rights reserved.
 *
 * This file is part of Where@. Where@ is free software:
 * you can redistribute it and/or modify it under the terms of
 * the GNU General Public License (GPL), either version 3
 * of the License, or (at your option) any later version.
 *
 * Where@ is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For more details,
 * see the full license at <http://www.gnu.org/licenses/gpl-3.0.en.html>
 *
 */

import Donation from '../models/donation';
import {
  assign, flow, map, reduce, sortBy, pick, pluck, omit, sum, keys, includes, values
} from 'lodash';

export const domainFields = [
  'email',
  'name',
  'anonymous',
  'token',
  'date',
  'amount',
];
const df = domainFields;
const pp = d => JSON.stringify(d, null, 2);

// validate that a donation..

// has correct fields
export const badFieldMsg = d =>`incorrect fields in: \n ${pp(d)}\n should have fields:\n ${df}`;
const noMissing = ks => ks.length === df.length;
const noExtra = ks => reduce(ks, (acc, k) => acc && includes(df, k));
const correctFields = acc => {
  const ks = keys(acc.rec);
  return noMissing(ks) && noExtra(ks) ?
    acc :
    assign({}, acc, { err: new Error(badFieldMsg(acc.rec))});
};

// isn't empty
export const emptyMsg = d => `empty fields in ${pp(d)}`;
const hasLength = (acc, str) => acc && str.toString().length > 0;
const nonEmpty = acc =>
  reduce(values(acc.rec), hasLength) ?
  acc :
  assign({}, acc, { err: new Error(emptyMsg(acc.rec)) });

// has correctly formatted email address
export const badEmailMsg = d => `bad email address: ${d.email}`;
const emailTest = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const goodEmail = acc =>
  acc.rec.email.match(emailTest) !== null ?
  acc :
  assign({}, acc, { err: new Error(badEmailMsg(acc.rec)) });

// has all of the above properties
const validations = [correctFields, nonEmpty, goodEmail];
export const validate = d => {
  const {err, rec} = flow(...validations)({rec: d, err: null});
  return err ? Promise.reject(err) : Promise.resolve(rec);
};

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

