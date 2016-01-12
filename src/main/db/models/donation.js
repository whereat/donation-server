import mg from 'mongoose';

export default mg.model(
  'Donation', mg.Schema({
    name: String,
    email: String,
    amount: Number,
    date: Date
  })
);
