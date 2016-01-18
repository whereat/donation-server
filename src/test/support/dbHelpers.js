import { assign } from 'lodash';

export const mongoify = d =>
  assign({}, d, { _id: 'fakeId1', __v: '0', date: new Date(d.date) });
