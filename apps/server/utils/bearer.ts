/* eslint-disable prettier/prettier */
import { TRPCError } from "@trpc/server"
import type { JwtPayload} from "jsonwebtoken";
import { verify } from "jsonwebtoken"


export async function getBearer(req: any)
{
    const authHeader = req.headers['authorization']
    if(authHeader && authHeader.length > 0)
    {
        const preamble = authHeader.substr(0, 7)
        const token = authHeader.substr(7)
        if(preamble === "Bearer ")
        {        
            return new Promise<JwtPayload>((accept) => {
                verify(token, "1223434", (error: any, user: any) => {
                    if(error) //if there is some error, like token expired return error
                    {
                        console.log("res is", error.inner)
                        console.log("res is", error.message)
                        console.log("res is", error.name)
                        throw new TRPCError({message: `${error.name}, ${error.message}`,code: "UNAUTHORIZED"})
                    }
                    else
                    {
                        accept(user as JwtPayload)
                    }
                })
            })    
        }
        else
        {
            throw new TRPCError({message:"Unauthorized - Bearer not well formed",code: "UNAUTHORIZED"});
        }
    }
    else
    {
        throw new TRPCError({message: "Unauthorized - No token", code: "UNAUTHORIZED"});
    }
    
}