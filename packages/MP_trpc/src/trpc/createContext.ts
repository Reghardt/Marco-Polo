import { inferAsyncReturnType } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'

export const createContext = async ({req, res} : trpcExpress.CreateExpressContextOptions) => {
    return {
        req, res
    }
}

export type Context = inferAsyncReturnType<typeof createContext>