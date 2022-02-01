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
            <span className="text-lg font-bold">Caw Caw</span>
          </div>
          <div className="flex-none">
            <WalletMultiButton className="btn btn-ghost" />
          </div>
        </div>

        <div className="text-center pt-2">
          <div className="hero min-h-16 py-4">
            <div className="text-center hero-content">
              <div className="max-w-lg">
                <h1 className="mb-5 text-5xl font-bold">
                  Hello Solana <SolanaLogo /> World!
                </h1>
                <p className="mb-5">
                  This scaffold includes awesome tools for rapid development and
                  deploy dapps to Solana: Next.JS, TypeScript, TailwindCSS,
                  Daisy UI.
                </p>
                <p className="mb-5">
                  Sollana wallet adapter is connected and ready to use.
                </p>
                <p>
                  {publicKey ? <>Your address: {publicKey.toBase58()}</> : null}
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h1 className="mb-5 pb-8 text-5xl">Templates:</h1>
            <ul className="text-left leading-10">
              <li className="mb-5">
                <Link href="/gallery">
                  <a className="text-4xl font-bold hover:underline">
                    🏞 -- NFT Gallery
                  </a>
                </Link>
              </li>
              {/* <li className="mb-5">
                <Link href="/mint">
                  <a className="text-4xl font-bold hover:underline">
                    🍬 -- Candy Machine Mint UI
                  </a>
                </Link>
              </li> */}
              <li>
                <Link href="/tweeter">
                  <a className="mb-5 text-4xl font-bold hover:underline">
                    🐦 -- Solana Tweeter
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
