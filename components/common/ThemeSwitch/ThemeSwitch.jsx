import React from "react";
import { BsFillMoonStarsFill, BsSunFill } from "react-icons/bs";

import { ThemeSwitchRoot } from "./ThemeSwitch.styles";

function ThemeSwitch() {
  const [night, setNight] = React.useState(false);

  React.useEffect(() => {
    try {
      const prefersDark = window.matchMedia("prefers-color-scheme").matches;
      const lsValue = localStorage.getItem("ammiel-port-theme");
      const parsedValue = JSON.parse(lsValue);
      if (prefersDark && !lsValue) setNight(true);
      if (lsValue && JSON.parse(lsValue)) setNight(parsedValue);
    } catch {
      localStorage.remove("ammiel-port-theme");
    }
  }, []);

  React.useEffect(() => {
    if (night) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [night]);

  const toggleMode = () => {
    setNight((prevValue) => {
      localStorage.setItem("ammiel-port-theme", JSON.stringify(!prevValue));
      return !prevValue;
    });
  };

  return (
    <ThemeSwitchRoot onClick={toggleMode} className={night ? "night" : ""}>
      <div className="head">
        {!night && <BsFillMoonStarsFill size={18} />}
        {night && <BsSunFill size={18} />}
      </div>
    </ThemeSwitchRoot>
  );
}

export default ThemeSwitch;
