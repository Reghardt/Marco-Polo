import { publicProcedure, router } from "../trpc";


export const testRouter = router({
    testProc: publicProcedure
    .mutation(() => {
        console.log("received")
        return "hello from test"
    })
})