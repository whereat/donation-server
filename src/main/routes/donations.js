/**
 *
 * Copyright (c) 2015-present, Total Location Test Paragraph.
 * All rights reserved.
 *
 * This file is part of Where@. Where@ is free software:
 * you can redistribute it and/or modify it under the terms of
 * the GNU General Public License (GPL), either version 3
 * of the License, or (at your option) any later version.
 *
 * Where@ is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For more details,
 * see the full license at <http://www.gnu.org/licenses/gpl-3.0.en.html>
 *
 */

import express from 'express';
import { create, getAll } from '../models/donation/dao';
import { validate } from '../models/donation/validate';
import { parse } from '../models/donation/parse';
import { prettyPrint, prettyPrintMany } from '../models/donation/prettyPrint';
import { charge } from '../modules/stripe';
import { assign } from 'lodash';
const r = express.Router();

const sendErr = (err, resp) => {
  console.log('Error processing donation: ', err);
  resp.status(500).json({ error: err });
};

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
