import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import db from './db/dao';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => { req.db = db; next(); });
app.use('/', routes);

export default app;
