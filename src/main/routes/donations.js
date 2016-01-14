import express from 'express';
import dao from '../db/dao/donations';
const route = express.Router();

const sendErr = (err, resp) => resp.status(500).json({ error: err });

route.post('/', (req, res) => {
  return dao.create(req.body)
    .then(d => Promise.resolve(res.send(d)))
    .catch(err => sendErr(err.message, res));
});

route.get('/', (req, res) => {
  dao.getAll()
    .then(ds => res.json(ds))
    .catch(err => sendErr(err.message, res));
});

export default route;
