import { Schema, model } from 'mongoose';
import { IPlan, PlanModel } from './plan.interface'; 


const planSchema = new Schema<IPlan, PlanModel>({
  name: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  category: {
    type: String,
    enum: ['month', 'year'],
    default: 'month',
  },
  duration: {
    type: Number,
    required: true,
  },
  priceId: {
    type: String,
    required: true,
  },
  paymentLink: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  app_amount: {
    type: Number,
    default: 1
  },
}, { timestamps: true });



export const Plan = model<IPlan, PlanModel>('Plan', planSchema);
