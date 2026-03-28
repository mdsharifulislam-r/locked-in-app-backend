import { Schema, model } from 'mongoose';
import { IContact, ContactModel, IUnlockOtpSessionPayload, UnlockOtpSessionModel } from './contact.interface'; 
import { CONTACT_RELATIONSHIP } from '../../../enums/user';

const contactSchema = new Schema<IContact, ContactModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  relation: {
    type: String,
    enum: Object.values(CONTACT_RELATIONSHIP),
    required: true,
  },
}, {
  timestamps: true
});

contactSchema.index({user:1})

export const Contact = model<IContact, ContactModel>('Contact', contactSchema);


const unlockOtpSessionSchema = new Schema<IUnlockOtpSessionPayload,UnlockOtpSessionModel>({
  contactId: {
    type: Schema.Types.ObjectId,
    ref: 'Contact',
  },
  appName: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  expireAt: {
    type: Date,
    required: false,
    default: Date.now() + 10 * 60 * 1000,
  },
})


export const UnlockOtpSession = model<IUnlockOtpSessionPayload,UnlockOtpSessionModel>('UnlockOtpSession', unlockOtpSessionSchema);
