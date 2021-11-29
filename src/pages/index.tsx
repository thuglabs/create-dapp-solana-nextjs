import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>WOOF Dashboard</title>
        <meta
          name="description"
          content="Backend Dashboard for the WOOF community"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
