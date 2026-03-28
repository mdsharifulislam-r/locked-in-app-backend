import { z } from 'zod';


const createPlanZodSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Name is required' }),
        subtitle: z.string({ required_error: 'Subtitle is required' }),
        price: z.number({ required_error: 'Price is required' }),
        features: z.array(z.string({ required_error: 'Features is required' })),
        category:z.enum(['month','year'],{required_error:'Category is required'}),
        duration:z.number({required_error:'Duration is required'}),
        app_amount:z.number({required_error:'App amount is required'}),
    }),
});


const updatePlanZodSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        subtitle: z.string().optional(),
        price: z.number().optional(),
        features: z.array(z.string()).optional(),
        category:z.enum(['month','year']).optional(),
        duration:z.number().optional(),
        app_amount:z.number().optional(),
    }),
});



export const PlanValidations = {
    createPlanZodSchema,
    updatePlanZodSchema
};
