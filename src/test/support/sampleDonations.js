import { omit, assign } from 'lodash';
import { getToken } from '../../main/modules/stripe';

export const tokens = [
  "tok_17UaeFGd2qyJIviy37ObydXB",
  "tok_17UapNGd2qyJIviyb9aoqZyw",
  "tok_17UaoMGd2qyJIviyiKmpRzm6"
];

export const ds = [
    {
      amount: 100,
      date: 'Sun Dec 27 2015 00:00:01 GMT-0500 (EST)',
      token: tokens[0],
      anonymous: true,
      name: 'donor1',
      email: 'donor1@example.com'
    },
    {
      amount: 200,
      date: 'Sun Dec 27 2015 00:00:02 GMT-0500 (EST)',
      token: tokens[1],
      anonymous: false,
      name: 'donor2',
      email: 'donor2@example.com'
    },
    {
      amount: 300,
      date: 'Sun Dec 27 2015 00:00:03 GMT-0500 (EST)',
      token: tokens[2],
      anonymous: false,
      name: 'donor3',
      email: 'donor3@example.com'
    }
];

export const shortDs = [
    {
      amount: 100,
      date: 'Sun Dec 27 2015 00:00:01 GMT-0500 (EST)',
      name: 'Anonymous'
    },
    {
      amount: 200,
      date: 'Sun Dec 27 2015 00:00:02 GMT-0500 (EST)',
      name: 'donor2'
    },
    {
      amount: 300,
      date: 'Sun Dec 27 2015 00:00:03 GMT-0500 (EST)',
      name: 'donor3'
    }
];

export const dResponse = {
  total: 600,
  donations: shortDs.reverse()
};

export const getStripeD = () =>
  getToken()
  .then(t => assign({}, ds[0], {token: t.id}));

export const anon = assign({}, ds[0], { anonymous: false });
export const missing = omit(ds[0], 'name');
export const extra = assign({}, ds[0], { foo: 'bar'});
export const empty = assign({}, ds[0], { name: ''});
export const badEmail1 = assign({}, ds[0], { email: 'foo@bar' });
export const badEmail2 = assign({}, ds[0], { email: 'foobar.com' });
export const badEmail3 = assign({}, ds[0], { email: 'foo@ bar.com' });

