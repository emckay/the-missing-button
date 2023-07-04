// pages/_app.js
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AppProps } from "next/app";
import localFont from "@next/font/local";

const abcursive = localFont({
  src: [
    {
      path: "../public/fonts/ABCursive.ttf",
      weight: "400",
    },
  ],
});

export const theme = extendTheme({
  config: {
    initialColorMode: "dark",
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <style jsx global>{`
        :root {
          /* ... */
          --abcursive-font: ${abcursive.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
