import Head from "next/head";
import { useRouter } from "next/router";
import { Inter, Vollkorn_SC } from "@next/font/google";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });
const vollkorn_sc = Vollkorn_SC({
  subsets: ["latin"],
  weight: "400",
});

export default function AffineCipher() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Affine Cipher</title>
        <meta name="description" content="Affine cipher" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <div>
            <a onClick={() => router.back()} className={styles.button}>
              <p>
                <span>&lt;-</span> Go back
              </p>
            </a>
          </div>
        </div>
        <div className={styles.center}>
          <h1 className={vollkorn_sc.className}>Affine Cipher</h1>
        </div>
        <div className={styles.center}>
          <h1 className={vollkorn_sc.className}>Affine Cipher</h1>
        </div>
      </main>
    </>
  );
}
