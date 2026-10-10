import { Types } from 'mongoose';
import { getMessaging } from 'firebase-admin/messaging';
import firebaseApp from '../config/firebase';
import { User } from '../app/modules/user/user.model';

export type IFirebaseNotification = {
  title: string;
  body: string;
  data?: Record<string, unknown>;
};


export const sendNotificationToFCM = async (
  { title, body, data }: IFirebaseNotification,
  userId: Types.ObjectId,
) => {
  const stringData: Record<string, string> = {};

  if (data) {
    for (const keyData in data) {
      stringData[keyData] = String(data[keyData]);
    }
  }

  const user = await User.findById(userId).lean();
  if (!user || !user?.fcmTokens?.length) {
    return;
  }

  const message = {
    notification: {
      title,
      body,
    },
    data: stringData,
    tokens: user.fcmTokens,
  };

  try {
    const messaging = getMessaging(firebaseApp);
    const response = await messaging.sendEachForMulticast(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
export const sendScilentNotificationToFCM = async (
  data: Record<string, any>,
  userId: Types.ObjectId,
) => {

  const user = await User.findById(userId).lean();
  if (!user || !user?.fcmTokens?.length) {
    return;
  }

  try {
    const messaging = getMessaging(firebaseApp);
    const response = await messaging.sendEachForMulticast({
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
          },
        },
        headers: {
          'apns-push-type': 'background',
          'apns-priority': '5',
        },
      },
      tokens: user.fcmTokens,
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
