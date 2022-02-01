import * as anchor from "@project-serum/anchor";
import bs58 from "bs58";

import { Tweet, AccountData } from "./Tweet";

type GetTwitterProps = {
  program: anchor.Program<anchor.Idl>;
  filter?: unknown[];
};

export const getTweets = async ({ program, filter = [] }: GetTwitterProps) => {
  const tweetsRaw = await program.account.tweet.all(filter as any);
  const tweets = tweetsRaw.map((t: any) => new Tweet(t.publicKey, t.account));
  return tweets;
};

export const authorFilter = (authorBase58PublicKey: string) => ({
  memcmp: {
    offset: 8, // Discriminator.
    bytes: authorBase58PublicKey,
  },
});

export const topicFilter = (topic: string) => ({
  memcmp: {
    offset:
      8 + // Discriminator.
      32 + // Author public key.
      8 + // Timestamp.
      4, // Topic string prefix.
    bytes: bs58.encode(Buffer.from(topic)),
  },
});

type SendTweetProps = {
  program: anchor.Program<anchor.Idl>;
  topic: string;
  content: string;
  wallet: any;
};

export const sendTweet = async ({
  wallet,
  program,
  topic,
  content,
}: SendTweetProps) => {
  // Generate a new Keypair for our new tweet account.
  const tweet = anchor.web3.Keypair.generate();

  // Send a "SendTweet" instruction with the right data and the right accounts.
  await program.rpc.sendTweet(topic, content, {
    accounts: {
      author: wallet.publicKey,
      tweet: tweet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [tweet],
  });

  // Fetch the newly created account from the blockchain may not work
  // new account can be not found because it takes some time to confirm TX.
  // const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);

  // instead we return object with same data
  const newTweetAccount: AccountData = {
    author: wallet.publicKey,
    timestamp: new anchor.BN(new Date().getTime()),
    topic,
    content,
  };

  // Wrap the fetched account in a Tweet model so our frontend can display it.
  return new Tweet(tweet.publicKey, newTweetAccount);
};
