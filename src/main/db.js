import donations from '../test/support/sampleDonations';

const db = {};

db.put = (donation, cb) => new Promise(
  (rslv, rej) => rslv(donation));

db.getAll = () => new Promise(
  (rslv, rej) => rslv(donations));

export default db;
