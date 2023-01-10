/* eslint-disable prettier/prettier */
import { z } from "zod";
import mongoose from "mongoose";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";

import WorkspaceModel from "../models/Workspace"
import { getBearer } from "../../utils/bearer";
import { JwtPayload } from "jsonwebtoken";
import UserModel from "../models/User.model";


export const workspaceRouter = router({

  createWorkspace: protectedProcedure
  .input(z.object({
    workspaceName: z.string(),
    descriptionPurpose: z.string()
  }))
  .mutation(async ({input, ctx}) => {
    const bearerRes = await getBearer(ctx.req) as JwtPayload
    const workspace = new WorkspaceModel({
      _id: new mongoose.Types.ObjectId(), 
      workspaceName: input.workspaceName, 
      descriptionPurpose: input.descriptionPurpose, 
      members: [{
          _id: new mongoose.Types.ObjectId(), 
          userId: new mongoose.Types.ObjectId(bearerRes.user), 
          role: "admin"}], 
      tokens: 1000
    })
    await workspace.save()

    //TODO error handeling? if creation fails?
    return true;
  }),

  //gets all the workspaces the user belongs to
  getWorkspaces: protectedProcedure
  .query(async ({ctx}) => {
    const bearerRes = await getBearer(ctx.req) as JwtPayload
    const userWorkspaces = await WorkspaceModel.find<{_id: mongoose.Types.ObjectId, workspaceName: string, descriptionPurpose: string, tokens: number}>({
        "members.userId": new mongoose.Types.ObjectId(bearerRes.user)
    },
    {
        _id: 1, "workspaceName": 1, "descriptionPurpose": 1, "tokens": 1
    })

    return userWorkspaces
  }),

  //checks if the workspace with the giver id exists
  doesWorkspaceExist: protectedProcedure
  .input(z.object({
    workspaceId: z.string()
  }))
  .mutation(async ({input, ctx}) => {
    
    const bearerRes = await getBearer(ctx.req)
    console.log(bearerRes)
    if(bearerRes instanceof TRPCError)
    {
      throw bearerRes
    }
    else
    {
      const workspace = await WorkspaceModel.findOne(
        {
            _id: new mongoose.Types.ObjectId(input.workspaceId),
            "members.userId":  new mongoose.Types.ObjectId(bearerRes.user)
        },
        {
            _id: 1, "workspaceName": 1
        })

        if(workspace)
        {
          return {doesExist: true}
        }
        else
        {
          return {doesExist: false}
        }
    }

    
  }),

  //gets data associated with a member of a workspace, like role, last used fuel price etc
  getMemberData: protectedProcedure
  .input(z.object({
    workspaceId: z.string()
  }))
  .query(async ({input, ctx}) => {
    const bearerRes = await getBearer(ctx.req) as JwtPayload
    const members = await WorkspaceModel.aggregate<{memberId: string, memberRole: string, lastUsedVehicleId: string, lastUsedFuelPrice: number}>([
      {
          '$match': {'_id': new mongoose.Types.ObjectId(input.workspaceId), 'members.userId': new mongoose.Types.ObjectId(bearerRes.user)}
      },
      {
          '$project': {"_id": 0, 'member': '$members'}
      },
      {
          '$unwind': '$member'
      },
      {
          '$project': {"memberId": "$member._id", "memberRole": "$member.role", "lastUsedFuelPrice": "$member.lastUsedFuelPrice", "lastUsedVehicleId": "$member.lastUsedVehicleId"}
      }
    ])

    if(members.length > 0)
    {
        return members[0]
    }
    else
    {
        throw new TRPCError({message: "No member with that userId found in workspace", code: "NOT_FOUND"})
    }
  }),

  setLastUsedWorkspace: protectedProcedure
  .input(z.object({
    workspaceId: z.string()
  }))
  .mutation(async ({input, ctx}) => {
    const bearerRes = await getBearer(ctx.req) as JwtPayload

    await UserModel.updateOne(
        {_id: new mongoose.Types.ObjectId(bearerRes['user'])},
        {$set: {lastUsedWorkspaceId: input.workspaceId}})
        .then(res => {console.log(res)})
  })
});
