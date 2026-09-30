
import { INotification } from "../app/modules/notification/notification.interface";
import { Notification } from "../app/modules/notification/notification.model";
import { User } from "../app/modules/user/user.model";
import { USER_ROLES } from "../enums/user";
import { sendNotificationToFCM } from "./sendNotificationFCM";

export const sendNotifications = async (
  data: INotification
): Promise<INotification> => {
  const result = await Notification.create(data)


  const socketIo = global.socketServer;

  if (socketIo) {
    socketIo.emit(`get-notification::${data?.receiver![0]}`, result);
  }

  if(data?.receiver?.length??0 > 1){
    for(const receiver of data?.receiver!){
      sendNotificationToFCM({
        title: data.title,
        body: data.message,
        data: {
          type: data.filePath,
          id: result._id
        }
      }, receiver)
    }
  }

  return result;
};
export const sendNotificationsAdmin = async (
  data: INotification
): Promise<INotification> => {
  


  const socketIo = global.socketServer;

  const users = await User.find({ role: { $in: [USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN] } });
  data.receiver = users.map((user) => user._id);
  const result = await Notification.create(data);

  if (socketIo) {
   users.forEach((user) => {
      socketIo.emit(`get-notification::${user._id}`, result);
    });
  }

  return result;
};






