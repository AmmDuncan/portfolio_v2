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
          content="Hi my name is Ammiel, I'm a Frontend Web Developer with some practical knowledge about Backend Development."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
      <ToolsUsed />
      <Projects />
    </div>
  );
}
