import { JwtPayload } from 'jsonwebtoken';
import {
  ContactModel,
  IContact,
  IEmargencyUnlockPayload,
  IUnlockOtpSessionPayload,
} from './contact.interface';
import { Contact, UnlockOtpSession } from './contact.model';
import QueryBuilder from '../../builder/QueryBuilder';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { emailTemplate } from '../../../shared/emailTemplate';
import generateOTP from '../../../util/generateOTP';
import { emailHelper } from '../../../helpers/emailHelper';

const createContactIntoDB = async (
  data: IContact,
  user: JwtPayload,
): Promise<IContact> => {
  if (user.email === data.email)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You can not add yourself as a contact.',
    );
  const exist = await Contact.findOne({ email: data.email });
  if (exist)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Contact already exist.');
  data.user = user.id;
  const result = await Contact.create(data);
  return result;
};

const getAllContactFromDB = async (
  user: JwtPayload,
  query: Record<string, any>,
) => {
  const contactQuery = new QueryBuilder(Contact.find({ user: user.id }), query)
    .paginate()
    .search(['name', 'email', 'contact'])
    .sort();
  const [contactInfos, pagination] = await Promise.all([
    contactQuery.modelQuery.exec(),
    contactQuery.getPaginationInfo(),
  ]);
  return { contactInfos, pagination };
};

const deleteContactFromDB = async (id: string): Promise<IContact | null> => {
  const result = await Contact.findByIdAndDelete(id);
  return result;
};

const updateContactToDB = async (
  id: string,
  payload: Partial<IContact>,
): Promise<IContact | null> => {
  const result = await Contact.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const getSingleContactFromDB = async (id: string): Promise<IContact | null> => {
  const result = await Contact.findById(id);
  return result;
};

const emargencyUnlockApp = async (payload: IEmargencyUnlockPayload) => {
  const contact = await Contact.findById(payload.contactId).populate('user');
  if (!contact) throw new ApiError(StatusCodes.NOT_FOUND, 'Contact not found');

  const otpSession = await UnlockOtpSession.findOne({
    contactId: payload.contactId,
    appName: payload.appName,
  });
  
if (otpSession && Date.now() < new Date(otpSession.expireAt).getTime()) {
  throw new ApiError(StatusCodes.BAD_REQUEST, 'Otp already sent');
}

  const otp = generateOTP();

  const emailTemp = emailTemplate.emargencyUnlockAppOtpTemplate({
    appName: payload.appName,
    userMessage: payload.message!,
    name: contact.name,
    email: contact.email,
    otp: otp,
    userName: (contact.user as any).name,
  });

  emailHelper.sendEmail(emailTemp);
  const result = await UnlockOtpSession.create({
    contactId: payload.contactId,
    appName: payload.appName,
    otp: otp,
  });

  return true
};


const verifyUnlockOtp = async (payload: IUnlockOtpSessionPayload) => {
  const otpSession = await UnlockOtpSession.findOne({
    contactId: payload.contactId,
    appName: payload.appName,
  });

  console.log(otpSession);

  
  if (!otpSession) throw new ApiError(StatusCodes.BAD_REQUEST, 'Otp session not found');
  if (otpSession.otp !== payload.otp) throw new ApiError(StatusCodes.BAD_REQUEST, 'Wrong otp');
  if(Date.now() > otpSession.expireAt.getTime()) throw new ApiError(StatusCodes.BAD_REQUEST, 'Otp session expired');
  await UnlockOtpSession.findByIdAndDelete(otpSession.id);
  return true;
};

export const ContactServices = {
  createContactIntoDB,
  getAllContactFromDB,
  deleteContactFromDB,
  updateContactToDB,
  getSingleContactFromDB,
  emargencyUnlockApp,
  verifyUnlockOtp
};
