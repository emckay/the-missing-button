import Head from "next/head";
import { ButtonGame } from "./ButtonGame";

const ButtonsPage = () => {
  return (
    <>
      <Head>
        <title>The Missing Button</title>
        <link rel="manifest" href="manifest.json" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Missing Button" />
        <meta name="apple-mobile-web-app-title" content="Missing Button" />
        <meta name="theme-color" content="#6298f0" />
        <meta name="msapplication-navbutton-color" content="#6298f0" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="msapplication-starturl" content="/" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        <link rel="icon" sizes="152x152" href="/button-assets/icons/152.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/button-assets/icons/152.png"
        />
        <link rel="icon" sizes="167x167" href="/button-assets/icons/167.png" />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/button-assets/icons/167.png"
        />
        <link rel="icon" sizes="180x180" href="/button-assets/icons/180.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/button-assets/icons/180.png"
        />
        <link rel="icon" sizes="512x512" href="/button-assets/icons/512.png" />
        <link
          rel="apple-touch-icon"
          sizes="512x512"
          href="/button-assets/icons/512.png"
        />
        <link
          rel="icon"
          sizes="1024x1024"
          href="/button-assets/icons/1024.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="1024x1024"
          href="/button-assets/icons/1024.png"
        />
      </Head>
      <ButtonGame />
    </>
  );
};

export default ButtonsPage;
