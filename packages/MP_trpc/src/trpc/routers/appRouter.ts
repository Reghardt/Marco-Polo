import { router } from "../trpc"
import { addressBookRouter } from "./addressBookRouter"
import { authRouter } from "./authRouter"
import { driverRouter } from "./driverRouter"
import { helloRouter } from "./MPT/helloRouter"
import { vehicleRouter } from "./vehicleRouter"
import { workspaceRouter } from "./workspaceRouter"

export const appRouter = router({
    auth: authRouter,
    workspaces: workspaceRouter,
    addressBook: addressBookRouter,
    vehicle: vehicleRouter,
    driver: driverRouter,
    hello: helloRouter

})

export type AppRouter = typeof appRouter