import type { NextPage } from "next";
import Head from "next/head";
import { GalleryView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>NFT Gallery</title>
        <meta name="description" content="Backend Dashboard for the WOOF community" />
      </Head>
      <GalleryView />
    </div>
  );
};

export default Home;
