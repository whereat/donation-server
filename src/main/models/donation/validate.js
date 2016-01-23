import { domainFields as df } from './dao';
import { assign, reduce, pluck, omit, keys, includes, values, flow } from 'lodash';

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

// has no empty values
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

// TODO: has valid donation amount
// move regexp in `stripe#toCents` here (and import into stripe)

// has all of the above properties
const validations = [correctFields, nonEmpty, goodEmail];
export const validate = d => {
  const {err, rec} = flow(...validations)({rec: d, err: null});
  return err ? Promise.reject(err) : Promise.resolve(rec);
};
