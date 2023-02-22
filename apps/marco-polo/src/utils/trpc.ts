import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from 'mp_trpc';

export const trpc = createTRPCReact<AppRouter>();