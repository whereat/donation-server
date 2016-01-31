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

