import React, {
  useCallback,
  useEffect,
  useState,
  FunctionComponent,
} from "react";
import { Button } from "@chakra-ui/react";

export const SaveOutput: FunctionComponent = ({ text }) => {
  const [downloadLink, setDownloadLink] = useState("");

  const makeTextFile = useCallback(
    (text: string) => {
      const data = new Blob([text], { type: "text/plain" });

      if (downloadLink !== "") window.URL.revokeObjectURL(downloadLink);

      setDownloadLink(window.URL.createObjectURL(data));
    },
    [downloadLink, setDownloadLink]
  );

  // Call the function if list changes
  useEffect(() => {
    makeTextFile(text);
  }, [text]);

  return (
    <>
      <Button
        size="md"
        margin="10px"
        alignSelf="center"
        colorScheme="green"
        textColor="black"
        onClick={async () => {
          if (text !== "") {
            const element = document.createElement("a");
            element.href = downloadLink;
            element.download = "output.txt";
            document.body.appendChild(element); // firefox dependency
            element.click();
          }
        }}
      >
        Download
      </Button>
    </>
  );
};
