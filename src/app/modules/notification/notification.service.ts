import { JwtPayload } from "jsonwebtoken";
import { Notification } from "./notification.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { Types } from "mongoose";
import { INotificationUser } from "./notification.interface";
import { User } from "../user/user.model";
import { sendNotifications } from "../../../helpers/notificationHelper";
import { Subscription } from "../subscription/subscription.model";
import { USER_ROLES } from "../../../enums/user";

// Just for single notification update to db
const updateNotificationToDB = async (id: string, user: JwtPayload) => {
  const result = await Notification.findOneAndUpdate(
    { _id: id, readers: { $nin: [new Types.ObjectId(user.id)] } },
    { $addToSet: { readers: user.id } },
    { new: true }
  );
  return result;
};


// Mark all notifications as read
const markAllNotificationsAsRead = async (user: JwtPayload) => {

  const userObjectId = new Types.ObjectId(user.id)
  const result = await Notification.updateMany(
    {
      receiver: {
        $in: [user.id]
      }
    },
    { $addToSet: { readers: user.id } },
  );
  return result;
};


// Get all notifications
const allNotificationFromDB = async (
  user: JwtPayload,
  query: Record<string, any>
) => {

  if (query.date) {
    query.date = new Date(query.date)

  }



  const initialQuery = Notification.find({
    receiver: {
      $in: [user.id],
    }, ...(query.date && { createdAt: { $gte: query.date } })
  });

  const result = new QueryBuilder(initialQuery, query)
    .sort()
    .paginate();

  let unreadCount = await Notification.countDocuments({
    receiver: {
      $in: [user.id],
    },
    readers: {
      $nin: [user.id],
    },
  });

  const [data, pagination] = await Promise.all([
    result.modelQuery.lean(),
    result.getPaginationInfo()
  ])

  return {
    pagination,
    data: {
      unreadCount,
      data: data?.map((notification: any) => ({
        ...notification,
        isRead: notification.readers?.map((reader: any) => reader.toString())?.includes(user?.id),
      }))
    },
  };
};


const sendNotificationsToUser = async (payload: INotificationUser) => {
  try {
    const { type, target, title, message } = payload
    if (target == "all_users") {
      const totalUser = await User.countDocuments({ status: "active", role: USER_ROLES.USER })
      const chunk = Math.ceil(totalUser / 40)
      for (let i = 0; i < chunk; i++) {
        const startIndex = i * 40
        const endIndex = startIndex + 40
        const userIds = await User.find({ status: "active", role: USER_ROLES.USER }).skip(startIndex).limit(endIndex).distinct("_id")
        await sendNotifications({
          title,
          message,
          receiver: userIds,
          isRead: false,
          filePath: type as any,
        })

      }
    }

    if (target == "active_subscribers") {
      const totalActiveSubscribers = await Subscription.countDocuments({ status: "active" })
      const chunk = Math.ceil(totalActiveSubscribers / 40)
      for (let i = 0; i < chunk; i++) {
        const startIndex = i * 40
        const endIndex = startIndex + 40
        const userIds = await Subscription.find({ status: "active" }).skip(startIndex).limit(endIndex).distinct("user")
        await sendNotifications({
          title,
          message,
          receiver: userIds,
          isRead: false,
          filePath: type as any,
        })

      }
    }

    if (target == "inactive_users") {
      const totalInactiveUsers = await User.countDocuments({ verified: false })
      const chunk = Math.ceil(totalInactiveUsers / 40)
      for (let i = 0; i < chunk; i++) {
        const startIndex = i * 40
        const endIndex = startIndex + 40
        const userIds = await User.find({ verified: false }).skip(startIndex).limit(endIndex).distinct("_id")
        await sendNotifications({
          title,
          message,
          receiver: userIds,
          isRead: false,
          filePath: type as any,
        })

      }
    }
  } catch (error) {
    console.log(error);
  }
}

export const NotificationService = {

  updateNotificationToDB,
  allNotificationFromDB,
  markAllNotificationsAsRead,
  sendNotificationsToUser
};
