import Link from "next/link";
import { FC } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import * as anchor from "@project-serum/anchor";

import { SolanaLogo } from "components";
import { MintSection } from "./MintSection";
import { config } from "./config";
import styles from "./index.module.css";
import Image from 'next/image'

const treasury = new anchor.web3.PublicKey(config.TREASURY_ADDRESS!);

const candyMachineConfig = new anchor.web3.PublicKey(
  config.CANDY_MACHINE_CONFIG!
);

const candyMachineId = new anchor.web3.PublicKey(config.CANDY_MACHINE_ID!);

const startDateSeed = parseInt(process.env.REACT_APP_CANDY_START_DATE!, 10);

const txTimeout = 30000; // milliseconds (confirm this works for your project)

export const CandyMachineMintView: FC = ({}) => {
  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className={styles.container}>
        <div className="navbar mb-2 shadow-lg bg-base-200 text-neutral-content rounded-box">
          <div className="flex-none">

          </div>
          <div className="flex-1 px-2 mx-2">

          </div>

          <div className="flex-none">
            <WalletMultiButton className="btn btn-ghost" />
          </div>
        </div>

        <div className="text-center pt-2">
          <div className="hero min-h-16 py-20">
            <div className="text-center hero-content">
              <div className="max-w-lg">                
                <Image
                  src="/ForgeBotsLogoWhite.svg"
                  alt="ForgeBots Logo"
                  width={500}
                  height={200}
                />
                

                <p>
                  3333 Premium robots headed for the Solana Metaverse.

                </p>
              </div>
            </div>
          </div>

          <div>
            <MintSection
              candyMachineId={candyMachineId}
              config={candyMachineConfig}
              startDate={startDateSeed}
              treasury={treasury}
              txTimeout={txTimeout}
            />
          </div>

          <div className="max-w-xl mx-auto">
            <h1 className="mb-5 mt-16 text-5xl">ROADMAP</h1>


            <br />
            <p>
              😳 Item 1
              <br />😳 Item 1
              <br />😳 Item 1
              <br />😳 Item 1
              <br />😳 Item 1
            </p>
            <br />
            <p>
              See our full website at {" "}
              <a
                href="https://www.forgebots.io"
                target="_blank"
                rel="noreferrer"
                className="link hover:underline"
              >
                ForgeBots.io
              </a>
            </p>
            <br />

          </div>
        </div>
      </div>
    </div>
  );
};
