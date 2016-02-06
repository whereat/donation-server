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

import { assign, flow, map, sortBy, pick, pluck, sum } from 'lodash';

// (Donation) -> OutDonation
export const prettyPrint = d => flow(anonymize, pickFields, formatFields)(d);

// (Donation) -> ShortDonation
export const anonymize = d => assign({}, d, { name: d.anonymous ? 'Anonymous' : d.name });
export const pickFields = d => pick(d, 'amount', 'date', 'name');
export const formatFields = d => assign({}, d, {
  amount: toDollarStr(d.amount),
  date: toMDY(d.date)
});

// (Number) -> String
export const toDollarStr = num => {
  const [ dollars, cents ] = [ Math.floor(num/100), num % 100 ];
  const pad = num => num > 9 ? num : `0${num}`;
  return `\$${dollars}.${pad(cents)}`;
};

// (String) -> String
export const toMDY = date => {
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getYear() - 100}`;
};
  

// (Array[Donation]) -> OutDonationList
export const prettyPrintMany = ds => ({
  total: getTotal(ds),
  donations: sortByTime(ds.map(prettyPrint))
});

// #prettyPrintMany helpers

// (Array[ShortDonation]) -> Array[ShortDonation]
export const sortByTime = ds => sortBy(ds, d => -new Date(d.date));

// (Array[Donation]) -> Number
export const getTotal = ds => flow(ds => pluck(ds, 'amount'), sum, toDollarStr)(ds);

