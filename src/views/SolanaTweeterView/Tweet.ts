import * as anchor from "@project-serum/anchor";

export type AccountData = {
  author: anchor.web3.PublicKey;
  timestamp: anchor.BN;
  topic: string;
  content: string;
};
export class Tweet {
  publicKey: anchor.web3.PublicKey;
  author: anchor.web3.PublicKey;
  timestamp: string;
  topic: string;
  content: string;

  constructor(publicKey: anchor.web3.PublicKey, accountData: AccountData) {
    this.publicKey = publicKey;
    this.author = accountData.author;
    this.timestamp = accountData.timestamp.toString();
    this.topic = accountData.topic;
    this.content = accountData.content;
  }

  get key() {
    return this.publicKey.toBase58();
  }

  get authorDisplay() {
    const author = this.author.toBase58();
    return author.slice(0, 4) + ".." + author.slice(-4);
  }

  get createdAt() {
    const date = getDate(this.timestamp);
    return date.toLocaleDateString();
  }

  get createdAgo() {
    const date = getDate(this.timestamp);
    return timeSince(date);
  }
}

// convert unix timestamp to js date object
const getDate = (timestamp: string) => {
  const utxDate = parseInt(timestamp);
  const date = new Date(utxDate * 1000);
  return date;
};

function timeSince(date: any) {
  var seconds = Math.floor(((new Date() as any) - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
var aDay = 24 * 60 * 60 * 1000;
