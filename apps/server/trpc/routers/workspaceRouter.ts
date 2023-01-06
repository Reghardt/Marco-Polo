/* eslint-disable prettier/prettier */
import { z } from "zod";
import mongoose from "mongoose";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";

import WorkspaceModel from "../models/Workspace"
import { getBearer } from "../../utils/bearer";


export const workspaceRouter = router({
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

    
  })
});
