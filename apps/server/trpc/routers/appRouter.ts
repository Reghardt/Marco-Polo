import { router } from "../trpc"
import { addressBookRouter } from "./addressBookRouter"
import { authRouter } from "./authRouter"
import { vehicleRouter } from "./vehicleRouter"

import { workspaceRouter } from "./workspaceRouter"

export const appRouter = router({
    auth: authRouter,
    workspaces: workspaceRouter,
    addressBook: addressBookRouter,
    vehicle: vehicleRouter
})

export type AppRouter = typeof appRouter