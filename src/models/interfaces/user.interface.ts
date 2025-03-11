import { Document, Types } from 'mongoose';
import { IRole } from './role.interface';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  roles: Types.ObjectId[] | IRole[];
} 