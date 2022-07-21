import React from "react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { LogoPurple, NavOpenIcon } from "../../../assets";
import { Container } from "../../common";
import { NavbarRoot, Title, NavButton } from "./Navbar.styles";

function Navbar() {
  const [classes, setClasses] = React.useState("");

  const navEventHandler = React.useCallback(
    (...args) => controlNavBg({ setClasses })(...args),
    []
  );

  React.useEffect(() => {
    console.log("adding event");
    document.addEventListener("scroll", navEventHandler);
    return () => {
      console.log("removing event");
      document.removeEventListener("scroll", navEventHandler);
    };
  }, [navEventHandler]);

  return (
    <NavbarRoot className={classes}>
      <Container className="nav__container">
        <Title>
          <LogoPurple />
          <span className="name">Ammiel Yawson</span>
        </Title>

        <NavButton>
          <HiOutlineMenuAlt3 size={32} />
        </NavButton>
      </Container>
    </NavbarRoot>
  );
}

function controlNavBg({ setClasses }) {
  return () => {
    if (window.pageYOffset > 100) {
      setClasses("with-bg");
    } else {
      setClasses("");
    }
  };
}

export default Navbar;
