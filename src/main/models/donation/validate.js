/**
 *
 * Copyright (c) 2016-present, Total Location Test Paragraph.
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

import { domainFields as df } from './dao';
import { assign, reduce, keys, includes, values, flow } from 'lodash';

const pp = d => JSON.stringify(d, null, 2);

// validate that a donation..

// has correct fields
export const badFieldMsg = d =>`incorrect fields in: \n ${pp(d)}\n should have fields:\n ${df}`;
const noMissing = ks => ks.length === df.length;
const noExtra = ks => reduce(ks, (acc, k) => acc && includes(df, k), true);
const correctFields = acc => {
  const ks = keys(acc.rec);
  return noMissing(ks) && noExtra(ks) ?
    acc :
    assign({}, acc, { err: new Error(badFieldMsg(acc.rec))});
};

// has no empty values
export const emptyMsg = d => `empty fields in ${pp(d)}`;
const hasLength = (acc, str) => acc && str.toString().length > 0;
const nonEmpty = acc =>
  reduce(values(acc.rec), hasLength, true) ?
  acc :
  assign({}, acc, { err: new Error(emptyMsg(acc.rec)) });

// has correctly formatted email address
export const badEmailMsg = d => `bad email address: ${d.email}`;
const emailTest = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const goodEmail = acc =>
  acc.rec.email && acc.rec.email.match(emailTest) !== null ?
  acc :
  assign({}, acc, { err: new Error(badEmailMsg(acc.rec)) });

// has valid donation amount (and convert amount to cents)
export const badAmountMsg = d => `invalid donation amount: ${d.amount}`;
const goodAmount = acc => {
  return acc.rec.amount !== 0 ?
    acc :
    assign({}, acc, { err: new Error(badAmountMsg(acc.rec)) });
};

// has all of the above properties
const validations = [correctFields, nonEmpty, goodAmount, goodEmail];
export const validate = d => {
  const {err, rec} = flow(...validations)({rec: d, err: null});
  return err ? Promise.reject(err) : Promise.resolve(rec);
};

