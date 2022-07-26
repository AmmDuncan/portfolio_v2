import React from "react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { FiExternalLink } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import cx from "classnames";
import { useRouter } from "next/router";

import { LogoPurple } from "../../../assets";
import { Container } from "../../common";
import { NavbarRoot, Title, NavButton, SidebarRoot } from "./Navbar.styles";
import { navlist } from "./Navbar.helpers";
import ActiveLink from "./ActiveLink";

function Navbar() {
  const [classes, setClasses] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  const navEventHandler = React.useCallback((...args) => controlNavBg({ setClasses })(...args), []);
  React.useEffect(() => {
    console.log("adding event");
    document.addEventListener("scroll", navEventHandler);
    return () => {
      console.log("removing event");
      document.removeEventListener("scroll", navEventHandler);
    };
  }, [navEventHandler]);

  function goHome() {
    router.push("/");
  }

  return (
    <NavbarRoot className={classes}>
      <Container className="nav__container">
        <Title onClick={goHome}>
          <LogoPurple />
          <span className="name">Ammiel Yawson</span>
        </Title>
        <Links />

        <NavButton onClick={() => setIsOpen((v) => !v)}>
          <HiOutlineMenuAlt3 size={32} />
        </NavButton>
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </Container>
    </NavbarRoot>
  );
}

function Sidebar(props) {
  return (
    <SidebarRoot className={cx(["sidebar-root", { open: props.isOpen }])}>
      <div className="sidebar">
        <div className="close" onClick={props.onClose}>
          <MdClose size={30} />
        </div>
        <LogoPurple />
        <Links onClose={props.onClose} />
      </div>
      <div className="overlay" onClick={props.onClose}></div>
    </SidebarRoot>
  );
}

function Links(props) {
  return (
    <ul className="nav-list">
      {navlist.map(({ to, display, external }) => (
        <ActiveLink key={display} href={to} activeClassName="active">
          <span className="link" onClick={() => setTimeout(props.onClose, 300)}>
            {display}
            {external && <FiExternalLink />}
          </span>
        </ActiveLink>
      ))}
    </ul>
  );
}

function controlNavBg({ setClasses }) {
  return () => {
    if (window.scrollY > 100) {
      setClasses("with-bg");
    } else {
      setClasses("");
    }
  };
}

export default Navbar;
