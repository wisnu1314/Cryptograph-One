import Head from "next/head";
import { Inter, Vollkorn_SC } from "@next/font/google";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });
const vollkorn_sc = Vollkorn_SC({
  subsets: ["latin"],
  weight: "400",
});

export default function PlayfairCipher() {
  return (
    <>
      <Head>
        <title>Playfair Cipher</title>
        <meta name="description" content="Playfair cipher" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>PlayfairCipher</main>
    </>
  );
}
