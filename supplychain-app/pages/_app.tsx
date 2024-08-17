import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { TrackingProvider } from '../context/Tracking';
import { NavBar, Footer } from '../Components';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
        <TrackingProvider>
            <NavBar />
            <Component {...pageProps} />
            <Footer />
        </TrackingProvider>
    </>

  );
}