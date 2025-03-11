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
  ]
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User; 