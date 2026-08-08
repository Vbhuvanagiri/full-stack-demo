'use client';

import { useState } from 'react';

import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatUnits } from 'viem';

import { cn } from '@/lib/utils';
import { formatTokenBalanceSync } from '@/lib/utils/balance-formatter';
import { DepositDialog } from '@/components/deposit-dialog';
import { WithdrawDialog, WithdrawToken } from '@/components/withdraw-dialog';
import { useTokenPrices } from '@/hooks/use-token-prices';
import type { TokenWithBalance } from '@/lib/types/token.types';

import { BalanceBox } from './balance-box';
import { CryptoIcon } from './crypto-icon';

interface BalanceDisplayProps {
  tokens: TokenWithBalance[];
  className?: string;
}

export function BalanceDisplay({
  tokens,
  className = '',
}: BalanceDisplayProps) {
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [selectedTokenForWithdraw, setSelectedTokenForWithdraw] =
    useState<WithdrawToken | null>(null);

  // Get unique token symbols for price fetching
  const tokenSymbols = [...new Set(tokens.map(token => token.symbol))];
  const { data: tokenPrices } = useTokenPrices(tokenSymbols);

  // Convert tokens to withdraw format (use exact balance to avoid rounding up)
  const chainName = (chain: TokenWithBalance['chain']) =>
    chain === 'ethereum'
      ? 'Ethereum Sepolia'
      : chain === 'midnight'
        ? 'Midnight'
        : 'Solana Devnet';

  const withdrawTokens: WithdrawToken[] = tokens.map(token => ({
    symbol: token.symbol,
    name: token.name,
    chain: token.chain,
    chainName: chainName(token.chain),
    address: token.erc20Address,
    balance: formatUnits(token.balance, token.decimals),
    decimals: token.decimals,
  }));

  return (
    <div className='flex w-full max-w-full flex-col gap-5'>
      <div className='border-dark-neutral-300 flex w-full items-center justify-between border-t py-5'>
        <h2 className='text-dark-neutral-200 self-start font-semibold uppercase'>
          Balances
        </h2>
        <Button
          onClick={() => setIsDepositDialogOpen(true)}
          variant='outline'
          size='lg'
          className='gap-1.5 font-semibold'
        >
          <Download className='h-4 w-4' />
          Deposit
        </Button>
      </div>
      <div
        className={cn(
          'grid w-full max-w-full gap-4 sm:gap-6 md:grid-cols-2 md:gap-8 lg:gap-10',
          className,
        )}
      >
        {tokens.map((tokenData, index) => {
          // Format balance amount with smart precision
          const displayAmount = formatTokenBalanceSync(
            tokenData.balance,
            tokenData.decimals,
            tokenData.symbol,
            { precision: 3 },
          );

          // Calculate USD value using unified formatter
          const tokenPrice = tokenPrices?.[tokenData.symbol.toUpperCase()];
          const formattedUsdValue = tokenPrice
            ? formatTokenBalanceSync(
                tokenData.balance,
                tokenData.decimals,
                tokenData.symbol,
                { showUsd: true, usdPrice: tokenPrice.usd },
              )
            : '$0.00';

          // Find corresponding withdraw token
          const withdrawToken = withdrawTokens.find(
            wt =>
              wt.symbol === tokenData.symbol && wt.chain === tokenData.chain,
          );

          const handleSendClick = () => {
            if (withdrawToken) {
              setSelectedTokenForWithdraw(withdrawToken);
              setIsWithdrawDialogOpen(true);
            }
          };

          return (
            <BalanceBox
              key={`${tokenData.chain}-${tokenData.symbol}-${index}`}
              amount={displayAmount}
              usdValue={formattedUsdValue}
              tokenSymbol={tokenData.symbol}
              icon={
                <CryptoIcon chain={tokenData.chain} token={tokenData.symbol} />
              }
              onSendClick={handleSendClick}
              onSwapClick={() => {
                // TODO: Implement swap functionality
              }}
            />
          );
        })}
      </div>

      <DepositDialog
        open={isDepositDialogOpen}
        onOpenChange={setIsDepositDialogOpen}
      />

      <WithdrawDialog
        open={isWithdrawDialogOpen}
        onOpenChange={open => {
          setIsWithdrawDialogOpen(open);
          if (!open) {
            setSelectedTokenForWithdraw(null);
          }
        }}
        availableTokens={withdrawTokens}
        preSelectedToken={selectedTokenForWithdraw}
      />
    </div>
  );
}
