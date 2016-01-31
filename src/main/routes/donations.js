import express from 'express';
import { create, getAll } from '../models/donation/dao';
import { validate } from '../models/donation/validate';
import { parse } from '../models/donation/parse';
import { prettyPrint, prettyPrintMany } from '../models/donation/prettyPrint';
import { charge } from '../modules/stripe';
import { assign } from 'lodash';
const r = express.Router();

const sendErr = (err, resp) => resp.status(500).json({ error: err });

assign(r, {
  charge: charge,
  create: create,
  getAll: getAll,
  parse: parse,
  prettyPrint: prettyPrint,
  prettyPrintMany: prettyPrintMany,
  validate: validate
});

r.post('/', (req, res) => {
  r.parse(req.body)
    .then(r.validate)
    .then(r.charge)
    .then(r.create)
    .then(d => res.json(r.prettyPrint(d)))
    .catch(err => sendErr(err.message, res));
});

r.get('/', (req, res) => {
  r.getAll()
    .then(ds => res.json(r.prettyPrintMany(ds)))
    .catch(err => sendErr(err.message, res));
});

export default r;
