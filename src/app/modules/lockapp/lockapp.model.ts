import { Schema, model } from 'mongoose';
import { ILockapp, LockappModel } from './lockapp.interface'; 

const lockappSchema = new Schema<ILockapp, LockappModel>({
  app_name: { type: String, required: true },
  app_id: { type: String, required: true },
  unlock_time: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

export const Lockapp = model<ILockapp, LockappModel>('Lockapp', lockappSchema);
