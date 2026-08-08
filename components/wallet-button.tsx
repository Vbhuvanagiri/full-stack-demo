'use client';

import { useState } from 'react';
import {
  useWallet,
  useDisconnectWallet,
  WalletListElement,
} from '@solana/connector/react';
import { toast } from 'sonner';
import { Wallet, LogOut } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { formatAddress } from '@/lib/address-utils';
import { useMidnightWallet } from '@/providers/midnight-context';

export function WalletButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const { account, isConnected, isConnecting } = useWallet();
  const { disconnect, isDisconnecting } = useDisconnectWallet();
  const midnight = useMidnightWallet();

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch {
      toast.error('Failed to disconnect wallet');
    }
  };

  // The Developer wallet is always available, so the selector always opens.
  const openModal = () => setModalOpen(true);

  const connectMidnight = () => {
    midnight.connect().catch((e: unknown) => {
      toast.error(
        e instanceof Error ? e.message : 'Failed to start developer wallet',
      );
    });
    setModalOpen(false);
  };

  if (isConnecting || midnight.connecting) {
    return (
      <Button disabled>
        <Wallet className='mr-2 h-4 w-4' />
        {midnight.connecting && midnight.syncStatus
          ? `Connecting… ${midnight.syncStatus}`
          : 'Connecting...'}
      </Button>
    );
  }

  const solanaConnected = isConnected && !!account;
  if (solanaConnected || midnight.connected) {
    const label = solanaConnected
      ? formatAddress(account!, 4, 4)
      : `Dev · ${formatAddress(midnight.shieldedAddress, 4, 4)}`;
    const onDisconnect = solanaConnected
      ? handleDisconnect
      : () => midnight.disconnect();
    return (
      <div className='flex items-center gap-2'>
        <Button variant='outline' className='gap-2 font-medium'>
          <Wallet className='h-4 w-4' />
          {label}
        </Button>
        <Button
          variant='outline'
          onClick={onDisconnect}
          disabled={isDisconnecting}
          className='border-red-200 bg-red-50 font-medium text-red-600'
          title='Disconnect wallet'
        >
          <LogOut className='h-4 w-4' />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button onClick={openModal} className='font-medium'>
        <Wallet className='mr-2 h-4 w-4' />
        Connect Wallet
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect a Wallet</DialogTitle>
            <DialogDescription>
              Select a wallet to connect to this app.
            </DialogDescription>
          </DialogHeader>

          <WalletListElement
            installedOnly
            onConnect={() => setModalOpen(false)}
            render={({ installedWallets, connectById, connecting }) => (
              <ul className='flex flex-col gap-1.5'>
                <li key='dev-seed-wallet'>
                  <button
                    type='button'
                    onClick={connectMidnight}
                    disabled={midnight.connecting}
                    className='flex w-full cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-left transition-all duration-150 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    <div className='flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white'>
                      D
                    </div>
                    <span className='flex flex-col'>
                      <span className='text-sm font-medium text-gray-900'>
                        Developer wallet (Midnight)
                      </span>
                      <span className='text-xs text-gray-500'>
                        In-app seed wallet · ledger-9 · Sepolia
                      </span>
                    </span>
                  </button>
                </li>
                {installedWallets.map(wallet => (
                  <li key={wallet.connectorId}>
                    <button
                      type='button'
                      onClick={() => {
                        connectById(wallet.connectorId).catch(() => {
                          toast.error('Failed to connect wallet');
                        });
                      }}
                      disabled={connecting}
                      className='flex w-full cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-left transition-all duration-150 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      <div className='flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md'>
                        {wallet.icon ? (
                          <Image
                            src={wallet.icon}
                            alt={wallet.name}
                            width={36}
                            height={36}
                            className='h-full w-full object-contain'
                            unoptimized
                          />
                        ) : (
                          <Wallet className='h-5 w-5 text-gray-400' />
                        )}
                      </div>
                      <span className='text-sm font-medium text-gray-900'>
                        {wallet.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
