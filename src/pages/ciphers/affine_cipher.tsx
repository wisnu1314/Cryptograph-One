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

export default function AffineCipher() {
  const router = useRouter();

  function mod(n: number, m: number) {
    return ((n % m) + m) % m;
  }

  const affineCipher = React.useCallback(
    (
      plaintext: string,
      cipherkey1: string,
      cipherkey2: string,
      encrypt: boolean
    ) => {
      cipherkey1 = parseInt(cipherkey1);
      cipherkey2 = parseInt(cipherkey2);
      if (cipherkey1 != 13 || (cipherkey1 & 1) != 0) {
        let text = "";
        let currText = plaintext.split(" ").join("").toUpperCase();
        let z26Inverse = [
          1,
          null,
          9,
          null,
          21,
          null,
          15,
          null,
          3,
          null,
          19,
          null,
          null,
          null,
          7,
          null,
          23,
          null,
          11,
          null,
          5,
          null,
          17,
          null,
          25,
          null,
        ];
        for (let char of currText) {
          if (encrypt) {
            let formula =
              mod(cipherkey1 * (char.charCodeAt(0) - 65) + cipherkey2, 26) + 65;
            text += String.fromCharCode(formula);
            console.log(
              "affine en",
              formula,
              char,
              text,
              cipherkey1,
              cipherkey2
            );
          } else {
            let mInverse = z26Inverse[cipherkey1 - 1];
            let formula =
              mod(mInverse * (char.charCodeAt(0) - 65 - cipherkey2), 26) + 65;
            text += String.fromCharCode(formula);
            console.log(
              "affine dec",
              mInverse,
              formula,
              char,
              text,
              cipherkey1,
              cipherkey2
            );
          }
        }
        return text;
      }
    },
    []
  );

  const [inputText, setInputText] = React.useState("");
  const [result, setResult] = React.useState("");
  const [fileAsText, setFileAsText] = React.useState<string>("");
  const [cipherkey1, setCipherkey1] = React.useState("");
  const [cipherkey2, setCipherkey2] = React.useState("");
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
            console.log("affine", dataURL);
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
  console.log("affine", loading);

  return (
    <>
      <ChakraProvider theme={theme}>
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
            <h1 className={`${vollkorn_sc.className}`}>Affine Cipher</h1>
          </div>

          <Box
            display="flex"
            width="75%"
            height="650px"
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
                aria-label="affine-input"
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
                  aria-label="affine-file-input"
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
              placeholder="Insert A Coefficient"
              type="number"
              value={cipherkey1}
              onChange={(e) => {
                setCipherkey1(e.target.value);
              }}
              variant="outline"
              marginTop="10px"
              w="90%"
              h="50px"
              maxH="100%"
              overflow="auto"
              aria-label="affine-a-coef-input"
              alignSelf="center"
            ></Input>

            <Input
              placeholder="Insert B Coefficient"
              type="number"
              value={cipherkey2}
              onChange={(e) => {
                setCipherkey2(e.target.value);
              }}
              variant="outline"
              marginTop="10px"
              w="90%"
              h="50px"
              maxH="100%"
              overflow="auto"
              aria-label="affine-b-coef-input"
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
                    const res = await affineCipher(
                      inputText,
                      cipherkey1,
                      cipherkey2,
                      true
                    );
                    setResult(res);
                  } else {
                    const res = await affineCipher(
                      fileAsText,
                      cipherkey1,
                      cipherkey2,
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
                    const res = await affineCipher(
                      inputText,
                      cipherkey1,
                      cipherkey2,
                      false
                    );
                    setResult(res);
                  } else {
                    const res = await affineCipher(
                      fileAsText,
                      cipherkey1,
                      cipherkey2,
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
