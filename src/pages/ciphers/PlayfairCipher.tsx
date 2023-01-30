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
  SimpleGrid,
} from "@chakra-ui/react";
import { StyleFunctionProps } from "@chakra-ui/theme-tools";
import { SaveOutput } from "@/components/SaveOutput";

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

export default function PlayfairCipher() {
  const router = useRouter();

  const initialCipherkeys = Array.from({ length: 25 }, () => "");

  const mod = (n: number, m: number) => {
    return ((n % m) + m) % m;
  };

  const playfairCipher = React.useCallback(
    (plaintext: string, cipherkeys: string[], encrypt: boolean) => {
      let currText = plaintext
        .split(" ")
        .join("")
        .replace("J", "I")
        .replace(/[^a-zA-Z]/g, "")
        .toUpperCase();
      let i = 0;
      let charPair = [];
      let charIndexes = Array.from({ length: 26 }, (v, i) => null);
      let text = "";

      cipherkeys = cipherkeys.reduce(
        (rows, key, index) =>
          (index % 5 == 0
            ? rows.push([key])
            : rows[rows.length - 1].push(key)) && rows,
        []
      );

      while (i < currText.length) {
        let newEntry = null;
        if (i === currText.length - 1) {
          newEntry = [currText[i], "X"];
        } else if (currText[i] === currText[i + 1]) {
          newEntry = [currText[i], "X"];
          i--;
        } else {
          newEntry = [currText[i], currText[i + 1]];
        }
        charPair.push(newEntry);
        i += 2;
      }

      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          charIndexes[cipherkeys[i][j].charCodeAt(0) - 65] = {
            row: i,
            column: j,
          };
        }
      }

      if (encrypt) {
        for (const pair of charPair) {
          let firstCharIdx = charIndexes[pair[0].charCodeAt(0) - 65]!;
          let secondCharIdx = charIndexes[pair[1].charCodeAt(0) - 65]!;

          if (firstCharIdx["row"] === secondCharIdx["row"]) {
            const rowKey = cipherkeys[firstCharIdx["row"]];
            text += rowKey[mod(firstCharIdx["column"] + 1, 5)];
            text += rowKey[mod(secondCharIdx["column"] + 1, 5)];
          } else if (firstCharIdx["column"] === secondCharIdx["column"]) {
            const columnKey = Array.from(
              { length: 5 },
              (v, i) => cipherkeys[i][firstCharIdx["column"]]
            );
            text += columnKey[mod(firstCharIdx["row"] + 1, 5)];
            text += columnKey[mod(secondCharIdx["row"] + 1, 5)];
          } else {
            text += cipherkeys[firstCharIdx["row"]][secondCharIdx["column"]];
            text += cipherkeys[secondCharIdx["row"]][firstCharIdx["column"]];
          }
        }
      } else {
        for (const pair of charPair) {
          let firstCharIdx = charIndexes[pair[0].charCodeAt(0) - 65]!;
          let secondCharIdx = charIndexes[pair[1].charCodeAt(0) - 65]!;

          if (firstCharIdx["row"] === secondCharIdx["row"]) {
            const rowKey = cipherkeys[firstCharIdx["row"]];
            text += rowKey[mod(firstCharIdx["column"] - 1, 5)];
            text += rowKey[mod(secondCharIdx["column"] - 1, 5)];
          } else if (firstCharIdx["column"] === secondCharIdx["column"]) {
            const columnKey = Array.from(
              { length: 5 },
              (v, i) => cipherkeys[i][firstCharIdx["column"]]
            );
            text += columnKey[mod(firstCharIdx["row"] - 1, 5)];
            text += columnKey[mod(secondCharIdx["row"] - 1, 5)];
          } else {
            text += cipherkeys[firstCharIdx["row"]][secondCharIdx["column"]];
            text += cipherkeys[secondCharIdx["row"]][firstCharIdx["column"]];
          }
        }
      }

      return text;
    },
    []
  );

  const [inputText, setInputText] = React.useState("");
  const [result, setResult] = React.useState("");
  const [fileAsText, setFileAsText] = React.useState<string>("");
  const [cipherkeys, setCipherkey] =
    React.useState<string[]>(initialCipherkeys);
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
            console.log("playfair", dataURL);
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
  console.log("playfair", loading);

  return (
    <>
      <ChakraProvider theme={theme}>
        <Head>
          <title>Playfair Cipher</title>
          <meta name="description" content="Playfair cipher" />
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
            <h1 className={`${vollkorn_sc.className}`}>Playfair Cipher</h1>
          </div>

          <Box
            display="flex"
            width="75%"
            height="1000px"
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
                placeholder="Insert Plaintext or Ciphertext"
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
                aria-label="playfair-input"
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
                  aria-label="playfair-file-input"
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

            <Box>
              <Text w="100%" fontWeight={12} textAlign="center" margin="10px">
                Insert Cipher Key
              </Text>
            </Box>

            <SimpleGrid
              columns={5}
              margin="20px"
              spacingY="20px"
              width="50%"
              alignSelf="center"
            >
              {cipherkeys.map((cipherkey, i) => (
                <Input
                  key={i}
                  type="text"
                  value={cipherkeys[i]}
                  onChange={(e) => {
                    setCipherkey([
                      ...cipherkeys.slice(0, i),
                      e.target.value,
                      ...cipherkeys.slice(i + 1),
                    ]);
                    console.log(cipherkeys);
                  }}
                  onInput={(e) => {
                    e.target.value = ("" + e.target.value).toUpperCase();
                  }}
                  variant="outline"
                  w="50%"
                  h="50px"
                  maxH="100%"
                  overflow="auto"
                  aria-label="playfair-coef-input"
                  maxLength={1}
                ></Input>
              ))}
            </SimpleGrid>

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
                    const res = await playfairCipher(
                      inputText,
                      cipherkeys,
                      true
                    );
                    setResult(res);
                  } else {
                    const res = await playfairCipher(
                      fileAsText,
                      cipherkeys,
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
                    const res = await playfairCipher(
                      inputText,
                      cipherkeys,
                      false
                    );
                    setResult(res);
                  } else {
                    const res = await playfairCipher(
                      fileAsText,
                      cipherkeys,
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

            <SaveOutput text={result} />
          </Box>
        </main>
      </ChakraProvider>
    </>
  );
}
