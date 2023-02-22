"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  DriverModel: () => Driver_model_default,
  Leg_ZodSchema: () => Leg_ZodSchema,
  UserModel: () => User_model_default,
  WorkspaceModel: () => Workspace_model_default
});
module.exports = __toCommonJS(src_exports);

// src/Driver.model.ts
var import_mongoose = __toESM(require("mongoose"));
var DriverSchema = new import_mongoose.default.Schema({
  _id: import_mongoose.default.Types.ObjectId,
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  lastUsedWorkspaceId: String
});
var Driver_model_default = import_mongoose.default.models.Driver || import_mongoose.default.model("Driver", DriverSchema);

// src/User.model.ts
var import_mongoose2 = __toESM(require("mongoose"));
var UserSchema = new import_mongoose2.default.Schema({
  _id: import_mongoose2.default.Types.ObjectId,
  accType: String,
  provider_id: String,
  userName: String,
  userNameWithTag: String,
  email: String,
  password: String,
  lastUsedWorkspaceId: String
});
var User_model_default = import_mongoose2.default.models.User || import_mongoose2.default.model("User", UserSchema);

// src/Workspace.model.ts
var import_zod = require("zod");
var import_mongoose3 = __toESM(require("mongoose"));
var Leg_ZodSchema = import_zod.z.object({
  givenAddress: import_zod.z.string(),
  fullAddressStr: import_zod.z.string(),
  legDetails: import_zod.z.object({ name: import_zod.z.string(), value: import_zod.z.string() }).array(),
  avoidTolls: import_zod.z.boolean(),
  legStatus: import_zod.z.number()
});
var WorkspaceSchema = new import_mongoose3.default.Schema({
  _id: import_mongoose3.default.Types.ObjectId,
  workspaceName: String,
  descriptionPurpose: { type: String, default: "" },
  members: { type: [{ _id: import_mongoose3.default.Types.ObjectId, userId: import_mongoose3.default.Types.ObjectId, role: String, lastUsedVehicleId: String, lastUsedFuelPrice: Number }], default: [] },
  tokens: Number,
  addressBook: { type: [{ _id: import_mongoose3.default.Types.ObjectId, physicalAddress: String, addressDescription: String }], default: [] },
  vehicleList: { type: [{ _id: import_mongoose3.default.Types.ObjectId, vehicleDescription: String, vehicleLicencePlate: String, litersPer100km: Number, additionalCost: Number, additionalCostType: Number, vehicleClass: String }], default: [] },
  drivers: { type: [{ _id: import_mongoose3.default.Types.ObjectId, driverId: import_mongoose3.default.Types.ObjectId, accepted: Boolean }], default: [] },
  tripNr: { type: Number, default: 1 },
  drivableTrips: {
    type: [{
      _id: import_mongoose3.default.Types.ObjectId,
      assignedDriverId: import_mongoose3.default.Types.ObjectId,
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
var Workspace_model_default = import_mongoose3.default.models.Workspace || import_mongoose3.default.model("Workspace", WorkspaceSchema);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DriverModel,
  Leg_ZodSchema,
  UserModel,
  WorkspaceModel
});
//# sourceMappingURL=index.js.map