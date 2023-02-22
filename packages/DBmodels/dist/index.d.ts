import mongoose from 'mongoose';
import { z } from 'zod';

interface IDriver extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    lastUsedWorkspaceId: string;
}
declare const _default$2: mongoose.Model<IDriver, {}, {}, {}, any>;

interface IUser {
    _id: mongoose.Types.ObjectId;
    accType: string;
    provider_id: string;
    userName: string;
    userNameWithTag: string;
    email: string;
    password: string;
    lastUsedWorkspaceId: string;
}
declare const _default$1: mongoose.Model<IUser, {}, {}, {}, any>;

interface IMember {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    role: string;
    lastUsedVehicleId: string;
    lastUsedFuelPrice: number;
}
type IAddressBookEntry = {
    _id: mongoose.Types.ObjectId;
    physicalAddress: string;
    addressDescription: string;
};
interface IVehicleListEntry {
    _id: mongoose.Types.ObjectId;
    vehicleDescription: string;
    vehicleLicencePlate: string;
    litersPer100km: number;
    additionalCost: number;
    additionalCostType: number;
    vehicleClass: string;
}
interface IDrivers {
    _id: mongoose.Types.ObjectId;
    driverId: mongoose.Types.ObjectId;
    accepted: boolean;
}
declare const Leg_ZodSchema: z.ZodObject<{
    givenAddress: z.ZodString;
    fullAddressStr: z.ZodString;
    legDetails: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        value: string;
    }, {
        name: string;
        value: string;
    }>, "many">;
    avoidTolls: z.ZodBoolean;
    legStatus: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    givenAddress: string;
    fullAddressStr: string;
    legDetails: {
        name: string;
        value: string;
    }[];
    avoidTolls: boolean;
    legStatus: number;
}, {
    givenAddress: string;
    fullAddressStr: string;
    legDetails: {
        name: string;
        value: string;
    }[];
    avoidTolls: boolean;
    legStatus: number;
}>;
type TLeg = z.infer<typeof Leg_ZodSchema>;
interface IDrivableTrip {
    _id: mongoose.Types.ObjectId;
    tripName: string;
    num: number;
    date: string;
    notes: string;
    assignedDriverId: mongoose.Types.ObjectId;
    legs: z.infer<typeof Leg_ZodSchema>[];
    tripStatus: number;
}
interface IWorkspace extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    workspaceName: string;
    descriptionPurpose: string;
    members: IMember[];
    tokens: number;
    addressBook: IAddressBookEntry[];
    vehicleList: IVehicleListEntry[];
    drivers: IDrivers[];
    tripNr: number;
    drivableTrips: IDrivableTrip[];
}
declare const _default: mongoose.Model<IWorkspace, {}, {}, {}, any>;

export { _default$2 as DriverModel, IAddressBookEntry, IDrivableTrip, IDriver, IDrivers, IMember, IUser, IVehicleListEntry, IWorkspace, Leg_ZodSchema, TLeg, _default$1 as UserModel, _default as WorkspaceModel };
