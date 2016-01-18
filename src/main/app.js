import express from 'express';
import bodyParser from 'body-parser';
import donations from './routes/donations';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/donations', donations);

export default app;
