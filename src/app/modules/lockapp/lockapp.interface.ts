import { Model, Types } from 'mongoose';

export type ILockapp = {
  app_name: string;
  app_id: string;
  unlock_time:Date;
  user:Types.ObjectId
};

export type LockappModel = Model<ILockapp>;
