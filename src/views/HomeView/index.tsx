import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletConnectButton,
} from "@solana/wallet-adapter-react-ui";
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
          <div className="hero min-h-16 py-20">
            <div className="text-center hero-content">
              <div className="max-w-md">
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
        </div>
      </div>
    </div>
  );
};

const SolanaLogo = () => (
  <svg width="46" height="35" xmlns="http://www.w3.org/2000/svg" className="inline">
    <defs>
      <linearGradient
        x1="90.737%"
        y1="34.776%"
        x2="35.509%"
        y2="55.415%"
        id="a"
      >
        <stop stopColor="#00FFA3" offset="0%" />
        <stop stopColor="#DC1FFF" offset="100%" />
      </linearGradient>
      <linearGradient x1="66.588%" y1="43.8%" x2="11.36%" y2="64.439%" id="b">
        <stop stopColor="#00FFA3" offset="0%" />
        <stop stopColor="#DC1FFF" offset="100%" />
      </linearGradient>
      <linearGradient
        x1="78.586%"
        y1="39.317%"
        x2="23.358%"
        y2="59.956%"
        id="c"
      >
        <stop stopColor="#00FFA3" offset="0%" />
        <stop stopColor="#DC1FFF" offset="100%" />
      </linearGradient>
    </defs>
    <g fillRule="nonzero" fill="none">
      <path
        d="M7.256 26.713c.27-.27.64-.427 1.033-.427h35.64a.73.73 0 0 1 .517 1.247l-7.04 7.04c-.27.27-.64.427-1.034.427H.732a.73.73 0 0 1-.516-1.246l7.04-7.04Z"
        fill="url(#a)"
        transform="translate(.98)"
      />
      <path
        d="M7.256.427C7.536.157 7.907 0 8.289 0h35.64a.73.73 0 0 1 .517 1.246l-7.04 7.04c-.27.27-.64.428-1.034.428H.732a.73.73 0 0 1-.516-1.247l7.04-7.04Z"
        fill="url(#b)"
        transform="translate(.98)"
      />
      <path
        d="M37.405 13.486c-.27-.27-.64-.427-1.033-.427H.732a.73.73 0 0 0-.516 1.246l7.04 7.04c.27.27.64.428 1.033.428h35.64a.73.73 0 0 0 .517-1.247l-7.04-7.04Z"
        fill="url(#c)"
        transform="translate(.98)"
      />
    </g>
  </svg>
);
