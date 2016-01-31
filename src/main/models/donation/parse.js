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

