import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { ContactRoutes } from '../app/modules/contact/contact.route';
import { DisclaimerRoutes } from '../app/modules/disclaimer/disclaimer.route';
import { PlanRoutes } from '../app/modules/plan/plan.route';
import { SubscriptionRoutes } from '../app/modules/subscription/subscription.route';
import { NotificationRoutes } from '../app/modules/notification/notification.routes';
import { ApplicationRoutes } from '../app/modules/application/application.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path:'/contact',
    route:ContactRoutes
  },
  {
    path:'/disclaimer',
    route:DisclaimerRoutes
  },
  {
    path: '/plan',
    route: PlanRoutes,
  },
  {
    path:"/subscription",
    route:SubscriptionRoutes
  },
  {
    path:"/notification",
    route:NotificationRoutes
  },
  {
    path:"/application",
    route:ApplicationRoutes
  }
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
