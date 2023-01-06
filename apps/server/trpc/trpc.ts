import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./createContext";
import superjson from "superjson"

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({shape}){
        return shape
    }
});

const isAuthed = t.middleware(({ ctx, next }) => {
    //TODO chek if token is valid
    if (!ctx.req.headers.authorization) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: ctx
    });
  });

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);

