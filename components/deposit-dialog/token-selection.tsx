'use client';

import { useState } from 'react';
import { useWallet } from '@solana/connector/react';

import type {
  NetworkData,
  TokenConfig,
} from '@/lib/constants/token-metadata';
import { NETWORKS_WITH_TOKENS } from '@/lib/constants/token-metadata';
import { useMidnightWallet } from '@/providers/midnight-context';

import { NetworkAccordionItem } from './network-accordion-item';

interface TokenSelectionProps {
  onTokenSelect: (token: TokenConfig, network: NetworkData) => void;
}

export function TokenSelection({ onTokenSelect }: TokenSelectionProps) {
  const [expandedNetworkId, setExpandedNetworkId] = useState<string | null>(
    null,
  );
  const { isConnected, account } = useWallet();
  const midnight = useMidnightWallet();

  // Show only networks the connected wallet can use; Ethereum is common to both.
  const solanaConnected = isConnected && !!account;
  const networks = NETWORKS_WITH_TOKENS.filter(n => {
    if (n.chain === 'midnight') return midnight.connected;
    if (n.chain === 'solana') return solanaConnected;
    return solanaConnected || midnight.connected; // ethereum
  });

  const handleNetworkClick = (networkId: string) => {
    setExpandedNetworkId(expandedNetworkId === networkId ? null : networkId);
  };

  const handleTokenSelect = (token: TokenConfig, network: NetworkData) => {
    onTokenSelect(token, network);
    setExpandedNetworkId(null); // Collapse after selection
  };

  return (
    <div className='space-y-3'>
      <p className='text-wf-base-700 text-sm font-medium tracking-wider uppercase'>
        Select Network
      </p>

      {/* Network Accordion List */}
      <div className='max-h-96 space-y-3 overflow-y-auto'>
        {networks.map(network => {
          const networkId = network.chain;
          const isExpanded = expandedNetworkId === networkId;

          return (
            <NetworkAccordionItem
              key={networkId}
              network={network}
              isExpanded={isExpanded}
              onNetworkClick={() => handleNetworkClick(networkId)}
              onTokenSelect={handleTokenSelect}
            />
          );
        })}
      </div>
    </div>
  );
}
