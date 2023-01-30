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
import { det, inv } from "mathjs";

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

export default function HillCipher() {
  const router = useRouter();

  const initialCipherkeys = Array.from({ length: 9 }, () => "");

  const mod = (n: number, m: number) => {
    return ((n % m) + m) % m;
  };

  const getCofactor = (
    A: number[][],
    temp: number[][],
    p: number,
    q: number,
    n: number
  ) => {
    let i = 0,
      j = 0;

    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        if (row != p && col != q) {
          temp[i][j++] = A[row][col];

          if (j == n - 1) {
            j = 0;
            i++;
          }
        }
      }
    }
  };

  const determinant = React.useCallback((A: number[][], n: number) => {
    let D = 0;

    if (n == 1) return A[0][0];

    let temp = new Array(3);
    for (let i = 0; i < 3; i++) {
      temp[i] = new Array(3);
    }

    let sign = 1;

    for (let f = 0; f < n; f++) {
      getCofactor(A, temp, 0, f, n);
      D += sign * A[0][f] * determinant(temp, n - 1);

      sign = -sign;
    }

    return D;
  }, []);

  const adjoint = React.useCallback(
    (A: number[][], adj: number[][]) => {
      let sign = 1;
      let temp = new Array(3);
      for (let i = 0; i < 3; i++) {
        temp[i] = new Array(3);
      }

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          getCofactor(A, temp, i, j, 3);

          sign = (i + j) % 2 == 0 ? 1 : -1;

          adj[j][i] = sign * determinant(temp, 2);
        }
      }

      return adj;
    },
    [determinant]
  );

  const modInverse = React.useCallback(
    (cipherMatrix: number[][], cipherKeys: number[][]) => {
      let detCipherKeys = mod(det(cipherKeys), 26);
      let adj = new Array(3);

      for (let i = 0; i < 3; i++) {
        adj[i] = new Array(3);
      }

      adj = adjoint(cipherKeys, adj);

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cipherMatrix[i][j] = mod(adj[i][j] * detCipherKeys, 26);
        }
      }

      return cipherMatrix;
    },
    [adjoint]
  );

  const getKeyMatrix = (cipherKeys: string[]) => {
    let cipherMatrix: string[] = cipherKeys.reduce(
      (rows: string[], key: string, index: number) =>
        (index % 3 == 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) &&
        rows,
      []
    );

    let numberKeys = Array.from(Array(3), () => Array.from(Array(3)));
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        numberKeys[i][j] = cipherMatrix[i][j].charCodeAt(0) % 65;
      }
    }

    return numberKeys;
  };

  const encryption = (
    cipherMatrix: number[][],
    cipherKeys: number[][],
    messageVector: number[][]
  ) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 1; j++) {
        cipherMatrix[i][j] = 0;

        for (let x = 0; x < 3; x++) {
          cipherMatrix[i][j] += cipherKeys[i][x] * messageVector[x][j];
        }

        cipherMatrix[i][j] = cipherMatrix[i][j] % 26;
      }
    }

    return cipherMatrix;
  };

  const decryption = React.useCallback(
    (
      cipherMatrix: number[][],
      cipherKeys: number[][],
      messageVector: number[][]
    ) => {
      let inversedCipherMatrix = modInverse(cipherMatrix, cipherKeys);
      let resMatrix = Array.from(Array(3), () => Array.from(Array(1)));

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 1; j++) {
          resMatrix[i][j] = 0;

          for (let x = 0; x < 3; x++) {
            resMatrix[i][j] += inversedCipherMatrix[i][x] * messageVector[x][j];
          }
          resMatrix[i][j] = mod(resMatrix[i][j], 26);
        }
      }

      return resMatrix;
    },
    [modInverse]
  );

  const hillCipher = React.useCallback(
    (plainText: string, cipherKeys: string[], encrypt: boolean) => {
      let currText = plainText
        .split(" ")
        .join("")
        .replace(/[^a-zA-Z]/g, "")
        .toUpperCase();
      let messageVector = new Array(3);
      let cipherMatrix = new Array(3);
      let text = "";

      let numberKeys = getKeyMatrix(cipherKeys);

      for (let i = 0; i < 3; i++) {
        messageVector[i] = new Array(1);
        messageVector[i][0] = 0;
      }

      for (let i = 0; i < 3; i++)
        messageVector[i][0] = currText[i].charCodeAt(0) % 65;

      for (let i = 0; i < 3; i++) {
        cipherMatrix[i] = new Array(1);
        cipherMatrix[i][0] = 0;
      }

      if (encrypt) {
        cipherMatrix = encryption(cipherMatrix, numberKeys, messageVector);
      } else {
        cipherMatrix = decryption(cipherMatrix, numberKeys, messageVector);
      }

      for (let i = 0; i < 3; i++) {
        text += String.fromCharCode(cipherMatrix[i][0] + 65);
      }

      return text;
    },
    [decryption]
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
            console.log("hill", dataURL);
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
  console.log("hill", loading);

  return (
    <>
      <ChakraProvider theme={theme}>
        <Head>
          <title>Hill Cipher</title>
          <meta name="description" content="Hill cipher" />
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
            <h1 className={`${vollkorn_sc.className}`}>Hill Cipher</h1>
          </div>

          <Box
            display="flex"
            width="75%"
            height="850px"
            borderWidth="4px"
            justifyContent="center"
            flexDirection="column"
            margin="20px"
          >
            <Box>
              <Text
                w="100%"
                fontWeight="bold"
                textAlign="center"
                margin="10px"
                fontSize={24}
              >
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
                aria-label="hill-input"
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
                  aria-label="hill-file-input"
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
              columns={3}
              margin="20px"
              width="15%"
              minChildWidth="40px"
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
                  }}
                  onInput={(e) => {
                    e.target.value = ("" + e.target.value).toUpperCase();
                  }}
                  variant="outline"
                  h="50px"
                  maxH="100%"
                  overflow="auto"
                  aria-label="hill-coef-input"
                  textAlign="center"
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
                    const res = await hillCipher(inputText, cipherkeys, true);
                    setResult(res);
                  } else {
                    const res = await hillCipher(fileAsText, cipherkeys, true);
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
                    const res = await hillCipher(inputText, cipherkeys, false);
                    setResult(res);
                  } else {
                    const res = await hillCipher(fileAsText, cipherkeys, false);
                    setResult(res);
                  }
                  setLoading(false);
                }}
              >
                Decrypt
              </Button>
            </Stack>

            <Box>
              <Text
                w="100%"
                fontWeight="bold"
                textAlign="center"
                margin="10px"
                fontSize={24}
              >
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
