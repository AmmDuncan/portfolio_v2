import Head from "next/head";
import Projects from "../components/projects/Projects";

export default function ProjectsPage() {
  return (
    <div>
      <Head>
        <title>Projects | Ammiel Yawson</title>
        <meta
          name="description"
          content="Hi my name is Ammiel, I'm a Frontend Web Developer with some practical knowledge in Backend Development."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Projects />
    </div>
  );
}
