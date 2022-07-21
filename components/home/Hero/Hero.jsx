import { Container } from "../../common";
import HeroDecor from "../HeroDecor/HeroDecor";
import { Ctas, HeroRoot, Highlight } from "./Hero.styles";
import { Button } from "../../common";
import PhoneIcon from "./icons/PhoneIcon";
import SuitcaseIcon from "./icons/SuitCaseIcon";

function Hero() {
  return (
    <HeroRoot>
      <Container className="hero__container">
        <section className="content">
          <h1>
            I build software solutions with fluent{" "}
            <Highlight>user interfaces</Highlight>.
          </h1>

          <p>
            Fullstack Web Developer-Frontend Heavy, User Interface Designer,
            Writer sometimes.
          </p>
        </section>
        <section className="decor">
          <HeroDecor />
        </section>
      </Container>
      <Ctas>
        <Container className="ctas__container">
          <Button className="primary">
            Get in touch <PhoneIcon />
          </Button>
          <Button>
            View projects <SuitcaseIcon />
          </Button>
        </Container>
      </Ctas>
    </HeroRoot>
  );
}

export default Hero;
