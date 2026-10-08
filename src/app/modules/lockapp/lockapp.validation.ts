import { z } from 'zod';

const createLockappZodSchema = z.object({
  body: z.object({
    app_name: z.string(),
    app_id: z.string(),
    unlock_time: z.coerce.date().refine((date) => date > new Date(), {
      message: "Unlock time must be a future date",
    }),
  }),
});


const updateLockappZodSchema = z.object({
  body: z.object({
    app_name: z.string().optional(),
    app_id: z.string().optional(),
    unlock_time: z.coerce.date().refine((date) => date > new Date(), {
      message: "Unlock time must be a future date",
    }).optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});




export const LockappValidations = {
    createLockappZodSchema,
    updateLockappZodSchema
};
