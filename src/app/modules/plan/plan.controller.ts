import { Request, Response, NextFunction } from 'express';
import { PlanServices } from './plan.service';
import catchAsync from '../../../shared/catchAsync';

const createPlan = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const payload = req.body;
    payload.user = user.id
    const result = await PlanServices.createPlanOFUserInDB(payload);
    return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Plan created successfully',
        data: result,
    });
})


const getAllPlans = catchAsync(async (req: Request, res: Response) => {
    const result = await PlanServices.getAllPlans();
    return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Plan data retrieved successfully',
        data: result,
    });
})



const updatePlan = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ...data } = req.body;
    const result = await PlanServices.updatePlansIntoDb(id, data);
    return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Plan updated successfully',
        data: result,
    });
})

const deletePlan = catchAsync(
    async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PlanServices.deletePlanFromDB(id);
    return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Plan deleted successfully',
        data: result,
    });
}
)



export const PlanController = {
    createPlan,
    getAllPlans,
    updatePlan,
    deletePlan,
};
