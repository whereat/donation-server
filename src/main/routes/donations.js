import express from 'express';
import dao from '../models/donation/dao';
const route = express.Router();

const sendErr = (err, resp) => resp.status(500).json({ error: err });

route.post('/', (req, res) => {
  // TODO: validate(req.body).then(d => charge(d)).then(d => res.json(d)).catch(...)
  dao.create(req.body)
    .then(d => res.json(d))
    .catch(err => sendErr(err.message, res));
});

route.get('/', (req, res) => {
  dao.getAll()
    .then(ds => res.json(ds))
    .catch(err => sendErr(err.message, res));
});

export default route;
