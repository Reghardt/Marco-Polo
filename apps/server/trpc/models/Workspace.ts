import { z } from "zod";
import mongoose from "mongoose";

export interface IMember{
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    role: string
    lastUsedVehicleId: string;
    lastUsedFuelPrice: number;
}

export type IAddressBookEntry = {
    _id: mongoose.Types.ObjectId;
    physicalAddress: string;
    addressDescription: string;
}

export interface IVehicleListEntry{
    _id: mongoose.Types.ObjectId;
    vehicleDescription: string;
    vehicleLicencePlate: string;
    litersPer100km: number;
    additionalCost: number;
    additionalCostType: number; // 1 = R/hr, 2 = R/100km
    vehicleClass: string;
}

export interface IDrivers{
    _id: mongoose.Types.ObjectId;
    driverId: mongoose.Types.ObjectId;
    accepted: boolean;
}

export const Leg_ZodSchema = z.object({
    givenAddress: z.string(),
    fullAddressStr: z.string(),
    legDetails: z.object({name: z.string(), value: z.string()}).array(),
    avoidTolls: z.boolean(),
    legStatus: z.number(),
})
export type TLeg = z.infer<typeof Leg_ZodSchema> //infer type to be used in client

export interface IDrivableTrip {
    _id: mongoose.Types.ObjectId;
    tripName: string;
    num: number;
    date: string;
    notes: string;
    assignedDriverId: mongoose.Types.ObjectId;
    legs: z.infer<typeof Leg_ZodSchema>[];
    tripStatus: number;
}

export interface IWorkspace extends mongoose.Document {
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



const WorkspaceSchema = new mongoose.Schema<IWorkspace>({
    _id: mongoose.Types.ObjectId,
    workspaceName: String,
    descriptionPurpose: {type: String, default: ""},
    members: {type: [{_id: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, role: String, lastUsedVehicleId: String, lastUsedFuelPrice: Number}], default: []},
    tokens: Number,
    addressBook: { type: [{_id: mongoose.Types.ObjectId, physicalAddress: String, addressDescription: String}], default: []},
    vehicleList: { type: [{_id: mongoose.Types.ObjectId, vehicleDescription: String, vehicleLicencePlate: String, litersPer100km: Number, additionalCost: Number, additionalCostType: Number, vehicleClass: String }], default: []},
    drivers: {type: [{_id: mongoose.Types.ObjectId, driverId: mongoose.Types.ObjectId, accepted: Boolean}], default: []},
    tripNr: {type: Number, default: 1},
    drivableTrips: {
        type: [{
            _id: mongoose.Types.ObjectId, 
            assignedDriverId: mongoose.Types.ObjectId, 
            tripName: String,
            num: Number,
            date: String,
            notes: String,
            tripStatus: {type: Number, default: 0},
            legs: [{
                givenAddress: String,
                fullAddressStr: String,
                legDetails: {type: [{name: String, value: String}], default: []},
                avoidTolls: Boolean,
                legStatus: {type: Number, default: 0}
            }]
        }]
        ,default: []
    }
})

// const WorkspaceModel = mongoose.model("workspaces", WorkspaceSchema)
// export default WorkspaceModel;

export default (mongoose.models.Workspace as mongoose.Model<IWorkspace>) || mongoose.model<IWorkspace>('Workspace', WorkspaceSchema)