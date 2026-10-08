import { Lockapp } from "../../app/modules/lockapp/lockapp.model";
import { sendScilentNotificationToFCM } from "../../helpers/sendNotificationFCM";

export const sendDeadlineNotifications = async () => {
    try {
        const currentDate = new Date();
        const lockapps = await Lockapp.find({
            unlock_time: { $gte: currentDate },
        }).lean();
        
        await Promise.allSettled(
            lockapps.map(async (lockapp) => {
                try {
                    await sendScilentNotificationToFCM(lockapp, lockapp.user);
                } catch (error) {
                    console.error(`Error processing lockapp with ID ${lockapp._id}:`, error);
                }
            })
        )
    } catch (error) {
        console.error('Error occurred while sending deadline notifications:', error);
    }
}