import styled from "styled-components";
import Link from "next/link";

const AboutContentRoot = styled.div`
  margin-bottom: 8rem;
  max-width: 40ch;
  margin-inline: auto;

  h1 {
    margin-block: 4rem -0.8rem;
  }

  a {
    color: royalblue;
    text-decoration: underline;
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
`;

function AboutContent() {
  return (
    <AboutContentRoot>
      <h1>About Me</h1>
      <p>
        I am a Frontend Developer based in Ghana🇬🇭. I can build Backends when necessary. But I
        prefer building user interfaces primarily. My goal is to build sustainable solutions that
        provide great user experiences.
      </p>
      <p>
        I sometimes write about things I find interesting and things I believe will be useful to
        others and myself in the future; at least as a reference. View my posts{" "}
        <Link href="https://blog.ammielyawson.com">
          <a target="_blank">here</a>
        </Link>
        .
      </p>
    </AboutContentRoot>
  );
}

export default AboutContent;
