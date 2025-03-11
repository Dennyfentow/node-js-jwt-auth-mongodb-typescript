import mongoose from 'mongoose';
import { IRole } from './interfaces/role.interface';

const RoleSchema = new mongoose.Schema({
  name: String
});

const Role = mongoose.model<IRole>('Role', RoleSchema);

export default Role; 