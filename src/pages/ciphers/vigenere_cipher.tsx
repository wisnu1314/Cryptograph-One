import Head from "next/head";
import { useRouter } from "next/router";
import { Inter, Vollkorn_SC } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import React from "react";
import { Input, Box, Text, Button } from "@chakra-ui/react";
import { read } from "fs";

const inter = Inter({ subsets: ["latin"] });
const alpha = new RegExp("[^a-zA-Z]");
const vollkorn_sc = Vollkorn_SC({
  subsets: ["latin"],
  weight: "400",
});

export default function VigenereCipher() {
  const router = useRouter();
  const keyExpand = React.useCallback(
    (cipherkey: string, messagelength: number) => {
      let newKey = cipherkey;
      while (newKey.length < messagelength) {
        newKey += cipherkey;
      }
      return newKey;
    },
    []
  );
  const vigenereCipher = React.useCallback(
    (plaintext: string, cipherkey: string, encrypt: boolean) => {
      let text = "";
      let currText = plaintext.replace(alpha, "").toUpperCase();
      cipherkey = keyExpand(cipherkey, currText.length).toUpperCase();
      for (let i = 0; i < currText.length; i++) {
        if (encrypt) {
          let coded = currText.charCodeAt(i) + cipherkey.charCodeAt(i) - 65;
          if (coded > 90) coded -= 26;
          text = text + String.fromCharCode(coded);
        } else {
          let coded = currText.charCodeAt(i) - cipherkey.charCodeAt(i) + 65;
          if (coded < 65) coded += 26;
          text = text + String.fromCharCode(coded);
        }
      }
      return text;
    },
    [keyExpand]
  );
  const [inputText, setInputText] = React.useState("");
  const [inputFile, setInputFile] = React.useState<FileList | null>(null);
  const [result, setResult] = React.useState("");
  const [fileAsText, setFileAsText] = React.useState<string>("");
  const showFile = React.useCallback((e: FileList | null) => {
    if (e !== null) {
      const filee = e[0];
      const reader = new FileReader();
      reader.readAsText(filee);
      reader.onloadend = function () {
        if (reader.result !== null) {
          setFileAsText(reader.result.toString());
          //setInputText(reader.result.toString());
        }
      };
    }
  }, []);
  const res = result;
  console.log(
    "vigenere",
    "res",
    vigenereCipher(fileAsText, "AYUSH", true),
    res,
    "file",
    fileAsText
  );
  return (
    <>
      <Head>
        <title>Vigenère Cipher</title>
        <meta name="description" content="Vigenère cipher" />
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

        <Box
          display="flex"
          width="800px"
          height="600px"
          bgColor="blue"
          borderWidth="4px"
          justifyContent="center"
          flexDirection="column"
        >
          <Box>
            <Text w="100%" fontWeight={16} textAlign="center">
              INPUT
            </Text>
          </Box>
          <Input
            placeholder=""
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
            variant="outline"
            marginTop="10px"
            w="90%"
            h="100px"
            maxH="100%"
            overflow="scroll"
            aria-label="vigenere-input"
            verticalAlign="center"
            alignSelf="center"
          ></Input>
          <Input
            placeholder=""
            type="file"
            onChange={(e) => {
              setInputFile(e.target.files);
              showFile(e.target.files);
            }}
            variant="outline"
            marginTop="10px"
            w="90%"
            h="100px"
            maxH="100%"
            overflow="scroll"
            aria-label="vigenere-file-input"
            verticalAlign="center"
            alignSelf="center"
          ></Input>
          <Button
            onClick={() => {
              if (inputText !== "") {
                const res = vigenereCipher(inputText, "AYUSH", true);
                setResult(res);
              } else {
                const res = vigenereCipher(fileAsText, "AYUSH", true);
                setResult(res);
              }
            }}
          >
            Encrypt
          </Button>
          <Text>{result}</Text>
        </Box>
        <div className={styles.center}>
          <h1 className={vollkorn_sc.className}>Vigenère Cipher</h1>
        </div>
      </main>
    </>
  );
}
