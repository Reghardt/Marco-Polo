/* eslint-disable prettier/prettier */
import { z } from "zod";
import mongoose from "mongoose";
import { protectedProcedure, router } from "../trpc";
import Workspace, { IVehicleListEntry } from "../models/Workspace";
import { getBearer } from "../../utils/bearer";
import { JwtPayload } from "jsonwebtoken";




export const vehicleRouter = router({

  vehicleList: protectedProcedure
  .input(z.object({
      workspaceId: z.string()
  }))
  .query(async ({input}) => {
      console.log("get vehicle list fired")
      const workspace = await Workspace.findOne(
          {
              _id: new mongoose.Types.ObjectId(input.workspaceId)
          }, 
          {
              vehicleList: 1
          })
      console.log(workspace)

      return {vehicleList: workspace?.vehicleList ?? []}
  })
  ,

  createVehicle: protectedProcedure
  .input(z.object({
    workspaceId: z.string(), 
    vehicleDescription: z.string(), 
    vehicleLicencePlate: z.string(), 
    litersPer100km: z.number(), 
    additionalCost: z.number(), 
    additionalCostType: z.number(), 
    vehicleClass: z.string()
  }))
  .mutation(async ({input, ctx}) => {
    
    const newVehicle = await Workspace.updateOne({
        _id: new mongoose.Types.ObjectId(input.workspaceId)
    },
    {
        $push: {vehicleList: {
                    _id: new mongoose.Types.ObjectId(),
                    vehicleDescription: input.vehicleDescription,
                    vehicleLicencePlate: input.vehicleLicencePlate,
                    litersPer100km: input.litersPer100km,
                    additionalCost: input.additionalCost,
                    additionalCostType: input.additionalCostType,
                    vehicleClass: input.vehicleClass
                }}
    })
    console.log(newVehicle)
    return
  }),
  deleteVehicle: protectedProcedure
  .input(z.object({
    workspaceId: z.string(), 
    vehicleId: z.string()
  }))
  .mutation(async ({input}) => {
    const deletedVehicle = await Workspace.updateOne({
        _id: new mongoose.Types.ObjectId(input.workspaceId)
    },
    {
        $pull: {vehicleList: {_id: new mongoose.Types.ObjectId(input.vehicleId)}}
    })
    console.log(deletedVehicle)
    return;
  }),

  setLastUsedVehicle: protectedProcedure
  .input(z.object({
    workspaceId: z.string(), 
    vehicleId: z.string()
  }))
  .mutation(async ({input,ctx}) => {
    console.log("set last used vehicle fired")
    const bearer = await getBearer(ctx.req) as JwtPayload; //TODO pass only bearer as ctx when it is valid, handle error in middleware
    const updated = await Workspace.updateOne({
        _id: new mongoose.Types.ObjectId(input.workspaceId),
        "members.userId":  new mongoose.Types.ObjectId(bearer.user)
    },
    {
        $set: {"members.$.lastUsedVehicleId": input.vehicleId}
    })

    console.log(updated)

    return;
  }),

  getVehicleById: protectedProcedure
  .input(z.object({
    workspaceId: z.string(),
    vehicleId: z.string()
  }))
  .query(async ({input}) => {
    const vehicle = await Workspace.aggregate<{_id: mongoose.Types.ObjectId, vehicle: IVehicleListEntry}>([
      {$match: {"_id": new mongoose.Types.ObjectId(input.workspaceId), "vehicleList._id": new mongoose.Types.ObjectId(input.vehicleId)}},
    
      {$project : {"_id": 0, "vehicle": "$vehicleList"}},
      {
        $unwind: "$vehicle"
      },
      {
        $match:{"vehicle._id": new mongoose.Types.ObjectId(input.vehicleId)}
      }
      ])
  return vehicle[0]
  }),

  setFuelPrice: protectedProcedure
  .input(z.object({
    workspaceId: z.string(), 
    fuelPrice: z.string()
  }))
  .mutation(async ({input, ctx}) => {
    const bearer = await getBearer(ctx.req) as JwtPayload; //TODO pass only bearer as ctx when it is valid, handle error in middleware
    const updated = await Workspace.updateOne({
      _id: new mongoose.Types.ObjectId(input.workspaceId),
      "members.userId":  new mongoose.Types.ObjectId(bearer.user)
    },
    {
        $set: {"members.$.lastUsedFuelPrice": input.fuelPrice}
    })

    //TODO check if updated

    return
  })
});
