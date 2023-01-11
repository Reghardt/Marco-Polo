/* eslint-disable prettier/prettier */
import { TRPCError } from "@trpc/server"
import type { JwtPayload} from "jsonwebtoken";
import { verify } from "jsonwebtoken"
import z from "zod"

const tokenSchema = z.object({
    workspaceId: z.string(),
    userId: z.string()
})

export async function getBearer(req: any)
{
    const authHeader = req.headers['authorization']
    if(authHeader && authHeader.length > 0)
    {
        const preamble = authHeader.substr(0, 7)
        const tokenString = authHeader.substr(7)
        if(preamble === "Bearer ") //bearer distinguishes the type of Authorization being used
        {        
            return new Promise<z.infer<typeof tokenSchema>>((accept) => {
                verify(tokenString, "1223434", {algorithms: ['HS256']}, (err, decoded) => {
                    if(err)
                    {
                        throw new TRPCError({message: `${err.name}, ${err.message}`, code: "UNAUTHORIZED"})
                    }
                    else //if no error, continue
                    {
                        if(decoded === undefined)
                        {
                            throw new TRPCError({message: "token undefined", code: "UNAUTHORIZED"})
                        }
                        else if(typeof decoded === "string" ) //expects to be decoded to JwtPayload, not string
                        {
                            throw new TRPCError({message: "token decoded to a string", code: "UNAUTHORIZED"})
                        }
                        else
                        {
                            const parseResult = tokenSchema.safeParse({ //check if type safe
                                workspaceId: decoded.workspaceId,
                                userId: decoded.userId
                            })
                            if(parseResult.success)
                            {
                                accept(parseResult.data) //accept if type safe
                            }
                            else
                            {
                                throw new TRPCError({message: parseResult.error.message, code: "UNAUTHORIZED"}) //throw error if not
                            }
                        }
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