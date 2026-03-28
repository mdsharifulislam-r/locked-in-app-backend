import { JwtPayload } from 'jsonwebtoken';
import { Model, Types } from 'mongoose';

export type IApplication = {
  name: string;
  startTime: Date;
  duration: number;
  endTime?: Date;
  user:Types.ObjectId;
  status:"Locked" | "Unlocked"
};

export type ApplicationModel = Model<IApplication>;
