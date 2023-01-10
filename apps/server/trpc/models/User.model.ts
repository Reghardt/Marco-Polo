/* eslint-disable prettier/prettier */
import mongoose, { Types } from "mongoose"

export interface IUser{
    _id: mongoose.Types.ObjectId
    accType: string;
    provider_id: string;
    userName: string;
    email: string;
    password: string;
    lastUsedWorkspaceId: string;
}

const UserSchema = new mongoose.Schema<IUser>({
    _id: mongoose.Types.ObjectId,
    accType: String,
    provider_id: String,
    userName: String,
    email: String,
    password: String,
    lastUsedWorkspaceId: String,
    })

// const UserModel = mongoose.model("users", UserSchema) //the first paramater is the name of the collection into which it will be placed on the DB
// export default UserModel;

export default (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema)
