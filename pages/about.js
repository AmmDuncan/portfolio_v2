import Head from "next/head";
import MyImage from "../components/about/MyImage";
import AboutContent from "../components/about/AboutContent";
import { Container } from "../components/common";

export default function AboutMe() {
  return (
    <div>
      <Head>
        <title>About | Ammiel Yawson</title>
        <meta
          name="description"
          content="Hi my name is Ammiel, I'm a Frontend Web Developer with some practical knowledge in Backend Development."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container style={{ minHeight: "100vh" }}>
        <MyImage />
        <AboutContent />
      </Container>
    </div>
  );
}
