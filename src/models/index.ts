import mongoose from 'mongoose';
import User from './user.model';
import Role from './role.model';

mongoose.Promise = global.Promise;

interface DB {
  mongoose: typeof mongoose;
  user: typeof User;
  role: typeof Role;
  ROLES: string[];
}

const db: DB = {
  mongoose,
  user: User,
  role: Role,
  ROLES: ["user", "admin", "moderator"]
};

export default db; 