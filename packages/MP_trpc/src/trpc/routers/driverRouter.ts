import { protectedProcedure, router } from "../trpc"
import { z } from "zod";

import mongoose from "mongoose";
import { TRPCError } from "@trpc/server";
import { DriverModel, Leg_ZodSchema, WorkspaceModel } from "dbmodels";

export const driverRouter = router({
    addDriver: protectedProcedure
    .input(z.object({
        username: z.string()
    }))
    .mutation(async ({input, ctx}) => {
        console.log("FIRED: addDriver")
        const driver = await DriverModel.findOne({username: input.username})

        if(driver)
        {
            const addedDriver = await WorkspaceModel.updateOne({_id: new mongoose.Types.ObjectId(ctx.workspaceId)}, {"$push": {drivers: {_id : new mongoose.Types.ObjectId(), driverId: driver._id, accepted: false}}})
            return
        }
        else
        {
            throw new TRPCError({message: "Driver not found", code: "NOT_FOUND"})
        }
    }),

    getDrivers: protectedProcedure
    .query(async ({ctx}) => {
        console.log("FIRED: getDrivers")
            const driversInWorkspace = (await WorkspaceModel.findOne({_id: ctx.workspaceId}, {drivers: 1}))?.drivers
        if(driversInWorkspace !== undefined)
        {
            console.log("found at least one driver", driversInWorkspace)
            const driverIds: mongoose.Types.ObjectId[] = []
            for(let i = 0; i < driversInWorkspace.length; i++)
            {
                const driver = driversInWorkspace[i]
                if(driver)
                {
                    driverIds.push(new mongoose.Types.ObjectId(driver.driverId))
                }
                
                
                
            }
            const driverDetails = await DriverModel.find({_id: { $in: [...driverIds]}}, {password: 0})
            return driverDetails
        }
        return []
    }),

    
    sendTripToDriver: protectedProcedure
    .input(z.object({
        assignedDriverId: z.string(), 
        legs: Leg_ZodSchema.array(), 
        tripName: z.string()
    }))
    .mutation(async ({input, ctx}) => {
        console.log("FIRED: sendTripToDriver")

        const updateRes = await WorkspaceModel.updateOne({_id: ctx.workspaceId}, {
            $push: { 
                drivableTrips: { 
                    _id: new mongoose.Types.ObjectId(), 
                    assignedDriverId: new mongoose.Types.ObjectId(input.assignedDriverId), 
                    tripName: input.tripName,
                    num: 1,
                    date: "",
                    notes: "",
                    legs: input.legs,
                    tripStatus: 0
                }
            }
        })
        console.log(updateRes)
        return
    })
})