import Head from "next/head";
import dynamic from "next/dynamic";
import { Instrument_Sans, JetBrains_Mono, Unbounded } from "next/font/google";

const instrumentSans = Instrument_Sans({ subsets: ["latin"], display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], display: "swap" });
const unbounded = Unbounded({ subsets: ["latin"], display: "swap" });

const DeskJourney = dynamic(() => import("../components/desk/DeskJourney"), { ssr: false });

export default function Desk() {
  const fontVars = {
    "--font-display": unbounded.style.fontFamily,
    "--font-sans": instrumentSans.style.fontFamily,
    "--font-mono": jetbrains.style.fontFamily,
  };
  return (
    <div style={fontVars}>
      <Head>
        <title>Ammiel Yawson · Product engineer</title>
        <meta
          name="description"
          content="Product engineer in Accra. Products for founders and teams, and guides on how I work."
        />
        <meta name="theme-color" content="#07080a" />
        <meta name="robots" content="noindex" />
      </Head>
      <DeskJourney
        fonts={{
          sans: instrumentSans.style.fontFamily,
          mono: jetbrains.style.fontFamily,
          display: unbounded.style.fontFamily,
        }}
      />
    </div>
  );
}

Desk.bareLayout = true;
