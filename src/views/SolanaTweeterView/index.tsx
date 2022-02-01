import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { HomeIcon, UserIcon } from "@heroicons/react/outline";
import orderBy from "lodash.orderby";

import { Loader, SelectAndConnectWalletButton } from "components";
import * as anchor from "@project-serum/anchor";

import { SolanaLogo } from "components";
import styles from "./index.module.css";
import { getTweets, authorFilter, sendTweet } from "./tweets";
import { useProgram } from "./useProgram";

const endpoint = "https://explorer-api.devnet.solana.com";

const connection = new anchor.web3.Connection(endpoint);

export const SolanaTweeterView: FC = ({}) => {
  const [isAirDropped, setIsAirDropped] = useState(false);
  const wallet = useAnchorWallet();

  const airdropToWallet = async () => {
    if (wallet) {
      setIsAirDropped(false);
      const signature = await connection.requestAirdrop(
        wallet.publicKey,
        1000000000
      );

      const tx = await connection.confirmTransaction(signature);
      setIsAirDropped(true);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className={styles.container}>
        <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
          <div className="flex-none">
            <button className="btn btn-square btn-ghost">
              <span className="text-4xl">🐦</span>
            </button>
          </div>
          <div className="flex-1 px-2 mx-2">
            <div className="text-sm breadcrumbs">
              <ul className="text-xl">
                <li>
                  <Link href="/">
                    <a>Templates</a>
                  </Link>
                </li>
                <li>
                  <span className="opacity-40">Solana Twitter</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-none">
            <WalletMultiButton className="btn btn-ghost" />
          </div>
        </div>

        <div className="text-center pt-2">
          <div className="hero min-h-16 pt-4">
            <div className="text-center hero-content">
              <div className="max-w-lg">
                <h1 className="mb-5 text-5xl">
                  Solana Twitter <SolanaLogo />
                </h1>

                <p className="mb-5">
                  Here is simplified version of Twitter as a Solana dApp. <br />
                  It aims to be Next.JS UI build for{" "}
                  <a
                    href="https://lorisleiva.com/create-a-solana-dapp-from-scratch"
                    target="_blank"
                    className="link font-bold"
                    rel="noreferrer"
                  >
                    Create a Solana dApp from scratch
                  </a>{" "}
                  tutorial.
                </p>

                <p>UI connects to DEVNET network.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex mb-16">
          <div className="mr-4">Need some SOL on test wallet?</div>
          <div className="mr-4">
            <button
              className="btn btn-primary normal-case btn-xs"
              onClick={airdropToWallet}
            >
              Airdrop 1 SOL
            </button>
          </div>
          {isAirDropped ? <div className="opacity-50">Sent!</div> : null}
        </div>

        <div>
          {!wallet ? (
            <SelectAndConnectWalletButton onUseWalletClick={() => {}} />
          ) : (
            <TwitterScreen />
          )}
        </div>
      </div>
    </div>
  );
};

const TwitterScreen = () => {
  const wallet: any = useAnchorWallet();
  const [activeTab, setActiveTab] = useState(0);
  const [tweets, setTweets] = useState<unknown[]>([]);
  const [profileTweets, setProfileTweets] = useState<unknown[]>([]);
  const { program } = useProgram({ connection, wallet });
  const [lastUpdatedTime, setLastUpdatedTime] = useState<number>();

  useEffect(() => {
    fetchTweets();
    fetchProfileTweets();
  }, [wallet, lastUpdatedTime]);

  const fetchTweets = async () => {
    if (wallet && program) {
      try {
        const tweets = await getTweets({
          program,
          // topicFilter('solana'),
        });
        setTweets(tweets);
      } catch (error) {
        // set error
      }
    }
  };

  const fetchProfileTweets = async () => {
    if (wallet && program) {
      try {
        const tweets = await getTweets({
          program,
          // topicFilter('solana'),
          filter: [authorFilter(wallet?.publicKey.toBase58())],
        });
        setProfileTweets(tweets);
      } catch (error) {
        // set error
      }
    }
  };

  const onTweenSent = (newTweet: unknown) => {
    setTweets((prevState) => ({
      ...prevState,
      newTweet,
    }));
  };

  const sortedTweets = orderBy(tweets, ["timestamp"], ["desc"]);

  return (
    <div className="rounded-lg shadow flex">
      <div className="border-r border-gray-500 mr-8">
        <ul className="menu p-4 overflow-y-auto bg-base-100 text-base-content">
          <li>
            <a
              className={activeTab === 0 ? "active" : ""}
              onClick={() => setActiveTab(0)}
            >
              <HomeIcon className="h-8 w-8 text-white-500" />
            </a>
          </li>
          <li>
            <a
              className={activeTab === 1 ? "active" : ""}
              onClick={() => setActiveTab(1)}
            >
              <UserIcon className="h-8 w-8 text-white-500" />
            </a>
          </li>
        </ul>
      </div>
      <div className="flex flex-col items-center justify-center">
        {activeTab === 0 ? (
          <div className="text-xs">
            <NetTweet onTweenSent={onTweenSent} />
            {sortedTweets.map((t: any) => (
              <Tweet key={(t as any).key} content={t} />
            ))}
          </div>
        ) : (
          <TwitterProfile tweets={profileTweets} wallet={wallet} />
        )}
      </div>
    </div>
  );
};

type NetTweet = {
  onTweenSent: (t: any) => void;
};

const NetTweet: FC<NetTweet> = ({ onTweenSent }) => {
  const wallet: any = useAnchorWallet();
  const { program } = useProgram({ connection, wallet });
  const [content, setContent] = useState<string>("");

  const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value) {
      setContent(value);
    }
  };

  const onTweetSendClick = async () => {
    if (!content || !program) return;

    const topic = "default";
    const tweet = await sendTweet({
      wallet,
      program,
      topic,
      content,
    });

    console.log("added new tweet: ", tweet);
    setContent("");
    onTweenSent(tweet);
  };

  return (
    <div className="mb-8 pb-4 border-b border-gray-500 flex ">
      <div className="avatar placeholder mr-4">
        <div className="mb-4 rounded-full bg-neutral-focus text-neutral-content w-14 h-14">
          Me
        </div>
      </div>
      <div className="form-control flex-1 mx-2">
        <textarea
          className="textarea h-24 w-full text-2xl"
          placeholder="What's happening?"
          value={content}
          onChange={onContentChange}
        ></textarea>
      </div>
      <div className="ml-auto">
        <button
          className="btn btn-primary rounded-full normal-case	px-16"
          onClick={onTweetSendClick}
        >
          Tweet
        </button>
      </div>
    </div>
  );
};

const Tweet = ({ content }: any) => {
  return (
    <div className="mb-8 border-b border-gray-500 flex">
      <div className="avatar placeholder mr-4">
        <div className="mb-4 rounded-full bg-neutral-focus text-neutral-content w-14 h-14">
          {content.authorDisplay.slice(0, 2)}
        </div>
      </div>
      <div>
        <div className="flex text-sm">
          <div className="font-bold">{content.authorDisplay}</div>
          <div className="mx-2 opacity-50">·</div>
          <div className="opacity-50">{content.createdAgo}</div>
        </div>
        <div className="text-xl">{content.content}</div>
        {content.topic ? (
          <div className="text-pink-400 my-2">#{content.topic}</div>
        ) : null}
      </div>
    </div>
  );
};

const TwitterProfile = ({ tweets, wallet }: any) => {
  return (
    <div className="flex-1 text-left width-full">
      <div>Profile</div>
      <div>{wallet.publicKey.toString()}</div>

      <div className="my-8">
        {tweets.length === 0 ? (
          <div className="text-3xl opacity-50 text-center">
            You have no tweets
          </div>
        ) : null}
        {tweets.map((t: any) => (
          <Tweet key={t.key} content={t} />
        ))}
      </div>
    </div>
  );
};
