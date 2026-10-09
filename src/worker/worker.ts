import cron from 'node-cron'
import { sendDeadlineNotifications } from './handlers/sendDeadlineNotificationsHandler';

export const worker = () => {
    cron.schedule('* * * * *', () => {
       sendDeadlineNotifications()
       console.log('Deadline notifications sent');
    });
}