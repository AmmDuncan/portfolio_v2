import Head from "next/head";
import Image from "next/image";
import Hero from "../components/home/Hero";
import Projects from "../components/home/Projects/Projects";
import ToolsUsed from "../components/home/ToolsUsed/ToolsUsed";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Portfolio | Ammiel Yawson</title>
        <meta
          name="description"
          content="Hi my name is Ammiel, I'm a Frontend Web Developer with some practical knowledge in Backend Development."
        />

        <meta property="og:url" content="https://www.ammielyawson.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Portfolio | Ammiel Yawson" />
        <meta
          property="og:description"
          content="Hi my name is Ammiel, I'm a Frontend Web Developer with some practical knowledge in Backend Development."
        />
        <meta property="og:image" content="https://ammielyawson.com/assets/images/SEO-Image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="ammielyawson.com" />
        <meta property="twitter:url" content="https://www.ammielyawson.com/" />
        <meta name="twitter:title" content="Portfolio | Ammiel Yawson" />
        <meta
          name="twitter:description"
          content="Hi my name is Ammiel, I'm a Frontend Web Developer with some practical knowledge in Backend Development."
        />
        <meta name="twitter:image" content="https://ammielyawson.com/assets/images/SEO-Image.png" />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
      <ToolsUsed />
      <Projects />
    </div>
  );
}
