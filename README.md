# full-stack-demo

A demo web app for a **shielded ERC-20 vault**: deposit, withdraw, and swap ERC-20 tokens through
a Midnight contract, with the EVM side executed on Sepolia and signed by an MPC responder. The UI
is chain-agnostic — connect the **Developer (Midnight)** wallet, or a Solana wallet.

It's a Next.js app. The heavy pieces (the MPC responder + its proof server) are already deployed,
and the ZK prover keys are hosted on object storage, so you only need to run the web app locally
plus your own **local Midnight proof server**.

## How it fits together

- **This app (Next.js)** — the UI + a few serverless routes (gas top-up relayer, tx tracking).
- **Local proof server** — you run it; it proves the vault circuits for your session. The circuits
  are large, which is why each user runs their own rather than sharing a hosted one.
- **ZK prover keys** — fetched at runtime from `NEXT_PUBLIC_ZK_CONFIG_ORIGIN` (object storage).
- **MPC responder (fakenet) + its proof server** — deployed; signs the Sepolia txs and posts the
  attestations the app reads back. Configured via `NEXT_PUBLIC_FAKENET_RESPONSES_URL`.
- **Networks** — Midnight **stagenet** and Ethereum **Sepolia** (both public testnets).

## Prerequisites

- Node 20+ and [pnpm](https://pnpm.io)
- Docker (for the local proof server)
- A Sepolia RPC key (free from [Infura](https://infura.io) or [Alchemy](https://alchemy.com))
- A little Sepolia ETH in a relayer wallet (it pays users' gas)

## Setup

```bash
pnpm install
cp .env.example .env.local
# fill in the secrets at the bottom of .env.local (Sepolia RPC key, relayer key, wallet seed)
```

Start your local proof server (leave it running):

```bash
docker run -p 6300:6300 midnightntwrk/proof-server:9.0.0-rc.5_experimental \
  midnight-proof-server -v
```

Run the app:

```bash
pnpm dev
```

Open http://localhost:3000, connect the **Developer (Midnight)** wallet, and deposit / swap.

## Notes

- **Proving is heavy** — the first deposit/swap downloads the prover keys (hundreds of MB) and
  proves locally; give it a minute. Subsequent ops reuse the cached keys.
- **Swap** is exact-output on-chain: you enter what you want to spend, receive at least the quoted
  output, and any unspent input is refunded as change.
- The `.env.local` you create is git-ignored — never commit secrets.
