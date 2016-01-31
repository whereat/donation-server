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

import { assign } from 'lodash';

export const nonDollarMsg = d => `donation amount must be a number; provided: ${d.amount}`;
export const dollarPattern = /^(\$?)(\d+)(\.?)(\d*)$/;

// (String) -> Boolean
const matchesDollarPattern = amt => amt.trim().match(dollarPattern);
  
// (RawDonation) -> Promise[Donation]
export const parse = d =>
  typeof d.amount === 'number' || matchesDollarPattern(d.amount) ?
  Promise.resolve( assign({},d, { amount: toCents(d.amount) }) ) :
  Promise.reject( new Error(nonDollarMsg(d)) ); 

// (Either[String, Number]) ->  Number
export const toCents = amt => {
  switch(typeof amt) {
  case 'string':
    const matches = matchesDollarPattern(amt);
    return !matches ? 0 : parseInt(matches[2]) * 100 + (parseInt(matches[4]) || 0);
  default:
    return amt * 100;
  }
};

