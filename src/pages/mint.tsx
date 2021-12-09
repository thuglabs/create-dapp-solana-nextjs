import type { NextPage } from "next";
import Head from "next/head";
import { CandyMachineMintView } from "../views";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

// optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_LEFT,
  timeout: 5000,
  offset: "10px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

const Mint: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Mint NFT!</title>
        <meta name="description" content="This site will fly high 🦤" />
      </Head>
      <AlertProvider template={AlertTemplate} {...options}>
        <CandyMachineMintView />
      </AlertProvider>
    </div>
  );
};

export default Mint;
