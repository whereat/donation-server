import express from 'express';
const route = express.Router();

const sendErr = (err, resp) => resp.status(500).json({error: err });

route.post('/donation', (req, res) => {
  const { body, db } = req;
  //TODO add field validation
  db.put(body)
    .then(donation => res.json(donation))
    .catch(err => sendErr(err));
});

route.get('/donations', (req, res) => {
  req.db.getAll()
    .then(ds => res.json(ds))
    .catch(err => sendErr(err));
});

export default route;
