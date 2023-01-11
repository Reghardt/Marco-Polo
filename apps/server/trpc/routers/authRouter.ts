/* eslint-disable prettier/prettier */


import { z } from "zod";
import mongoose from "mongoose";
import UserModel, { IUser } from "../models/User";

import { publicProcedure, router } from "../trpc";
import { decode, JwtPayload, sign } from "jsonwebtoken";

// TODO create better JWT
export function createAndSignAccessToken(workspaceId: string, userId: string)
{
    return sign({workspaceId: workspaceId, userId: userId}, "1223434", {algorithm: 'HS256', expiresIn: '8h'})
}

export const authRouter = router({
  loginMs: publicProcedure
  .input(z.object({
    microsoftIdToken: z.string()
  }))
  .mutation(async ({input}) => {
    console.log("FIRED: loginMs")

    //TODO what happens when decode fails?
    const decodedIdToken = decode(input.microsoftIdToken) as JwtPayload

    let user = await UserModel.findOne<IUser>({provider_id: decodedIdToken.oid, accType: "MS"})
    if(user === null)
    {
      //create new user on db
      user = new UserModel({_id: new mongoose.Types.ObjectId(), accType: "MS", provider_id: decodedIdToken.oid, userName: decodedIdToken.name, email: decodedIdToken.email, password: null, lastUsedWorkspaceId: ''});
    }

    const accessToken = createAndSignAccessToken(user.lastUsedWorkspaceId, user._id.toString());
    console.log(accessToken)
    return {accessToken: accessToken};
  })
});
