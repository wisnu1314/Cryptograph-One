import Head from "next/head";
import { useRouter } from "next/router";
import { Inter, Vollkorn_SC } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import React from "react";
import {
  extendTheme,
  ChakraProvider,
  Input,
  Box,
  Text,
  Button,
  Select,
  Stack,
} from "@chakra-ui/react";
import { StyleFunctionProps } from "@chakra-ui/theme-tools";

const inter = Inter({ subsets: ["latin"] });
const vollkorn_sc = Vollkorn_SC({
  subsets: ["latin"],
  weight: "400",
});

const theme = extendTheme({
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        color: "default",
        bg: "#000000",
      },
    }),
  },
});

export default function VigenereCipher() {
  const router = useRouter();

  const keyExpand = React.useCallback(
    (cipherkey: string, messagelength: number) => {
      let newKey = cipherkey;
      const expandTimes = Math.floor(messagelength / cipherkey.length);
      newKey = cipherkey.repeat(expandTimes + 1);
      console.log("vigenere", expandTimes);
      return newKey;
    },
    []
  );

  const vigenereCipher = React.useCallback(
    (plaintext: string, cipherkey: string, encrypt: boolean) => {
      let text = "";
      let currText = plaintext.split(" ").join("").toUpperCase();
      cipherkey = keyExpand(cipherkey, currText.length).toUpperCase();
      for (let i = 0; i < currText.length; i++) {
        if (encrypt) {
          let coded = currText.charCodeAt(i) + cipherkey.charCodeAt(i) - 65;
          if (coded > 90) coded -= 26;
          text += String.fromCharCode(coded);
          console.log("vigenere en", currText, text, cipherkey);
        } else {
          let coded = currText.charCodeAt(i) - cipherkey.charCodeAt(i) + 65;
          if (coded < 65) coded += 26;
          text += String.fromCharCode(coded);
          console.log("vigenere dec", currText, text, cipherkey);
        }
      }
      return text;
    },
    [keyExpand]
  );

  const [inputText, setInputText] = React.useState("");
  const [result, setResult] = React.useState("");
  const [fileAsText, setFileAsText] = React.useState<string>("");
  const [cipherkey, setCipherkey] = React.useState("");
  const [inputMode, setInputMode] = React.useState("1");
  const [loading, setLoading] = React.useState(false);

  const showFile = React.useCallback((e: FileList | null) => {
    if (e !== null) {
      const filee = e[0];
      const reader = new FileReader();
      if (filee.type.startsWith("image")) {
        reader.readAsDataURL(filee);
      } else {
        reader.readAsText(filee);
      }
      reader.onloadend = async function () {
        if (reader.result !== null) {
          if (filee.type.startsWith("image")) {
            const dataURL = reader.result.toString().split(",")[1];
            console.log("vigenere", dataURL);
            await setFileAsText(dataURL);
          } else {
            await setFileAsText(reader.result.toString());
          }
        }
      };
    }
  }, []);

  React.useEffect(() => {
    if (fileAsText !== "") {
      setInputText(fileAsText);
    }
  }, [setInputText, fileAsText]);
  console.log("vigenere", loading);

  return (
    <>
      <ChakraProvider theme={theme}>
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

          <div className={styles.center}>
            <h1 className={`${vollkorn_sc.className}`}>Vigenère Cipher</h1>
          </div>

          <Box
            display="flex"
            width="75%"
            height="600px"
            borderWidth="4px"
            justifyContent="center"
            flexDirection="column"
            margin="20px"
          >
            <Box>
              <Text w="100%" fontWeight={16} textAlign="center" margin="10px">
                INPUT
              </Text>
            </Box>

            <Box display="block" w="90%" alignSelf="center">
              <Select
                value={inputMode}
                width="100%"
                onChange={(e) => {
                  setInputMode(e.target.value);
                }}
              >
                <option className={styles.select_option} value="1">
                  Text Input
                </option>
                <option className={styles.select_option} value="2">
                  File Input
                </option>
              </Select>
            </Box>

            {inputMode === "1" && (
              <Input
                placeholder="Insert Plaintext"
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
                overflow="auto"
                aria-label="vigenere-input"
                verticalAlign="center"
                alignSelf="center"
              ></Input>
            )}
            {inputMode === "2" && (
              <Box display="flex" w="100%" flexDirection="column">
                <Input
                  placeholder=""
                  type="file"
                  accept=".txt, image/*"
                  onChange={(e) => {
                    showFile(e.target.files);
                  }}
                  variant="outline"
                  margin="10px"
                  w="90%"
                  overflow="auto"
                  aria-label="vigenere-file-input"
                  verticalAlign="center"
                  alignSelf="center"
                  textAlign="center"
                ></Input>
                <Box
                  display="flex"
                  w="90%"
                  h="100px"
                  bgColor="gray"
                  alignSelf="center"
                  alignContent="center"
                  margin="10px"
                  textAlign="center"
                  overflow="auto"
                >
                  <Text
                    w="100%"
                    maxH="100%"
                    alignSelf="center"
                    fontSize={16}
                    fontWeight="medium"
                    textAlign="center"
                    overflow="auto"
                    padding="10px"
                  >
                    {fileAsText}
                  </Text>
                </Box>
              </Box>
            )}

            <Input
              placeholder="Insert Key"
              type="text"
              value={cipherkey}
              onChange={(e) => {
                setCipherkey(e.target.value);
              }}
              variant="outline"
              marginTop="10px"
              w="90%"
              h="50px"
              maxH="100%"
              overflow="auto"
              aria-label="vigenere-key-input"
              alignSelf="center"
            ></Input>

            <Stack direction="row" spacing={2} alignSelf="center">
              <Button
                isLoading={loading}
                size="md"
                margin="10px"
                alignSelf="center"
                textColor="black"
                onClick={async () => {
                  setLoading(true);
                  if (inputMode === "1") {
                    const res = await vigenereCipher(
                      inputText,
                      cipherkey,
                      true
                    );
                    setResult(res);
                  } else {
                    const res = await vigenereCipher(
                      fileAsText,
                      cipherkey,
                      true
                    );
                    setResult(res);
                  }
                  setLoading(false);
                }}
              >
                Encrypt
              </Button>

              <Button
                isLoading={loading}
                size="md"
                margin="10px"
                alignSelf="center"
                colorScheme="red"
                textColor="black"
                onClick={async () => {
                  setLoading(true);
                  if (inputMode === "1") {
                    const res = await vigenereCipher(
                      inputText,
                      cipherkey,
                      false
                    );
                    setResult(res);
                  } else {
                    const res = await vigenereCipher(
                      fileAsText,
                      cipherkey,
                      false
                    );
                    setResult(res);
                  }
                  setLoading(false);
                }}
              >
                Decrypt
              </Button>
            </Stack>

            <Box>
              <Text w="100%" fontWeight={16} textAlign="center" margin="10px">
                RESULT
              </Text>
            </Box>

            <Box
              display="flex"
              w="90%"
              h="100px"
              bgColor="gray"
              alignSelf="center"
              alignContent="center"
              margin="10px"
              textAlign="center"
              overflow="auto"
            >
              <Text
                w="100%"
                maxH="100%"
                alignSelf="center"
                fontSize={16}
                fontWeight="medium"
                textAlign="center"
                overflow="auto"
                padding="10px"
              >
                {result}
              </Text>
            </Box>
          </Box>
        </main>
      </ChakraProvider>
    </>
  );
}
