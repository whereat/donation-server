import stripe from 'stripe';
import { stripeKey } from '../config';
const s = stripe(stripeKey);

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

export const toCents = amt => {
  switch(typeof amt) {
  case 'string':
    const matches = amt.trim().match(/(\$?)(\d+)(\.?)(\d+)/);
    return parseInt(matches[2]) * 100 + parseInt(matches[4]);
  default:
    return amt * 100;
  }
};

export const toCharge = d => ({
  amount: toCents(d.amount),
  currency: "usd",
  source: d.token,
  description: "Riseup Labs Donation"
});

export const charge = d => new Promise(
  (rslv, rjct) =>
    s.charges.create(
      toCharge(d),
      (err, chg) => err ? rjct(err) : rslv(d)));

