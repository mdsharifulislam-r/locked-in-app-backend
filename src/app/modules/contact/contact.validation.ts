import { z } from 'zod';
import { CONTACT_RELATIONSHIP } from '../../../enums/user';
import mongoose from 'mongoose';

const createContactZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z.string({ required_error: 'Email is required' }),
    contact: z.string({ required_error: 'Contact is required' }),
    relation: z.nativeEnum(CONTACT_RELATIONSHIP),
  }),
});

const updateContactZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    contact: z.string().optional(),
    relation: z.nativeEnum(CONTACT_RELATIONSHIP).optional(),
  }),
});


const otpRequestZodSchema = z.object({
  body: z.object({
    appName: z.string({ required_error: 'AppName is required' }),
    message: z.string({ required_error: 'Message is required' }).optional(),
    contactId: z.string({ required_error: 'ContactId is required' }).refine((id) => mongoose.Types.ObjectId.isValid(id), 'Invalid contactId'),
  }),
});

const verifyUnlockOtpZodSchema = z.object({
  body: z.object({
    appName: z.string({ required_error: 'AppName is required' }),
    contactId: z.string({ required_error: 'ContactId is required' }).refine((id) => mongoose.Types.ObjectId.isValid(id), 'Invalid contactId'),
    otp: z.number({ required_error: 'Otp is required' }),
  }),
});

export const ContactValidations = {
  createContactZodSchema,
  updateContactZodSchema,
  otpRequestZodSchema,
  verifyUnlockOtpZodSchema
};
