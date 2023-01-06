/* eslint-disable prettier/prettier */


import { z } from "zod";
import * as jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import UserModel, { IUser } from "../models/User";

import { publicProcedure, router } from "../trpc";

  // TODO create better JWT
  function createAndSignUserToken(userId: string)
  {
      return jwt.sign({user: userId}, "1223434", {expiresIn: '8h'})
  }

export const authRouter = router({
  loginMs: publicProcedure
  .input(z.object({
    idToken: z.string()
  }))
  .mutation(async ({input}) => {

    //TODO what happens whrn decode fails?
    const decodedIdToken = jwt.decode(input.idToken) as jwt.JwtPayload

    let user = await UserModel.findOne<IUser>({provider_id: decodedIdToken.oid, accType: "MS"})
    if(user === null)
    {
        user = new UserModel({_id: new mongoose.Types.ObjectId(), accType: "MS", provider_id: decodedIdToken.oid, userName: decodedIdToken.name, email: decodedIdToken.email, password: null, lastUsedWorkspaceId: ''});
    }

    const accessToken = createAndSignUserToken(user._id.toString());
    return {accessToken: accessToken, lastUsedWorkspaceId: user.lastUsedWorkspaceId as string};
  })
});
