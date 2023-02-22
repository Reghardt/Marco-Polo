/* eslint-disable prettier/prettier */
import { z } from "zod";
import mongoose from "mongoose";
import { protectedProcedure, router } from "../trpc";
import { IVehicleListEntry, WorkspaceModel } from "dbmodels";


export const vehicleRouter = router({

  vehicleList: protectedProcedure
  .query(async ({ctx}) => {
    console.log("FIRED: vehicleList")
      const workspace = await WorkspaceModel.findOne(
          {
              _id: new mongoose.Types.ObjectId(ctx.workspaceId)
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
    vehicleDescription: z.string(), 
    vehicleLicencePlate: z.string(), 
    litersPer100km: z.number(), 
    additionalCost: z.number(), 
    additionalCostType: z.number(), 
    vehicleClass: z.string()
  }))
  .mutation(async ({input, ctx}) => {
    console.log("FIRED: createVehicle")
    const newVehicle = await WorkspaceModel.updateOne({
        _id: new mongoose.Types.ObjectId(ctx.workspaceId)
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
    vehicleId: z.string()
  }))
  .mutation(async ({input, ctx}) => {
    console.log("FIRED: deleteVehicle")
    const deletedVehicle = await WorkspaceModel.updateOne({
        _id: new mongoose.Types.ObjectId(ctx.workspaceId)
    },
    {
        $pull: {vehicleList: {_id: new mongoose.Types.ObjectId(input.vehicleId)}}
    })
    console.log(deletedVehicle)
    return;
  }),

  setLastUsedVehicle: protectedProcedure
  .input(z.object({
    vehicleId: z.string()
  }))
  .mutation(async ({input,ctx}) => {
    console.log("FIRED: setLastUsedVehicle")

    const updated = await WorkspaceModel.updateOne({
        _id: new mongoose.Types.ObjectId(ctx.workspaceId),
        "members.userId":  new mongoose.Types.ObjectId(ctx.userId)
    },
    {
        $set: {"members.$.lastUsedVehicleId": input.vehicleId}
    })

    console.log(updated)

    return;
  }),

  getVehicleById: protectedProcedure
  .input(z.object({
    vehicleId: z.string()
  }))
  .query(async ({input, ctx}) => {
    console.log("FIRED: getVehicleById")
    const vehicle = await WorkspaceModel.aggregate<{_id: mongoose.Types.ObjectId, vehicle: IVehicleListEntry}>([
      {$match: {"_id": new mongoose.Types.ObjectId(ctx.workspaceId), "vehicleList._id": new mongoose.Types.ObjectId(input.vehicleId)}},
    
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
    fuelPrice: z.string()
  }))
  .mutation(async ({input, ctx}) => {
    console.log("FIRED: setFuelPrice")
    await WorkspaceModel.updateOne(
      {
      _id: new mongoose.Types.ObjectId(ctx.workspaceId),
      "members.userId":  new mongoose.Types.ObjectId(ctx.userId)
      },
      {
          $set: {"members.$.lastUsedFuelPrice": input.fuelPrice}
      }
    )

    //TODO check if updated

    return
  })
});
