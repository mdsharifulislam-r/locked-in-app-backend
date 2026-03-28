import express from 'express';
import { ContactController } from './contact.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ContactValidations } from './contact.validation';


const router = express.Router();

router.route('/')
    .post(auth(),validateRequest(ContactValidations.createContactZodSchema),ContactController.createContact)
    .get(auth(),ContactController.getAllContacts)

router.post('/otp-request',auth(),validateRequest(ContactValidations.otpRequestZodSchema),ContactController.emargencyUnlockApp)

router.post('/verify-otp',auth(),validateRequest(ContactValidations.verifyUnlockOtpZodSchema),ContactController.verifyUnlockOtp)

router.route('/:id')
    .get(auth(),ContactController.getSingleContact)
    .delete(auth(),ContactController.deleteContact)
    .patch(auth(),validateRequest(ContactValidations.updateContactZodSchema),ContactController.updateContact)

export const ContactRoutes = router;
