import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";

const instrumentSans = Instrument_Sans({ subsets: ["latin"], display: "swap" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], display: "swap" });

/** Type pairings under review; ?type= picks one, "a" is the default. */
const PAIRINGS = {
  a: { display: instrumentSans, sans: instrumentSans, mono: jetbrains },
  b: { display: jetbrains, sans: instrumentSans, mono: jetbrains },
  c: { display: instrumentSerif, sans: instrumentSans, mono: jetbrains },
};

const DeskJourney = dynamic(() => import("../components/desk/DeskJourney"), { ssr: false });

export default function Desk() {
  const { query } = useRouter();
  const pairing = PAIRINGS[query.type] ?? PAIRINGS.a;
  const fontVars = {
    "--font-display": pairing.display.style.fontFamily,
    "--font-sans": pairing.sans.style.fontFamily,
    "--font-mono": pairing.mono.style.fontFamily,
  };
  return (
    <div style={fontVars} data-type={query.type ?? "a"}>
      <Head>
        <title>Ammiel Yawson · Product engineer</title>
        <meta
          name="description"
          content="Product engineer in Accra. Products for founders, tools for building with AI, and guides on how I work."
        />
        <meta name="theme-color" content="#07080a" />
        <meta name="robots" content="noindex" />
      </Head>
      <DeskJourney
        key={query.type ?? "a"}
        fonts={{ sans: pairing.sans.style.fontFamily, mono: pairing.mono.style.fontFamily }}
      />
    </div>
  );
}

Desk.bareLayout = true;
