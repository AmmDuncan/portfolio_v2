import Head from "next/head";
import dynamic from "next/dynamic";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";

const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const DeskJourney = dynamic(() => import("../components/desk/DeskJourney"), { ssr: false });

export default function Desk() {
  return (
    <div className={`${sans.variable} ${mono.variable}`}>
      <Head>
        <title>Ammiel Yawson · Product engineer</title>
        <meta
          name="description"
          content="Product engineer in Accra. Products for founders, tools for building with AI, and guides on how I work."
        />
        <meta name="theme-color" content="#07080a" />
      </Head>
      <DeskJourney fonts={{ sans: sans.style.fontFamily, mono: mono.style.fontFamily }} />
    </div>
  );
}

Desk.bareLayout = true;
