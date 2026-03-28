import { Model, Types } from 'mongoose';

export type IPlan = {
  name: string;
  subtitle: string;
  price: number;
  features: string[],
  status: 'active' | 'inactive',
  category: 'month' | 'year'|'week'
  duration: number,
  priceId: string,
  paymentLink: string,
  productId: string,
  app_amount: number,
};

export type PlanModel = Model<IPlan>;


