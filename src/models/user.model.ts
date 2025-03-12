import mongoose from 'mongoose';
import { IUser } from './interfaces/user.interface';

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ],
  name: String,
  institution: String,
  department: String,
  results: Object,
  result_simulator: Object,
  created_at: Date,
  updated_at: Date,
  is_active: Boolean,
  last_login: Date
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User; 