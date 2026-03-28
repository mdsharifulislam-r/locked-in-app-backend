import { Request, Response, NextFunction } from 'express';
import { ApplicationServices } from './application.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const createApplication = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const payload = req.body;
    payload.user = user.id
    const result = await ApplicationServices.createApplication(payload);
    return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Application created successfully',
        data: result,
    })
})

const getAllApplications = catchAsync(async (req: Request, res: Response) => {
    const result = await ApplicationServices.getAllApplication(req.user, req.query)
    return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Application data retrieved successfully',
        data: result.applicationInfos,
        pagination: result.pagination
    })
})

const deleteApplication = catchAsync(async (req: Request, res: Response) => {
    const result = await ApplicationServices.deleteApplication(req.params.id);
    return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Application deleted successfully',
        data: result,
    })
})

const unlockApplication = catchAsync(async (req: Request, res: Response) => {
    const result = await ApplicationServices.unlockApplication(req.body.name, req.body);
    return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Application unlocked successfully',
        data: result,
    })
})


export const ApplicationController = {
    createApplication,
    getAllApplications,
    deleteApplication,
    unlockApplication
};
