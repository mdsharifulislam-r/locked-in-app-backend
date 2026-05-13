import { Model, Types } from "mongoose";

export type INotification = {
  receiver?: Types.ObjectId[];
  title: string;
  message: string;
  isRead: boolean;
  createdAt?: Date;
  filePath?: "booking" | "payment" | "general" | "review" | "user" | "subscription";
  referenceId?: Types.ObjectId;
  readers?: Types.ObjectId[];
};

export type NotificationModel = Model<INotification>;


export type INotificationUser = {
  target: "all_users" | "active_subscribers" | "inactive_users",
  type: "all" | "subscription" | "booking" | "payment" | "general" | "review",
  title: string,
  message: string,
};

