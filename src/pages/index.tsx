import type { NextPage } from "next";
import Head from "next/head";
import Home from "../views/Home";

const Index: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Jupiter dApp Scaffold</title>
        <meta
          name="description"
          content="This site will fly high 🦤"
        />
      </Head>
      <Home />
    </div>
  );
};

export default Index;
