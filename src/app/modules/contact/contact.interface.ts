import { Model, Types } from 'mongoose';
import { CONTACT_RELATIONSHIP } from '../../../enums/user';

export type IContact = {
  user:Types.ObjectId;
  name: string;
  email: string;
  contact: string;
  relation: CONTACT_RELATIONSHIP
};

export type ContactModel = Model<IContact>;

export type IEmargencyUnlockPayload = {
  contactId:Types.ObjectId;
  message?:string,
  appName:string,
  
};


export type IUnlockOtpSessionPayload = {
  contactId:Types.ObjectId;
  appName:string,
  otp:number,
  expireAt:Date
};

export type UnlockOtpSessionModel = Model<IUnlockOtpSessionPayload>;