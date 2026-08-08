import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';

import { getEthSepoliaRpcUrl } from '@/lib/rpc';

export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(getEthSepoliaRpcUrl()),
  },
});
