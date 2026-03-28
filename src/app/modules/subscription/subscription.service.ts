import axios from "axios";
import { ObjectId } from "mongoose";
import config from "../../../config";
import { Subscription } from "../subscription/subscription.model";
import { User } from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";

import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/QueryBuilder";
import stripe from "../../../config/stripe";
import { RedisHelper } from "../../../tools/redis/redis.helper";
import generateOTP from "../../../util/generateOTP";
import { emailHelper } from "../../../helpers/emailHelper";
import { emailTemplate } from "../../../shared/emailTemplate";
import { Plan } from "../plan/plan.model";

export interface AppleReceiptResponse {
  status: number;
  environment: "Sandbox" | "Production";
  receipt: {
    receipt_type: string;
    bundle_id: string;
    in_app: AppleInAppTransaction[];
  };
  latest_receipt_info: AppleInAppTransaction[];
  latest_receipt: string;
}

export interface AppleInAppTransaction {
  quantity?: string;
  product_id: string;
  transaction_id: string;
  original_transaction_id: string;
  purchase_date_ms: string;
  expires_date_ms?: string;
  is_trial_period?: "true" | "false";
  is_in_intro_offer_period?: "true" | "false";
  auto_renew_status?: "0" | "1";
}

const APPLE_PRODUCTION_URL = "https://buy.itunes.apple.com/verifyReceipt";
const APPLE_SANDBOX_URL = "https://sandbox.itunes.apple.com/verifyReceipt";

const verifyAppleReceipt = async (receipt: string, userId: ObjectId) => {
  // 🔹 First try production, if fails then sandbox
  let response;
  try {
    response = await axios.post(APPLE_PRODUCTION_URL, {
      "receipt-data": receipt,
      password:"",
      "exclude-old-transactions": true,
    });
  } catch {
    response = await axios.post(APPLE_SANDBOX_URL, {
      "receipt-data": receipt,
      password:"",
      "exclude-old-transactions": true,
    });
  }

  const data: AppleReceiptResponse = response.data;

  if (data.status !== 0) {
    throw new Error("Invalid Apple receipt");
  }

  // Get latest transaction
  const latest = data.latest_receipt_info?.[0];
  if (!latest) {
    throw new Error("No transactions found in receipt");
  }

  // Convert expiry date
  const expiresMs = latest.expires_date_ms
    ? Number(latest.expires_date_ms)
    : Date.now();

  // 🔹 Expire existing subscription first
  const existing = await Subscription.findOne({
    user: userId,
    status: "active",
  });

  if (existing) {
    existing.status = "expired";
    await existing.save();
  }

  // 🔹 Create new subscription
  const subscription = await Subscription.create({
    name: "Apple Subscription",
    price: 100, // You may map product_id → price dynamically
    startDate: new Date(),
    endDate: new Date(expiresMs),
    txId: latest.transaction_id,
    user: userId,
    status: "active",
  });

  // 🔹 Update user subscription ref
  await User.findByIdAndUpdate(userId, {
    subscription: subscription._id,
  });

  
  return subscription;
};

const subscribeByStripe = async (PlanId: string, user: JwtPayload) => {
  const PlanData = await Plan.findById(PlanId);
  const userExist = await User.findById(user.id);
  if(!userExist){
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  if (!PlanData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Plan doesn't exist!");
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: PlanData.priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `http://localhost:3000/success`,
    cancel_url: `http://localhost:3000/cancel`,
    customer_email: userExist.email,
    
    metadata: {
      userId: user.id,
      planId: PlanData._id.toString()
    }

  });

  return session?.url
}

const demoSubscriptionForTest = async (PlanId:string,user:JwtPayload)=>{

  const PlanData = await Plan.findById(PlanId);
  if(!PlanData){
    throw new ApiError(StatusCodes.BAD_REQUEST, "Plan doesn't exist!");
  }

  const statrDate =new Date()
  // const endDate = PlanData.category === "year" ? new Date(statrDate.getFullYear() + 1, statrDate.getMonth(), statrDate.getDate()) : new Date(statrDate.getFullYear(), statrDate.getMonth() + (PlanData. || 1), statrDate.getDate());

  await User.findOneAndUpdate({ _id: user.id }, { $set: { subscription: null } });
  await Subscription.updateMany({ user: user.id,status:"active" }, { $set: { status: "inactive" } });
  const subscription = await Subscription.create({
    name: PlanData.name,
    price: PlanData.price,
    startDate: new Date(),
    // endDate: endDate,
    txId: "demo",
    user: user.id,
    status: "active",
    Plan: PlanId
  });

  await User.findByIdAndUpdate(user.id, {
    subscription: subscription._id,
  });



  return subscription;
}


const getSubscriptionByUser = async (user: JwtPayload,query:Record<string,any>) => {
  const subscription = new QueryBuilder(Subscription.find({ user: user.id }), query).paginate().sort()

  const [subscriptions,pagination] = await Promise.all([
    subscription.modelQuery.exec(),
    subscription.getPaginationInfo()
  ])

  return {
    data:subscriptions,
    pagination
  }
};

const subscribedUser = async (query:Record<string,any>) => {
  const SubscriptionQuery = new QueryBuilder(Subscription.find({status:"active"}), query).paginate().sort()

  const [subscriptions,pagination] = await Promise.all([
    SubscriptionQuery.modelQuery.populate("user",'name email profile address phone').exec(),
    SubscriptionQuery.getPaginationInfo()
  ])

  return {
    data:subscriptions,
    pagination
  }
}




const subscriptionUsers = async (query:Record<string,any>) => {
  const SubscriptionQuery = new QueryBuilder(Subscription.find(), query).paginate().sort()

  const [subscriptions,pagination] = await Promise.all([
    SubscriptionQuery.modelQuery.populate([
      {
        path: "user",
        select: "name email profile address phone"
      },
      {
        path: "package",
        select: "name price"
      }
    ]).exec(),
    SubscriptionQuery.getPaginationInfo()
  ])

  return {
    data:subscriptions,
    pagination
  }
}

const getSubscriptionDetailsById = async (id:string) => {
  const subscription = await Subscription.findById(id).populate([
    {
      path: "user",
      select: "name email profile  address location"
    },
    {
      path: "Plan",
      select: "name price"
    }
  ]).lean();
  return subscription;
}




const renewSubscription = async (user: JwtPayload) => {
  const subscription = await Subscription.findOne({ user: user.id,status:"active" }).lean()
  if (!subscription) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "You have no active subscription! Please subscribe first.");
  }

  const plan = await Plan.findById(subscription.package).lean()
  if (!plan) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Plan doesn't exist! Please choose another plan.");
  }

  return subscribeByStripe(plan._id.toString(), user);

};

export const SubscriptionService = {
  verifyAppleReceipt,
  getSubscriptionByUser,
  subscribedUser,
  demoSubscriptionForTest,
  subscribeByStripe,

  subscriptionUsers,
  getSubscriptionDetailsById,

  renewSubscription
};
