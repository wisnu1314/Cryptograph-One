import Head from "next/head";
import Image from "next/image";
import { Inter, Vollkorn_SC } from "@next/font/google";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });
const vollkorn_sc = Vollkorn_SC({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  return (
    <>
      <Head>
        <title>CryptOne</title>
        <meta name="description" content="Cryptograph first application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <div>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By Daffa & Wisnu
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <h1 className={vollkorn_sc.className}>Cryptograph One</h1>
        </div>

        <div className={styles.grid}>
          <a
            href="/ciphers/vigenere_cipher"
            className={styles.card}
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Vigenere Cipher <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Method of encrypting alphabetic text by using a series of
              interwoven Caesar ciphers, based on the letters of a keyword
            </p>
          </a>

          <a
            href="/ciphers/autokey_vigenere_cipher"
            className={styles.card}
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Auto-key Vigenere Cipher<span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Vigenere Cipher where the key is based on the original plaintext
            </p>
          </a>

          <a
            href="/ciphers/extended_vigenere_cipher"
            className={styles.card}
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Extended Vigenere Cipher <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Vigenere Cipher for 256 ASCII characters
            </p>
          </a>

          <a
            href="/ciphers/affine_cipher"
            className={styles.card}
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Affine Cipher <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              A type of monoalphabetic substitution cipher, where each letter in
              an alphabet is mapped to its numeric equivalent
            </p>
          </a>

          <a
            href="/ciphers/playfair_cipher"
            className={styles.card}
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Playfair Cipher <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              A manual symmetric encryption technique and was the first literal
              digram substitution cipher
            </p>
          </a>

          <a
            href="/ciphers/hill_cipher"
            className={styles.card}
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Hill Cipher <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              A polygraphic substitution cipher based on linear algebra
            </p>
          </a>

          <a
            href="/ciphers/enigma_cipher"
            className={styles.card}
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Enigma Cipher <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              A cipher device developed and used in the early- to mid-20th
              century to protect commercial, diplomatic, and military
              communication
            </p>
          </a>
        </div>
      </main>
    </>
  );
}
