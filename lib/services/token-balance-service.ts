import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';

import type { TokenBalance } from '@/lib/types/token.types';
import {
  getErc20Token,
  ERC20_TOKENS,
  SOLANA_TOKENS,
  fetchErc20Decimals,
} from '@/lib/constants/token-metadata';
import type { DexContract } from '@/lib/contracts/dex-contract';
import { getAlchemyProvider } from '@/lib/rpc';
import { isRateLimitError } from '@/lib/utils/rate-limit';

/**
 * TokenBalanceService handles all token balance operations including
 * fetching and processing ERC20 token balances.
 */
export class TokenBalanceService {
  private alchemy = getAlchemyProvider();

  constructor(private dexContract: DexContract) {}

  /**
   * Batch fetch ERC20 balances for multiple tokens
   */
  async batchFetchErc20Balances(
    address: string,
    tokenAddresses: string[],
  ): Promise<Array<{ address: string; balance: bigint; decimals: number }>> {
    try {
      // Use Alchemy's getTokenBalances for efficient batch fetching
      const balances = await this.alchemy.core.getTokenBalances(
        address,
        tokenAddresses,
      );

      if (!balances) {
        return this.fallbackBatchFetch(address, tokenAddresses);
      }

      const results: Array<{
        address: string;
        balance: bigint;
        decimals: number;
      }> = [];

      for (const tokenBalance of balances.tokenBalances) {
        const balance = BigInt(tokenBalance.tokenBalance || '0');

        const decimals = await fetchErc20Decimals(tokenBalance.contractAddress);
        results.push({
          address: tokenBalance.contractAddress,
          balance,
          decimals,
        });
      }

      return results;
    } catch (error) {
      if (isRateLimitError(error)) {
        console.warn(
          '[TokenBalanceService] Alchemy rate limited during batch balance fetch, returning empty',
        );
        return [];
      }
      console.error('Error batch fetching token balances:', error);
      // Fallback to individual calls
      return this.fallbackBatchFetch(address, tokenAddresses);
    }
  }

  /**
   * Fallback method for individual balance fetching when batch fails
   */
  private async fallbackBatchFetch(
    address: string,
    tokenAddresses: string[],
  ): Promise<Array<{ address: string; balance: bigint; decimals: number }>> {
    const balancePromises = tokenAddresses.map(async tokenAddress => {
      try {
        const tokenBalances = await this.alchemy.core.getTokenBalances(
          address,
          [tokenAddress],
        );
        const balance = tokenBalances?.tokenBalances?.[0]?.tokenBalance || '0';
        const balanceBigInt = BigInt(balance || '0');

        const decimals = await fetchErc20Decimals(tokenAddress);
        return { address: tokenAddress, balance: balanceBigInt, decimals };
      } catch (error) {
        if (isRateLimitError(error)) {
          console.warn(
            `[TokenBalanceService] Alchemy rate limited fetching balance for ${tokenAddress}, skipping`,
          );
          return null;
        }
        console.error(`Error fetching balance for ${tokenAddress}:`, error);
        throw error;
      }
    });

    const results = await Promise.all(balancePromises);
    return results.filter(
      (result): result is { address: string; balance: bigint; decimals: number } =>
        result !== null,
    );
  }

  /**
   * Fetch unclaimed balances from derived Ethereum address
   */
  async fetchUnclaimedBalances(
    derivedAddress: string,
  ): Promise<TokenBalance[]> {
    try {
      const tokenAddresses = ERC20_TOKENS.map(token => token.erc20Address);

      // Use batch fetching to reduce RPC calls
      const batchResults = await this.batchFetchErc20Balances(
        derivedAddress,
        tokenAddresses,
      );

      const results: TokenBalance[] = [];

      for (const result of batchResults) {
        if (result.balance > BigInt(0)) {
          const tokenMetadata = getErc20Token(result.address);
          results.push({
            erc20Address: result.address,
            amount: result.balance.toString(),
            symbol: tokenMetadata?.symbol ?? 'Unknown',
            name: tokenMetadata?.name ?? 'Unknown Token',
            decimals: result.decimals,
            chain: 'ethereum',
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error fetching unclaimed balances:', error);
      return [];
    }
  }

  /**
   * OPTIMIZED: Fetch user balances from Solana contract using efficient RPC calls
   */
  async fetchUserBalances(publicKey: PublicKey): Promise<TokenBalance[]> {
    try {
      const tokenAddresses = ERC20_TOKENS.map(token => token.erc20Address);

      // Fetch ERC20 balances from the bridge contract
      const balancesPromises = tokenAddresses.map(async erc20Address => {
        const balance = await this.dexContract.fetchUserBalance(
          publicKey,
          erc20Address,
        );
        if (balance !== '0') {
          const tokenMetadata = getErc20Token(erc20Address);
          const decimals = await fetchErc20Decimals(erc20Address);
          return {
            erc20Address,
            amount: balance,
            decimals,
            symbol: tokenMetadata?.symbol ?? 'Unknown',
            name: tokenMetadata?.name ?? 'Unknown Token',
            chain: 'ethereum',
          };
        }
        return null;
      });

      const erc20Results = (await Promise.all(balancesPromises)).filter(
        (result): result is TokenBalance => result !== null,
      );

      // Fetch SPL balances using parsed account info to get decimals from chain
      const splResults: TokenBalance[] = [];
      const solanaTokens = SOLANA_TOKENS;
      if (solanaTokens.length > 0) {
        try {
          // Fetch each token balance with parsed data (includes decimals)
          const balancePromises = solanaTokens.map(async token => {
            try {
              const mintPubkey = new PublicKey(token.erc20Address);
              const ata = getAssociatedTokenAddressSync(
                mintPubkey,
                publicKey,
                true,
              );

              // Get parsed account info to get decimals from chain
              const result = await this.dexContract.getConnection().getParsedAccountInfo(ata);
              const accountInfo = result.value;

              if (
                accountInfo &&
                'parsed' in accountInfo.data &&
                accountInfo.data.parsed?.info?.tokenAmount
              ) {
                const tokenAmount = accountInfo.data.parsed.info.tokenAmount;
                return {
                  erc20Address: token.erc20Address,
                  amount: tokenAmount.amount ?? '0',
                  decimals: tokenAmount.decimals,
                  symbol: token.symbol,
                  name: token.name,
                  chain: 'solana' as const,
                };
              }

              // Account doesn't exist or no balance
              return null;
            } catch (e) {
              if (isRateLimitError(e)) {
                console.warn(
                  `[TokenBalanceService] Rate limited fetching balance for ${token.symbol}, skipping`,
                );
                return null;
              }
              console.warn(`Failed to fetch balance for ${token.symbol}:`, e);
              return null;
            }
          });

          const results = await Promise.all(balancePromises);
          for (const result of results) {
            if (result) {
              splResults.push(result);
            }
          }
        } catch (error) {
          console.error('Error fetching SPL balances:', error);
        }
      }

      return [...erc20Results, ...splResults];
    } catch (error) {
      console.error('Failed to fetch user balances:', error);
      throw new Error(
        `Failed to fetch user balances: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

}
