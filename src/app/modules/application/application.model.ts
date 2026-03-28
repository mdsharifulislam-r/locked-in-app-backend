import { Schema, model } from 'mongoose';
import { IApplication, ApplicationModel } from './application.interface'; 

const applicationSchema = new Schema<IApplication, ApplicationModel>({
  name: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  endTime: {
    type: Date,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Locked', 'Unlocked'],
    default: 'Locked',
  }
}, {
  timestamps: true
});


applicationSchema.pre('save', function (next) {
  this.endTime = new Date(this.startTime.getTime() + this.duration * 60 * 60 * 1000);
  next();
});

export const Application = model<IApplication, ApplicationModel>('Application', applicationSchema);
