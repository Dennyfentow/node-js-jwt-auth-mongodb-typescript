import { Document, Types } from 'mongoose';
import { IRole } from './role.interface';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  roles: Types.ObjectId[] | IRole[];
  name: string;
  institution: string;
  department: string;
  terms_accepted: boolean;
  results: Object;
  result_simulator: Object;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  last_login: Date;
} 