import Head from "next/head";
import { useUser } from "../lib/hooks";

export default function Home() {

  useUser();
  // the actual code

  return (
    <div className="container">
      <Head>
        <title>Feed</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
