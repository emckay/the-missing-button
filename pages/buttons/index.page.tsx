import Head from "next/head";
import { ButtonGame } from "./ButtonGame";

const ButtonsPage = () => {
  return (
    <>
      <Head>
        <title>The Missing Button</title>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="shortcut icon" href="/button-assets/favicon.ico" />
        <link rel="apple-touch-icon" href="/button-assets/icons/1024.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/button-assets/icons/152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/button-assets/icons/180.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/button-assets/icons/167.png"
        />
      </Head>
      <ButtonGame />
    </>
  );
};

export default ButtonsPage;
