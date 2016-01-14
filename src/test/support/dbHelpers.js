import { assign, pick } from 'lodash';

export const domainFields = [
  'date',
  'amount',
  'email',
  'name'
];

const stripDbFields = rec => pick(rec, domainFields);
const resolveDate = dStr => new Date(dStr).toString();
const resolveDateField = rec => assign({}, rec, {date: resolveDate(rec.date)});

export const demongoify = rec => resolveDateField(stripDbFields(rec));
export const demongoifyMany = recs => recs.map(demongoify);
