'use client';

import { Buffer } from 'buffer';

import { useState } from 'react';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { toast } from 'sonner';

import { useConnection } from '@/providers/providers';
import { useAnchorWallet } from '@/hooks/use-anchor-wallet';
import { deriveConfigPda } from '@/lib/constants/addresses';
import { IDL } from '@/lib/program/idl-sol-dex';

type LoadingState = 'idle' | 'init' | 'update';

type ConfigAction = 'init' | 'update';

function parseMpcAddress(mpcAddress: string): number[] {
  const mpcBytes = Uint8Array.from(
    Buffer.from(mpcAddress.replace(/^0x/, ''), 'hex'),
  );
  if (mpcBytes.length !== 20) throw new Error('MPC address must be 20 bytes');
  return Array.from(mpcBytes);
}

export default function AdminPage() {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const [mpcAddress, setMpcAddress] = useState('');
  const [loading, setLoading] = useState<LoadingState>('idle');

  const provider = anchorWallet
    ? new AnchorProvider(connection, anchorWallet, {
        commitment: 'confirmed',
        skipPreflight: true,
      })
    : null;

  const program = provider ? new Program(IDL, provider) : null;

  async function executeConfigAction(
    action: ConfigAction,
    buildAccounts: (configPda: PublicKey) => Record<string, PublicKey>,
  ) {
    if (!program || !anchorWallet?.publicKey) {
      toast.error('Connect your wallet');
      return;
    }

    const methodName = action === 'init' ? 'initializeConfig' : 'updateConfig';
    const actionLabel = action === 'init' ? 'Initialized' : 'Updated';
    const errorLabel = action === 'init' ? 'initialize' : 'update';

    try {
      setLoading(action);
      const [configPda] = deriveConfigPda();
      const mpcBytes = parseMpcAddress(mpcAddress);

      const method = program.methods[methodName];
      if (!method) throw new Error(`${methodName} method not found`);

      const sig = await method(mpcBytes)
        .accountsStrict(buildAccounts(configPda) as never)
        .rpc();

      toast.success(`${actionLabel} config: ${sig}`);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : `Failed to ${errorLabel}`;
      toast.error(message);
    } finally {
      setLoading('idle');
    }
  }

  function onInitialize() {
    return executeConfigAction('init', configPda => ({
      payer: anchorWallet!.publicKey,
      config: configPda,
      systemProgram: SystemProgram.programId,
    }));
  }

  function onUpdate() {
    return executeConfigAction('update', configPda => ({
      config: configPda,
    }));
  }

  return (
    <div className='mx-auto max-w-xl space-y-6 p-4'>
      <h1 className='text-xl font-semibold'>Admin Config</h1>

      <div className='space-y-2'>
        <label className='block text-sm'>MPC Root Signer (0x…20 bytes)</label>
        <input
          className='h-11 w-full rounded border px-3 py-2'
          placeholder='0x...'
          value={mpcAddress}
          onChange={e => setMpcAddress(e.target.value)}
        />
      </div>

      <div className='flex gap-2'>
        <button
          disabled={loading !== 'idle'}
          onClick={onInitialize}
          className='h-11 rounded border px-4 py-2 disabled:opacity-50'
        >
          Initialize
        </button>
        <button
          disabled={loading !== 'idle'}
          onClick={onUpdate}
          className='h-11 rounded border px-4 py-2 disabled:opacity-50'
        >
          Update
        </button>
      </div>
    </div>
  );
}
