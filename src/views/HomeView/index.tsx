import Link from "next/link";
import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { SolanaLogo } from "components";
import styles from "./index.module.css";

export const HomeView: FC = ({}) => {
  const { publicKey } = useWallet();

  const onClick = () => {};

  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className={styles.container}>
        <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
          <div className="flex-none">
            <button className="btn btn-square btn-ghost">
              <span className="text-4xl">🦤</span>
            </button>
          </div>
          <div className="flex-1 px-2 mx-2">
            <span className="text-lg font-bold">WOOF Dashboard</span>
          </div>
          <div className="flex-none">
            <WalletMultiButton className="btn btn-ghost" />
          </div>
        </div>

        <div className="text-center pt-2">
          <div className="hero min-h-16 py-20">
            <div className="text-center hero-content">
              <div className="max-w-lg">
                <h1 className="mb-5 text-5xl font-bold">
                  Hello WOOFer!
                </h1>
                <p className="mb-5">
                  Welcome to the WOOF dashboard!
                </p>
                <p className="mb-5">
                  Connect your wallet to enter.
                </p>
                <p className="text-green-500">
                  {publicKey ? <>Your address: {publicKey.toBase58()}</> : null}
                </p>
                <div className="mt-10">
                  {/* <h1 className="mb-5 text-5xl">Templates:</h1> */}
                  <ul>
                    <li>
                      <Link href="/gallery">
                        <a className="mb-5 text-4xl font-bold hover:underline">
                          Your NFT Gallery
                        </a>
                      </Link>
                    </li>
                  </ul>
                  
                </div>
                </div>
              </div>
              
              <div>

            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};
