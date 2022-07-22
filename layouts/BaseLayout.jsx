import Navbar from "../components/layout/Navbar";
import ThemeSwitch from "../components/common/ThemeSwitch/ThemeSwitch";

function BaseLayout(props) {
  return (
    <>
      <Navbar />
      {props.children}
      <ThemeSwitch />
    </>
  );
}

export default BaseLayout;
