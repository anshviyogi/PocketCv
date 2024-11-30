import { StateProvider } from "@/context/StateContext";
import reducer, { initialState } from "@/context/StateReducers";
import "@/styles/globals.css";
import Head from "next/head";
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] });

export default function App({ Component, pageProps }) {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Head>
        <title>Hey Buddy</title>
        <link rel="shortcut icon" href="/chatbot.png" />
      </Head>
      <main className={poppins.className}>
        <Component {...pageProps} />
      </main>
    </StateProvider>
  );
}
