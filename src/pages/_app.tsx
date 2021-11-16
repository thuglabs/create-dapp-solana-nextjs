import React, { useMemo } from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import {
  ConnectionProvider,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import "../styles/App.css";
import { JupiterProvider } from "@jup-ag/react-hook";

const SOLANA_NETWORK = WalletAdapterNetwork.Mainnet;
// const SOLANA_NETWORK = WalletAdapterNetwork.Devnet;
const network = SOLANA_NETWORK;

const WalletProvider = dynamic(
  () => import("../contexts/ClientWalletProvider"),
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  const endpoint = useMemo(() => "https://solana-api.projectserum.com", []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider>
        <JupiterWrapper>
          <Component {...pageProps} />
        </JupiterWrapper>
      </WalletProvider>
    </ConnectionProvider>
  );
}

const JupiterWrapper: React.FC = ({ children }) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  return (
    <JupiterProvider
      cluster="mainnet-beta"
      connection={connection}
      userPublicKey={wallet.publicKey || undefined}
    >
      {children}
    </JupiterProvider>
  );
};

export default MyApp;
