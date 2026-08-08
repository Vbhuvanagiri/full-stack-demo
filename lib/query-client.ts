import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('wallet')) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export const queryKeys = {
  solana: {
    all: ['solana'] as const,
    depositAddress: (publicKey: string) =>
      [...queryKeys.solana.all, 'depositAddress', publicKey] as const,
    userBalances: (publicKey: string) =>
      [...queryKeys.solana.all, 'userBalances', publicKey] as const,
    txList: (publicKey: string) =>
      [...queryKeys.solana.all, 'txList', publicKey] as const,
  },
} as const;

export function invalidateBalanceQueries(
  queryClient: QueryClient,
  account: string,
) {
  queryClient.invalidateQueries({
    queryKey: queryKeys.solana.userBalances(account),
  });
}
