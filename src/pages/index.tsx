import Head from "next/head";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";

const Main = dynamic(import("../components/editor"), {
  ssr: false,
});
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Remirror Editor</title>
      </Head>
      <Main />
    </>
  );
}
