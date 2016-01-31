import express from 'express';
import { create, getAll } from '../models/donation/dao';
import { validate } from '../models/donation/validate';
import { charge } from '../modules/stripe';
import { assign } from 'lodash';
const r = express.Router();

const sendErr = (err, resp) => resp.status(500).json({ error: err });

assign(r, {
  validate: validate,
  charge: charge,
  create: create,
  getAll: getAll
});

r.post('/', (req, res) => {
  r.validate(req.body)
    .then(r.charge)
    .then(r.create)
    .then(d => res.json(d))
    .catch(err => sendErr(err.message, res));
});

r.get('/', (req, res) => {
  r.getAll()
    .then(ds => res.json(ds))
    .catch(err => sendErr(err.message, res));
});

export default r;
