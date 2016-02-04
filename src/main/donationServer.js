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

import app from './app';
import { dbUri } from './config';
import db from 'mongoose';
db.Promise = Promise;

const connect = () => 
  db.connect(dbUri, { server: { socketOptions: { keepAlive: 1 } } }).connection;

const listen = () =>
  app.listen(3000, () => console.log('App listening on port 3000'));

connect()
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);
