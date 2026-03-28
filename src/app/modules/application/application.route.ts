import express from 'express';
import { ApplicationController } from './application.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ApplicationValidations } from './application.validation';

const router = express.Router();

router.route('/')
    .post(auth(),validateRequest(ApplicationValidations.createApplicationZodSchema),ApplicationController.createApplication)
    .get(auth(),ApplicationController.getAllApplications)
    .patch(auth(),ApplicationController.unlockApplication)

router.route('/:id')
    .delete(auth(),ApplicationController.deleteApplication)
    
export const ApplicationRoutes = router;
