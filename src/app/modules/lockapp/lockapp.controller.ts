import { Request, Response, NextFunction } from 'express';
import { LockappServices } from './lockapp.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createLockapp = catchAsync(async (req: Request, res: Response) => {
    const { ...lockappData } = req.body;
    lockappData.user = req.user.id; // Assuming you have user information in the request object
    const result = await LockappServices.createLockappInDB(lockappData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lockapp created successfully',
      data: result,
    });
  })



const updateLockapp = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ...data } = req.body;
    const result = await LockappServices.updateLockappInDB(id, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lockapp updated successfully',
      data: result,
    });
  })

const deleteLockapp = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await LockappServices.deleteLockappFromDB(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lockapp deleted successfully',
      data: result,
    });
  })

const getAllLockapps = catchAsync(async (req: Request, res: Response) => {
    const result = await LockappServices.getAllLockappsFromDB(req.query, req.user);
  
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'All lockapps retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  })


export const LockappController = {
    createLockapp,
    updateLockapp,
    deleteLockapp,
    getAllLockapps
};
