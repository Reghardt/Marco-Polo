/* eslint-disable prettier/prettier */
import mongoose from "mongoose"

export interface IUser{
    _id: mongoose.Types.ObjectId
    accType: string;
    provider_id: string;
    userName: string;
    userNameWithTag: string;
    email: string;
    password: string;
    lastUsedWorkspaceId: string;
}

const UserSchema = new mongoose.Schema<IUser>({
    _id: mongoose.Types.ObjectId,
    accType: String,
    provider_id: String,
    userName: String,
    userNameWithTag: String,
    email: String,
    password: String,
    lastUsedWorkspaceId: String,
    })

//const UserModel = mongoose.model("users", UserSchema) //the first paramater is the name of the collection into which it will be placed on the DB

export default (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema)


// export default UserModel;