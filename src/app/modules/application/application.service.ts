import { JwtPayload } from 'jsonwebtoken';
import { ApplicationModel, IApplication } from './application.interface';
import { Application } from './application.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createApplication = async (application: IApplication) => {
    const exist = await Application.findOne({ name: application.name });
    if (exist){
        await Application.findOneAndUpdate({ name: application.name }, application);
    }else{
        await Application.create(application);
    }
};

const getAllApplication = async (user:JwtPayload, query: Record<string, any>)=> {
    const result = new QueryBuilder(Application.find({ user: user.id }), query)
    .paginate()
    .search(['name'])
    .sort();
    const [applicationInfos, pagination] = await Promise.all([
        result.modelQuery.exec(),
        result.getPaginationInfo(),
    ]);
    return { applicationInfos, pagination };
};

const deleteApplication = async (id: string) => {
    await Application.findByIdAndDelete(id);
};

const unlockApplication = async (name: string,payload:Partial<IApplication>) => {
    await Application.findOneAndUpdate({ name }, payload, { new: true });
}

export const ApplicationServices = {
    createApplication,
    getAllApplication,
    deleteApplication,
    unlockApplication
};
