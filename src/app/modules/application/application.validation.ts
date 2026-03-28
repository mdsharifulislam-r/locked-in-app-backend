import { z } from 'zod';

const createApplicationZodSchema = z.object({
    body: z.object({
        name:z.string({required_error:'Name is required'}),
        startTime:z.string({required_error:'Start time is required'}),
        duration:z.number({required_error:'Duration is required'}),
        status:z.enum(['Locked','Unlocked'],{required_error:'Status is required'})
    }),
});


export const ApplicationValidations = {
    createApplicationZodSchema
};
