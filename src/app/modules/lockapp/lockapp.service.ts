import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../builder/QueryBuilder';
import { ILockapp, LockappModel } from './lockapp.interface';
import { Lockapp } from './lockapp.model';

const createLockappInDB = async (data: ILockapp): Promise<ILockapp> => {
    const lockapp = await Lockapp.create(data);
    return lockapp;
}


const updateLockappInDB = async (id: string, data: Partial<ILockapp>): Promise<ILockapp | null> => {
    const updatedLockapp = await Lockapp.findByIdAndUpdate(id, data, { new: true });
    return updatedLockapp;
}

const deleteLockappFromDB = async (id: string): Promise<ILockapp | null> => {
    const deletedLockapp = await Lockapp.findByIdAndDelete(id);
    return deletedLockapp;
}

const getAllLockappsFromDB = async (query: Record<string, any>, user: JwtPayload) => {
    const initQuery = new QueryBuilder(Lockapp.find({ user: user.id }), query).paginate().sort();
    const [data, pagination] = await Promise.all([
        initQuery.modelQuery.lean(),
        initQuery.getPaginationInfo()
    ]);
    return { data, pagination };
}



export const LockappServices = {
    createLockappInDB,
    updateLockappInDB,
    deleteLockappFromDB,
    getAllLockappsFromDB
};
