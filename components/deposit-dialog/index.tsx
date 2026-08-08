'use client';

import { useState } from 'react';
import { useWallet } from '@solana/connector/react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CryptoIcon } from '@/components/balance-display/crypto-icon';
import { LoadingState } from '@/components/states/LoadingState';
import {
  TokenConfig,
  NetworkData,
  fetchErc20Decimals,
} from '@/lib/constants/token-metadata';
import { useDepositAddress, useHasActiveTransaction } from '@/hooks';
import { useDepositEvmMutation } from '@/hooks/use-deposit-evm-mutation';
import { useMidnightWallet } from '@/providers/midnight-context';
import { useMidnightProgress } from '@/hooks/use-midnight-progress';

import { TokenSelection } from './token-selection';
import { DepositAddress } from './deposit-address';

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepositDialog({ open, onOpenChange }: DepositDialogProps) {
  const { account, isConnected } = useWallet();
  const [selectedToken, setSelectedToken] = useState<TokenConfig | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkData | null>(
    null,
  );

  const { data: depositAddress, isLoading: isGeneratingAddress } =
    useDepositAddress();
  const depositEvmMutation = useDepositEvmMutation();
  const solDepositAddress = account ?? '';
  const hasActiveTransaction = useHasActiveTransaction();
  const midnight = useMidnightWallet();
  const progress = useMidnightProgress();

  // Midnight wallet connected -> Ethereum deposits fund the vault (even if Solana is
  // also connected; the Solana-bridge path must not capture them).
  const isVaultEvmDeposit =
    midnight.connected && selectedNetwork?.chain === 'ethereum';

  // Derive step from state instead of syncing with useEffect
  const getStep = () => {
    if (!selectedToken || !selectedNetwork) {
      return 'select-token';
    }

    // Solana: skip generating step, address is always available
    if (selectedNetwork.chain === 'solana' && isConnected && account) {
      return 'show-address';
    }

    // Midnight + vault-over-Ethereum: address comes from the wallet, no relayer step.
    if (selectedNetwork.chain === 'midnight') {
      return 'show-address';
    }
    if (isVaultEvmDeposit) {
      return 'show-address';
    }

    // EVM: show generating while loading, then show address
    if (!depositAddress || isGeneratingAddress) {
      return 'generating-address';
    }

    return 'show-address';
  };

  const step = getStep();

  const handleTokenSelect = (token: TokenConfig, network: NetworkData) => {
    setSelectedToken(token);
    setSelectedNetwork(network);
  };

  const [isNotifying, setIsNotifying] = useState(false);

  const handleNotifyRelayer = async () => {
    if (!selectedToken || !selectedNetwork) return;
    if (isNotifying) return;

    // Midnight: the dialog shows the user's own shielded receive address — just close.
    if (selectedNetwork.chain === 'midnight') {
      handleClose();
      return;
    }

    // Vault funding over Ethereum: deposit the ERC-20 sitting at the deposit address.
    if (isVaultEvmDeposit) {
      const erc20 = selectedToken.erc20Address;
      const units =
        midnight.balances?.perToken[erc20.toLowerCase()]?.depositUnits ?? 0n;
      if (units === 0n) {
        toast.error(`No ${selectedToken.symbol} at the deposit address`, {
          description: `Send Sepolia ${selectedToken.symbol} to the address above first.`,
        });
        return;
      }
      // Fire-and-close: progress + result surface via MidnightProgressToaster.
      midnight.deposit(erc20, units).catch(() => {
        /* surfaced by MidnightProgressToaster via flow.fail */
      });
      handleClose();
      return;
    }

    if (!isConnected || !account) return;
    if (hasActiveTransaction) {
      toast.error('Transaction in progress', {
        description: 'Please wait for the current transaction to complete',
      });
      return;
    }

    setIsNotifying(true);

    // For Solana assets, no relayer notification is needed; user deposits directly to own wallet
    if (selectedNetwork.chain === 'solana') {
      handleClose();
      return;
    }

    try {
      // Fetch decimals from chain
      const decimals = await fetchErc20Decimals(selectedToken.erc20Address);

      await depositEvmMutation.mutateAsync({
        erc20Address: selectedToken.erc20Address,
        amount: '',
        decimals,
        tokenSymbol: selectedToken.symbol,
      });
      handleClose();
    } catch (err) {
      setIsNotifying(false);
      toast.error('Failed to notify relayer', {
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };

  const handleClose = () => {
    setSelectedToken(null);
    setSelectedNetwork(null);
    setIsNotifying(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='gradient-popover max-h-[90vh] max-w-md overflow-y-auto rounded-sm p-5 shadow-[0px_4px_9.3px_0px_rgba(41,86,70,0.35)] sm:p-10'>
        {step === 'select-token' && (
          <div className='space-y-5'>
            <DialogHeader className='space-y-0 p-0'>
              <DialogTitle className='text-dark-neutral-400 text-xl font-semibold'>
                Select an asset
              </DialogTitle>
            </DialogHeader>
            <TokenSelection onTokenSelect={handleTokenSelect} />
          </div>
        )}

        {step === 'generating-address' && selectedToken && selectedNetwork && (
          <div className='space-y-6 text-center'>
            <div className='flex flex-col items-center gap-4'>
              <CryptoIcon
                chain={selectedNetwork.chain}
                token={selectedToken.symbol}
                className='size-12'
              />
              <div>
                <h3 className='text-tundora-300 mb-1 text-lg font-semibold'>
                  Generating Deposit Address
                </h3>
                <p className='text-tundora-50 text-sm font-medium'>
                  {selectedToken.symbol} on {selectedNetwork.chainName}
                </p>
              </div>
            </div>

            <div className='flex justify-center'>
              <div className='flex gap-1'>
                <div className='bg-dark-neutral-300 h-2 w-2 animate-bounce rounded-full'></div>
                <div
                  className='bg-dark-neutral-300 h-2 w-2 animate-bounce rounded-full'
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className='bg-dark-neutral-300 h-2 w-2 animate-bounce rounded-full'
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>

            <p className='text-dark-neutral-400 text-sm font-medium'>
              Please wait while we generate your unique deposit address...
            </p>
          </div>
        )}

        {step === 'show-address' &&
          selectedToken &&
          selectedNetwork && (
            <div className='space-y-5'>
              <DialogHeader className='space-y-0 p-0'>
                <DialogTitle className='text-dark-neutral-400 text-xl font-semibold'>
                  Deposit Address
                </DialogTitle>
              </DialogHeader>
              {isVaultEvmDeposit && progress.active ? (
                <LoadingState message={progress.message} />
              ) : (
                <DepositAddress
                  token={selectedToken}
                  network={selectedNetwork}
                  depositAddress={
                    selectedNetwork.chain === 'solana'
                      ? solDepositAddress
                      : selectedNetwork.chain === 'midnight'
                        ? midnight.shieldedAddress
                        : isVaultEvmDeposit
                          ? midnight.depositAddress
                          : depositAddress || ''
                  }
                  isSubmitting={isNotifying}
                  onContinue={handleNotifyRelayer}
                />
              )}
            </div>
          )}
      </DialogContent>
    </Dialog>
  );
}
