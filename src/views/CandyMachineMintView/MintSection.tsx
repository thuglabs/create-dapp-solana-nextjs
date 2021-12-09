import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { useAlert } from "react-alert";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { Loader, SelectAndConnectWalletButton } from "components";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "./candy-machine";

export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
}

export const MintSection = (props: HomeProps) => {
  const alert = useAlert();
  const { connection } = useConnection();
  const [counter, setCounter] = useState({
    itemsAvailable: 0,
    itemsRemaining: 0,
  });
  const [price, setPrice] = useState<number>();
  const [balance, setBalance] = useState<number>();
  const [isActive, setIsActive] = useState(false); // true when countdown completes
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
  const [startDate, setStartDate] = useState(new Date(props.startDate));

  const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const onMint = async () => {
    try {
      setIsMinting(true);
      alert.show("Mint has been started!");

      if (wallet && candyMachine?.program) {
        const mintTxId = await mintOneToken(
          candyMachine,
          props.config,
          wallet.publicKey,
          props.treasury
        );

        alert.show("Confirming transaction...");

        const status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          props.txTimeout,
          connection,
          "singleGossip",
          false
        );

        if (!status?.err) {
          alert.success("Congratulations! Mint succeeded!");
        } else {
          alert.error("Mint failed! Please try again!");
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          setIsSoldOut(true);
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      alert.error(message);
    } finally {
      if (wallet) {
        const balance = await connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
      setIsMinting(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, connection]);

  useEffect(() => {
    (async () => {
      if (!wallet) return;

      try {
        const {
          candyMachine,
          goLiveDate,
          itemsRemaining,
          itemsAvailable,
          price,
        } = await getCandyMachineState(
          wallet,
          props.candyMachineId,
          connection
        );

        setIsSoldOut(itemsRemaining === 0);
        setStartDate(goLiveDate);
        setCandyMachine(candyMachine);
        setCounter({
          itemsRemaining,
          itemsAvailable,
        });
        setPrice(price / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error(error);

        alert.error(
          "Error fetching CandyMachine. Check browser console for the details."
        );
      }
    })();
  }, [wallet, props.candyMachineId, connection]);

  console.log("startDate", startDate);

  return (
    <main>
      <div className={`grid grid-cols-1 gap-4`}>
        <div>
          {wallet && <p>Balance: ◎{(balance || 0).toLocaleString()}</p>}

          {counter?.itemsAvailable ? (
            <>
              {counter?.itemsRemaining} of {counter?.itemsAvailable} Available
            </>
          ) : null}
        </div>
        <div>
          {!wallet ? (
            <SelectAndConnectWalletButton onUseWalletClick={() => {}} />
          ) : (
            <button
              disabled={isSoldOut || isMinting || !isActive}
              onClick={onMint}
              className="btn btn-primary btn-wide btn-lg"
            >
              {isSoldOut ? (
                "SOLD OUT"
              ) : isActive ? (
                isMinting ? (
                  <Loader noText={true} />
                ) : (
                  `MINT for ◎${price}`
                )
              ) : (
                <Countdown
                  date={startDate}
                  onMount={({ completed }) => completed && setIsActive(true)}
                  onComplete={() => setIsActive(true)}
                  renderer={renderCounter}
                />
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  if (!seconds) return <span>Loading...</span>;
  return (
    <span>
      {hours} hours, {minutes} minutes, {seconds} seconds
    </span>
  );
};
