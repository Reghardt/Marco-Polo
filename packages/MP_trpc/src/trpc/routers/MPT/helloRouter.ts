import { z } from "zod";
import { publicProcedure, router } from "../../trpc";

export const helloRouter = router({
    sayHello: publicProcedure
    .input(z.object({
        hello: z.string()
    }))
    .query(({input}) => {
        return input.hello + " from server"
    })
})

