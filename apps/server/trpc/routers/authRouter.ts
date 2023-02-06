/* eslint-disable prettier/prettier */


import { z } from "zod";
import mongoose from "mongoose";


import { publicProcedure, router } from "../trpc";
import { decode, JwtPayload, sign } from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import UserModel from "../models/User.model";

// TODO create better JWT
export function createAndSignAccessToken(workspaceId: string, userId: string)
{
    return sign({workspaceId: workspaceId, userId: userId}, "1223434", {algorithm: 'HS256', expiresIn: '8h'})
}

function randomIntFromInterval(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
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

    let user = await UserModel.findOne({provider_id: decodedIdToken.oid, accType: "MS"})
    if(user === null)
    {
      //create new user on db
      
      for(let i = 0; i < 10; i++)
      {
        const userNameWithTag = (decodedIdToken.name as string).replace(/\s/g,'') + "#" + randomIntFromInterval(1000, 9999);
        const existingUserWithNameAndTag = await UserModel.findOne({userName: userNameWithTag})
        if(existingUserWithNameAndTag === null) //username with that tag does not exist, go ahead and create a user
        {
          user = new UserModel(
            {
              _id: new mongoose.Types.ObjectId(), 
              accType: "MS", 
              provider_id: decodedIdToken.oid, 
              userName: decodedIdToken.name, 
              userNameWithTag: userNameWithTag,
              email: decodedIdToken.email, 
              password: null, 
              lastUsedWorkspaceId: ''
            });
          await user.save()
          break
        }
      }

      if(user === null)
      {
        throw new TRPCError({message: "A username could not be generated, please try again", code: "CONFLICT"})
      }
    }
    else
    {
      //check if the user has updated their MS email, if so, update it in 
      if(user.email !== decodedIdToken.email)
      {
        user.email === decodedIdToken.email
        user.save()
      }
    }

    const accessToken = createAndSignAccessToken(user.lastUsedWorkspaceId, user._id.toString());
    console.log(accessToken)
    return {accessToken: accessToken};
  })
});
