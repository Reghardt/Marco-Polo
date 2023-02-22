import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./createContext";
import superjson from "superjson"
import { getBearer } from "../utils/bearer";

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({shape}){
        return shape
    }
});

const isAuthed = t.middleware(async ({ ctx, next }) => {
    //TODO check if token is valid
    if (!ctx.req.headers.authorization) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const bearerRes = await getBearer(ctx.req)

    return next({
      ctx: {
        workspaceId: bearerRes.workspaceId,
        userId: bearerRes.userId
      }
    });
  });

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);

