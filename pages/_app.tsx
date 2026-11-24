import type { AppProps } from "next/app";
import Head from "next/head";
import { SettingsProvider } from "../src/context/SettingsContext";
import Motion from "../src/components/Motion";
import "react-quill-new/dist/quill.snow.css";
import "../src/index.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SettingsProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Motion />
      <Component {...pageProps} />
    </SettingsProvider>
  );
}
