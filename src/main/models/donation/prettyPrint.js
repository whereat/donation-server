import { assign, flow, map, sortBy, pick, pluck, sum } from 'lodash';

// (Donation) -> OutDonation
export const prettyPrint = d => flow(anonymize, pickFields, formatAmount)(d);

// (Donation) -> ShortDonation
export const anonymize = d => assign({}, d, { name: d.anonymous ? 'Anonymous' : d.name });
export const pickFields = d => pick(d, 'amount', 'date', 'name');
export const formatAmount = d => assign({}, d, { amount: toDollarStr(d.amount) });

// (Number) -> String
export const toDollarStr = num => {
  const [ dollars, cents ] = [ Math.floor(num/100), num % 100 ];
  const pad = num => num > 9 ? num : `0${num}`;
  return `\$${dollars}.${pad(cents)}`;
};

// (Array[Donation]) -> OutDonationList
export const prettyPrintMany = ds => ({
  total: getTotal(ds),
  donations: sortByTime(ds.map(prettyPrint))
});

// #prettyPrintMany helpers

// (Array[ShortDonation]) -> Array[ShortDonation]
export const sortByTime = ds => sortBy(ds, d => - new Date(d).getTime());

// (Array[Donation]) -> Number
export const getTotal = ds => flow(ds => pluck(ds, 'amount'), sum, toDollarStr)(ds);

