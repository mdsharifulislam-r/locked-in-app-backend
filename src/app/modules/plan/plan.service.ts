import { JwtPayload } from 'jsonwebtoken';
import { kafkaProducer } from '../../../tools/kafka/kafka-producers/kafka.producer';

import { IPlan, PlanModel } from './plan.interface';
import { Plan } from './plan.model';
import { RedisHelper } from '../../../tools/redis/redis.helper';

import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import stripe from '../../../config/stripe';



const createPlanOFUserInDB = async (data: IPlan) => {

    const packagek = await stripe.products.create({
        name: data.name,
        description: data.subtitle,
        metadata: {
            price: data.price,
            features: data.features.join(','),
        }
    });
    const price = await stripe.prices.create({
        unit_amount: Math.round(data.price * 100),
        currency: 'usd',
        product: packagek.id,
        recurring:{
            interval:data.category,
            interval_count:data.duration||1
        }
    })
    const paymentLink = await stripe.paymentLinks.create({
        line_items: [
            {
                price: price.id,
                quantity: 1,
            },
        ],
        after_completion: {
            type: 'redirect',
            redirect: {
                url: 'https://example.com/checkout-success',
            },
        },
    })
    const result = await Plan.create({ ...data, productId: packagek.id, priceId: price.id,paymentLink: paymentLink.url });
    return result;
}


const getAllPlans = async () => {

    let result = await Plan.find({ status: 'active'}).sort({ createdAt: -1 }).lean();
    return result;
}


const updatePlansIntoDb = async (id: string, data: Partial<IPlan>) => {
    const exist = await Plan.findOne({ status: 'active', _id: id });
    if (!exist) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Plan not found');
    }
    if(data.price && data.price != exist.price){
        const price = await stripe.prices.create({
            unit_amount: data.price,
            currency: 'usd',
            product: exist.productId
        })
        await stripe.prices.update(exist.priceId, { active: false })
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [
                {
                    price: price.id,
                    quantity: 1,
                },
            ],
            after_completion: {
                type: 'redirect',
                redirect: {
                    url: 'https://example.com/checkout-success',
                },
            },
        })
        data.priceId = price.id
        data.paymentLink = paymentLink.url
    }
    if(data.name && data.name != exist.name){
        const packagek = await stripe.products.create({
            name: data.name,
            description: data.subtitle,
        });
        data.productId = packagek.id
    }
    const result = await Plan.findOneAndUpdate({ status: 'active', _id: id }, data, { new: true });
    return result;
}


const deletePlanFromDB = async (id: string) => {
    const result = await Plan.findOneAndUpdate({ status: 'active', _id: id }, { status: 'inactive' }, { new: true });
    return result;
}


const subscribePlan = async (id: string,user:JwtPayload) => {
    const plan = await Plan.findOne({ status: 'active', _id: id });
    if (!plan) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Plan not found');
    }
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price: plan.priceId,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        metadata: {
            userId: user.id,
            planId: plan._id.toString()
        },
        customer_email: user.email
    });
    return session.url
}






export const PlanServices = {
    createPlanOFUserInDB,
    getAllPlans,
    updatePlansIntoDb,
    deletePlanFromDB,
};
