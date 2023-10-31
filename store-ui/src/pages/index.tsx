// import { api } from "@/utils/api";
import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  // const context = api.useContext();
  // const user = context.auth.user.getData();
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <main>{JSON.stringify(user)}</main> */}
    </>
  );
};

export default Home;
