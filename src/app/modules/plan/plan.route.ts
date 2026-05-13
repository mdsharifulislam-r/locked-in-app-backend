import express from 'express';
import { PlanController } from './plan.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { PlanValidations } from './plan.validation';
import tempAuth from '../../middlewares/tempAuth';

const router = express.Router();

router.route('/')
    .post(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), validateRequest(PlanValidations.createPlanZodSchema), PlanController.createPlan)
    .get(tempAuth(), PlanController.getAllPlans)

router.route('/:id')
    .patch(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), validateRequest(PlanValidations.updatePlanZodSchema), PlanController.updatePlan)
    .delete(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), PlanController.deletePlan)





export const PlanRoutes = router;
