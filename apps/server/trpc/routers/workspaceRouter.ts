/* eslint-disable prettier/prettier */
import { z } from "zod";
import mongoose from "mongoose";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";

import WorkspaceModel from "../models/Workspace"
import UserModel from "../models/User.model";
import { createAndSignAccessToken } from "./authRouter";


export const workspaceRouter = router({

  createWorkspace: protectedProcedure
  .input(z.object({
    workspaceName: z.string(),
    descriptionPurpose: z.string()
  }))
  .mutation(async ({input, ctx}) => {

    const workspace = new WorkspaceModel({
      _id: new mongoose.Types.ObjectId(), 
      workspaceName: input.workspaceName, 
      descriptionPurpose: input.descriptionPurpose, 
      members: [{
          _id: new mongoose.Types.ObjectId(), 
          userId: new mongoose.Types.ObjectId(ctx.userId), 
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

    const userWorkspaces = await WorkspaceModel.find<{_id: mongoose.Types.ObjectId, workspaceName: string, descriptionPurpose: string, tokens: number}>({
        "members.userId": new mongoose.Types.ObjectId(ctx.userId)
    },
    {
        _id: 1, "workspaceName": 1, "descriptionPurpose": 1, "tokens": 1
    })

    return userWorkspaces
  }),

  //checks if the workspace with the giver id exists
  doesWorkspaceExist: protectedProcedure
  .mutation(async ({ctx}) => {
    const workspace = await WorkspaceModel.findOne(
    {
        _id: new mongoose.Types.ObjectId(ctx.workspaceId),
        "members.userId":  new mongoose.Types.ObjectId(ctx.userId)
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
  }),

  //gets data associated with a member of a workspace, like role, last used fuel price etc
  getMemberData: protectedProcedure
  .query(async ({ctx}) => {

    const members = await WorkspaceModel.aggregate<{memberId: string, memberRole: string, lastUsedVehicleId: string, lastUsedFuelPrice: number}>([
      {
          '$match': {'_id': new mongoose.Types.ObjectId(ctx.workspaceId), 'members.userId': new mongoose.Types.ObjectId(ctx.userId)}
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

  setActiveWorkspace: protectedProcedure
  .input(z.object({
    workspaceId: z.string()
  }))
  .mutation(async ({input, ctx}) => {

    //see if user is a member of the workspace they want to open
    const workspace = await WorkspaceModel.findOne<{_id: mongoose.Types.ObjectId}>(
      {_id: new mongoose.Types.ObjectId(input.workspaceId), "members.userId": new mongoose.Types.ObjectId(ctx.userId)},
      {_id: 1}
    )

    if(workspace)
    {
      await UserModel.updateOne(
        {_id: new mongoose.Types.ObjectId(ctx.userId)},
        {$set: {lastUsedWorkspaceId: input.workspaceId}}
      )
      return createAndSignAccessToken(workspace._id.toString(), ctx.userId)
    }
    else
    {
      throw new TRPCError({message: "not a member of workspace", code: "UNAUTHORIZED"})
    }




  })
});
