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

import { omit, assign } from 'lodash';
import { getToken } from '../../main/modules/stripe';

export const tokens = [
  "tok_17UaeFGd2qyJIviy37ObydXB",
  "tok_17UapNGd2qyJIviyb9aoqZyw",
  "tok_17UaoMGd2qyJIviyiKmpRzm6"
];

export const inDs = [
    {
      amount: "$100",
      date: 'Sun Dec 27 2015 00:00:01 GMT-0500 (EST)',
      token: tokens[0],
      anonymous: true,
      name: 'donor1',
      email: 'donor1@example.com'
    },
    {
      amount: "$200.00",
      date: 'Sun Dec 27 2015 00:00:02 GMT-0500 (EST)',
      token: tokens[1],
      anonymous: false,
      name: 'donor2',
      email: 'donor2@example.com'
    },
    {
      amount: " $300.00 ",
      date: 'Sun Dec 27 2015 00:00:03 GMT-0500 (EST)',
      token: tokens[2],
      anonymous: false,
      name: 'donor3',
      email: 'donor3@example.com'
    }
];

export const ds = [
  {
    amount: 10000,
    date: 'Sun Dec 27 2015 00:00:01 GMT-0500 (EST)',
    token: tokens[0],
    anonymous: true,
    name: 'donor1',
    email: 'donor1@example.com'
  },
  {
    amount: 20000,
    date: 'Sun Dec 27 2015 00:00:02 GMT-0500 (EST)',
    token: tokens[1],
    anonymous: false,
    name: 'donor2',
    email: 'donor2@example.com'
  },
  {
    amount: 30000,
    date: 'Sun Dec 27 2015 00:00:03 GMT-0500 (EST)',
    token: tokens[2],
    anonymous: false,
    name: 'donor3',
    email: 'donor3@example.com'
  }
  
];

export const outDs = [
    {
      amount: "$100.00",
      date: 'Sun Dec 27 2015 00:00:01 GMT-0500 (EST)',
      name: 'Anonymous'
    },
    {
      amount: "$200.00",
      date: 'Sun Dec 27 2015 00:00:02 GMT-0500 (EST)',
      name: 'donor2'
    },
    {
      amount: "$300.00",
      date: 'Sun Dec 27 2015 00:00:03 GMT-0500 (EST)',
      name: 'donor3'
    }
];

export const outDsResponse = {
  total: "$600.00",
  donations: [outDs[2], outDs[1], outDs[0]]
};

export const getStripeInD = () =>
  getToken()
  .then(t => assign({}, inDs[0], {token: t.id}));

export const inNonDollar = assign({}, inDs[0], { amount: 'foobar' });
export const inAnon = assign({}, inDs[0], { anonymous: false });
export const inMissing = omit(inDs[0], 'name');
export const inExtra = assign({}, inDs[0], { foo: 'bar'});
export const inEmpty = assign({}, inDs[0], { name: ''});
export const inBadAmount = assign({}, inDs[0], { amount: 0 });
export const inBadAmountStr = assign({}, inDs[0], { amount: "$0.00" });
export const inBadEmail1 = assign({}, inDs[0], { email: 'foo@bar' });
export const InBadEmail2 = assign({}, inDs[0], { email: 'foobar.com' });
export const InBadEmail3 = assign({}, inDs[0], { email: 'foo@ bar.com' });

export const anon = assign({}, ds[0], { anonymous: false });
export const missing = omit(ds[0], 'name');
export const extra = assign({}, ds[0], { foo: 'bar'});
export const empty = assign({}, ds[0], { name: ''});
export const badAmount = assign({}, ds[0], { amount: 0 });
export const badAmountStr = assign({}, ds[0], { amount: "$0.00" });
export const badEmail1 = assign({}, ds[0], { email: 'foo@bar' });
export const badEmail2 = assign({}, ds[0], { email: 'foobar.com' });
export const badEmail3 = assign({}, ds[0], { email: 'foo@ bar.com' });



