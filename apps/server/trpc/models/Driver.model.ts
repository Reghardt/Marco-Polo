/* eslint-disable prettier/prettier */
import mongoose from "mongoose";

export interface IDriver extends mongoose.Document{
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    lastUsedWorkspaceId: string;
}

const DriverSchema = new mongoose.Schema<IDriver>({
    _id: mongoose.Types.ObjectId,
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    lastUsedWorkspaceId: String
})

// const DriverModel = mongoose.model("drivers", DriverSchema);
// export default DriverModel;

export default (mongoose.models.Driver as mongoose.Model<IDriver>) || mongoose.model<IDriver>('Driver', DriverSchema)
