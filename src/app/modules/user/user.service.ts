import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import { AuthHelper } from '../auth/auth.helper';
import { Response } from 'express';
import QueryBuilder from '../../builder/QueryBuilder';
import { Subscription } from '../subscription/subscription.model';
import { Plan } from '../plan/plan.model';

const createUserToDB = async (payload: Partial<IUser>, res: Response) => {
  const isExist = await User.findOne({ email: payload.email });
  if (isExist) {
    if (isExist.status === 'delete') throw new ApiError(StatusCodes.BAD_REQUEST, 'You don’t have permission to access this content.It looks like your account has been deactivated.');
    if (!isExist.verified) {
      return await AuthHelper.unverifiedAccountHandle(payload.email!, res);
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exist!');

  }
  payload.role = USER_ROLES.USER;
  const createUser = await User.create(payload);
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  //send email
  const otp = generateOTP();
  const values = {
    name: createUser.name,
    otp: otp,
    email: createUser.email!,
  };
  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate(
    { _id: createUser._id },
    { $set: { authentication } }
  );

  return createUser;
};

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.findById(id).populate('subscription').lean()
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};


const getUserListFromDB = async (query: Record<string, any>) => {
  const userQuery = new QueryBuilder(User.find({ role: USER_ROLES.USER, verified: true }), query).search(['name', 'email']).filter().sort().paginate()

  const [data, pagination] = await Promise.all([userQuery.modelQuery.populate('subscription', 'name').lean(), userQuery.getPaginationInfo()])
  return {
    data,
    pagination
  }
}

const lockUnlockUserFromDb = async (userId: string,) => {
  const isExistUser = await User.isExistUserById(userId);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const updateDoc = await User.findOneAndUpdate({ _id: userId }, { status: isExistUser.status === 'active' ? 'delete' : 'active' }, {
    new: true,
  });

  return updateDoc;
}

const getStaticsFromDb = async () => {
  const totalUser = await User.countDocuments({ role: USER_ROLES.USER, verified: true })
  const totalSubscriber = await Subscription.countDocuments({ status: "active" })
  const totalRevenue = await Subscription.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$price" } } },
  ])
  const totalPlans = await Plan.countDocuments({ status: { $ne: "delete" } })

  const thisYearStartDate = new Date(new Date().getFullYear(), 0, 1)
  const thisYearEndDate = new Date(new Date().getFullYear(), 11, 31)

  const revenueByMonth = await Subscription.aggregate([
    {
      $match: {
        createdAt: {
          $gte: thisYearStartDate,
          $lte: thisYearEndDate
        }
      }
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalRevenue: { $sum: "$price" }
      }
    },
    { $sort: { _id: 1 } }
  ])

  const monthlySubscribers = await Subscription.aggregate([
    {
      $match: {
        createdAt: {
          $gte: thisYearStartDate,
          $lte: thisYearEndDate
        }
      }
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalSubscribers: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ])

  const monthlyUsers = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: thisYearStartDate,
          $lte: thisYearEndDate
        },
        role: USER_ROLES.USER,
        verified: true
      }
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalUsers: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ])

  const months = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec'
  }

  const montlyData: {
    totalRevenue: number,
    totalSubscribers: number,
    totalUsers: number,
    monthName: string
  }[] = []

  for (let month in months) {
    const monthNumber = Number(month)
    const monthName = months[monthNumber as keyof typeof months]
    const monthlyRevenue = revenueByMonth.find((item) => item._id === monthNumber)
    const monthlySubscriber = monthlySubscribers.find((item) => item._id === monthNumber)
    const monthlyUser = monthlyUsers.find((item) => item._id === monthNumber)
    montlyData.push({
      totalRevenue: monthlyRevenue?.totalRevenue || 0,
      totalSubscribers: monthlySubscriber?.totalSubscribers || 0,
      totalUsers: monthlyUser?.totalUsers || 0,
      monthName
    })
  }



  return {
    totalUser,
    totalSubscriber,
    totalRevenue: totalRevenue[0]?.totalRevenue || 0,
    totalPlans,
    montlyData
  }
}
export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  getUserListFromDB,
  lockUnlockUserFromDb,
  getStaticsFromDb
};
