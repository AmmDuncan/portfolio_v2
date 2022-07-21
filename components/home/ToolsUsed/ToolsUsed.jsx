import React from "react";

import Image from "next/image";
import { Container } from "../../common";
import { StyledUnderline, ToolsUsedRoot, Skills } from "./ToolsUsed.styles";
import StartIcon from "./icons/StarIcon";

const skills = [
  { skill: "html", usage: "frequently" },
  { skill: "css-3", usage: "frequently" },
  { skill: "javascript", usage: "frequently" },
  { skill: "react", usage: "frequently" },
  { skill: "vue-js", usage: "frequently" },
  { skill: "sass", usage: "frequently" },
  { skill: "nodejs", usage: "occasionally" },
  { skill: "express", usage: "occasionally" },
  { skill: "python", usage: "once in a while" },
];

function ToolsUsed() {
  const skillsRef = React.createRef();
  const [usage, setUsage] = React.useState("");

  return (
    <ToolsUsedRoot>
      <Container>
        <h2>
          <StyledUnderline>Technologies</StyledUnderline> I&apos;ve Used
        </h2>
        <Skills
          ref={skillsRef}
          onMouseMove={(e) => skillMouseOverHandler(e)}
          onMouseOut={() => removeAllListeners({ skills: skillsRef.current })}
        >
          {skills.map(({ skill, usage }) => (
            <div
              className="skill"
              key={skill}
              onMouseMove={() => setUsage(usage)}
            >
              <Image src={`/assets/images/${skill}.svg`} alt="" layout="fill" />
            </div>
          ))}
          {usage && (
            <div className={"usage " + getSkillClass(usage)}>
              <StartIcon />
              Use {usage}
            </div>
          )}
        </Skills>
      </Container>
    </ToolsUsedRoot>
  );
}

function skillMouseOverHandler(e) {
  const usage = document.querySelector(".usage");
  if (usage) {
    usage.style.top = `${e.clientY}px`;
    usage.style.left = `${e.clientX}px`;
  }
}

function getSkillClass(usage) {
  return (
    {
      frequently: "frequently",
      "once in a while": "once",
      occasionally: "occasionally",
    }[usage] || ""
  );
}

function removeAllListeners({ skills }) {
  skills.removeEventListener("mouseover", skillMouseOverHandler);
}

export default ToolsUsed;
