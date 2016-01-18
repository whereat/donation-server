import mg from 'mongoose';
import { assign, pick} from 'lodash';

const schema = mg.Schema({
  amount: Number,
  date: Date,
  token: String,
  anonymous: Boolean,
  name: String,      
  email: String
});

export default mg.model('Donation', schema);

