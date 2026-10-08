import express from 'express';
import { LockappController } from './lockapp.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { LockappValidations } from './lockapp.validation';

const router = express.Router();

router.route('/')
    .post(auth(),validateRequest(LockappValidations.createLockappZodSchema),LockappController.createLockapp)
    .get(auth(),LockappController.getAllLockapps);

router.route('/:id')
    .delete(auth(),LockappController.deleteLockapp)
    .patch(auth(),validateRequest(LockappValidations.updateLockappZodSchema),LockappController.updateLockapp)

export const LockappRoutes = router;
