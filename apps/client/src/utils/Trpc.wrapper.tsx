import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpc } from "./trpc";
import superjson from "superjson";
import { useAuthStore } from "../Zustand/authStore";

type TTrpcWrapper = {
    children? : React.ReactNode
}

const TrpcWrapper: React.FC<TTrpcWrapper> = ({children}) => {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
      trpc.createClient({
        transformer: superjson,
        links: [
          httpBatchLink({
            url: '/trpc',
            // optional
            headers() {
              return {
                authorization: `Bearer ${useAuthStore.getState().values.token}`,
              };
            },
          }),
        ],
      }),
    );
    
    return(
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    )
}

export default TrpcWrapper