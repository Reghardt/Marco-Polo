import { router } from "../trpc"
import { addressBookRouter } from "./addressBookRouter"
import { authRouter } from "./authRouter"

import { workspaceRouter } from "./workspaceRouter"

export const appRouter = router({
    auth: authRouter,
    workspaces: workspaceRouter,
    addressBook: addressBookRouter
})

export type AppRouter = typeof appRouter