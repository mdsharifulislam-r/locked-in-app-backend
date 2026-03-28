import { Request, Response, NextFunction } from 'express';
import { ContactServices } from './contact.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createContact = catchAsync(async (req: Request, res: Response) => {
    const { ...contactData } = req.body;
    const result = await ContactServices.createContactIntoDB(contactData, req.user);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Contact created successfully',
      data: result,
    });
  });

const getAllContacts = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactServices.getAllContactFromDB(req.user, req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All contacts retrieved successfully',
    data: result.contactInfos,
    pagination: result.pagination,
  });
})


const getSingleContact = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactServices.getSingleContactFromDB(req.params.id);  

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Contact retrieved successfully',
    data: result,
  })
})


const deleteContact = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactServices.deleteContactFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Contact deleted successfully',
    data: result,
  })
})

const updateContact = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactServices.updateContactToDB(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Contact updated successfully',
    data: result,
  })
})


const emargencyUnlockApp = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactServices.emargencyUnlockApp(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Otp sent successfully',
    data: result,
  })
})


const verifyUnlockOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactServices.verifyUnlockOtp(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Otp verified successfully',
    data: result,
  })
})

export const ContactController = {
  createContact,
  getAllContacts,
  getSingleContact,
  deleteContact,
  updateContact,
  emargencyUnlockApp,
  verifyUnlockOtp
};
