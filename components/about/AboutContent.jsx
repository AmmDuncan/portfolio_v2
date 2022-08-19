import styled from "styled-components";
import Link from "next/link";
import { motion } from "framer-motion";

const AboutContentRoot = styled.div`
  margin-bottom: 8rem;
  max-width: 48ch;
  margin-inline: auto;

  h1 {
    margin-block: 4rem -0.8rem;
  }

  a {
    color: royalblue;
    text-decoration: underline;
  }

  p {
  }
  @media (min-width: 768px) {
    max-width: 64ch;

    h1 {
      text-align: center;
    }
    p {
      font-size: 1.8rem;
    }
  }
  @media (min-width: 992px) {
    max-width: 68ch;

    p {
      font-size: 2rem;
    }
  }
`;

function AboutContent() {
  return (
    <AboutContentRoot>
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring", mass: 1.5, damping: 13, delay: 0.3 }}
      >
        About Me
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring", mass: 1.5, damping: 13, delay: 0.45 }}
      >
        I am a Frontend Developer based in Ghana🇬🇭. I can build Backends when necessary. But I
        prefer building user interfaces primarily. My goal is to build sustainable solutions that
        provide great user experiences.
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring", mass: 1.5, damping: 13, delay: 0.45 }}
      >
        I sometimes write about things I find interesting and things I believe will be useful to
        others and myself in the future; at least as a reference. You can view my posts{" "}
        <Link href="https://blog.ammielyawson.com">
          <a target="_blank">here</a>
        </Link>
        .
      </motion.p>
    </AboutContentRoot>
  );
}

export default AboutContent;
