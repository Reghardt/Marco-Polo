// src/Driver.model.ts
import mongoose from "mongoose";
var DriverSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  lastUsedWorkspaceId: String
});
var Driver_model_default = mongoose.models.Driver || mongoose.model("Driver", DriverSchema);

// src/User.model.ts
import mongoose2 from "mongoose";
var UserSchema = new mongoose2.Schema({
  _id: mongoose2.Types.ObjectId,
  accType: String,
  provider_id: String,
  userName: String,
  userNameWithTag: String,
  email: String,
  password: String,
  lastUsedWorkspaceId: String
});
var User_model_default = mongoose2.models.User || mongoose2.model("User", UserSchema);

// src/Workspace.model.ts
import { z } from "zod";
import mongoose3 from "mongoose";
var Leg_ZodSchema = z.object({
  givenAddress: z.string(),
  fullAddressStr: z.string(),
  legDetails: z.object({ name: z.string(), value: z.string() }).array(),
  avoidTolls: z.boolean(),
  legStatus: z.number()
});
var WorkspaceSchema = new mongoose3.Schema({
  _id: mongoose3.Types.ObjectId,
  workspaceName: String,
  descriptionPurpose: { type: String, default: "" },
  members: { type: [{ _id: mongoose3.Types.ObjectId, userId: mongoose3.Types.ObjectId, role: String, lastUsedVehicleId: String, lastUsedFuelPrice: Number }], default: [] },
  tokens: Number,
  addressBook: { type: [{ _id: mongoose3.Types.ObjectId, physicalAddress: String, addressDescription: String }], default: [] },
  vehicleList: { type: [{ _id: mongoose3.Types.ObjectId, vehicleDescription: String, vehicleLicencePlate: String, litersPer100km: Number, additionalCost: Number, additionalCostType: Number, vehicleClass: String }], default: [] },
  drivers: { type: [{ _id: mongoose3.Types.ObjectId, driverId: mongoose3.Types.ObjectId, accepted: Boolean }], default: [] },
  tripNr: { type: Number, default: 1 },
  drivableTrips: {
    type: [{
      _id: mongoose3.Types.ObjectId,
      assignedDriverId: mongoose3.Types.ObjectId,
      tripName: String,
      num: Number,
      date: String,
      notes: String,
      tripStatus: { type: Number, default: 0 },
      legs: [{
        givenAddress: String,
        fullAddressStr: String,
        legDetails: { type: [{ name: String, value: String }], default: [] },
        avoidTolls: Boolean,
        legStatus: { type: Number, default: 0 }
      }]
    }],
    default: []
  }
});
var Workspace_model_default = mongoose3.models.Workspace || mongoose3.model("Workspace", WorkspaceSchema);
export {
  Driver_model_default as DriverModel,
  Leg_ZodSchema,
  User_model_default as UserModel,
  Workspace_model_default as WorkspaceModel
};
//# sourceMappingURL=index.mjs.map