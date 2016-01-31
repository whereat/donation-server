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

import stripe from 'stripe';
import { stripeKey } from '../config';
const s = stripe(stripeKey);

// () -> Promise[String]
export const getToken = () => new Promise(
  (rslv, rjct) =>
    s.tokens.create({
      card: {
        "number": '4242424242424242',
        "exp_month": 12,
        "exp_year": 2017,
        "cvc": '123'
      }
    },(err, token) => err ? rjct(err) : rslv(token)));

// (Donation) -> StripeCharge
export const toCharge = d => ({
  amount: d.amount,
  currency: "usd",
  source: d.token,
  description: "Riseup Labs Donation"
});

// (Donation) -> Promise[Donation]
export const charge = d => new Promise(
  (rslv, rjct) =>
    s.charges.create(
      toCharge(d),
      (err, chg) => err ? rjct(err) : rslv(d)));

