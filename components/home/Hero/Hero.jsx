import { Container } from "../../common";
import HeroDecor from "../HeroDecor/HeroDecor";
import { Ctas, HeroRoot, Highlight } from "./Hero.styles";
import { Button } from "../../common";
import PhoneIcon from "./icons/PhoneIcon";
import SuitcaseIcon from "./icons/SuitcaseIcon";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import { EMAIL, TAGLINE } from "../../../data/site";

function Hero() {
  const router = useRouter();

  function goToProjects() {
    router.push("/projects");
  }

  function mailMe() {
    router.push(`mailto:${EMAIL}`);
  }

  // const sharedProps = {
  //   transition: { duration: 0.5 },
  // };

  return (
    <HeroRoot>
      <Container className="hero__container">
        <section className="content">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, type: "spring", mass: 2 }}
          >
            I build software solutions with fluent <Highlight>user interfaces</Highlight>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, type: "spring", delay: 0.2, mass: 1.5 }}
          >
            {TAGLINE}.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, type: "spring", delay: 0.3, mass: 1.5 }}
          >
            <Link className="desk-link" href="/desk">
              Step into my desk →
            </Link>
          </motion.div>
        </section>
        <section className="decor">
          <HeroDecor />
        </section>
      </Container>
      <Ctas
        as={motion.div}
        initial={{ opacity: 0, y: 24 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring", delay: 0.35 }}
      >
        <Container className="ctas__container">
          <Button
            className="primary"
            onClick={mailMe}
            as={motion.button}
            initial={{ opacity: 0, x: -48 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", delay: 0.4, mass: 1.5, damping: 20 }}
          >
            Get in touch <PhoneIcon />
          </Button>
          <Button
            onClick={goToProjects}
            as={motion.button}
            initial={{ opacity: 0, x: -48 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", delay: 0.55, mass: 1.5, damping: 20 }}
          >
            View projects <SuitcaseIcon />
          </Button>
        </Container>
      </Ctas>
    </HeroRoot>
  );
}

export default Hero;
