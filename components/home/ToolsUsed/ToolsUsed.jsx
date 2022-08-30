import React from "react";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "../../common";
import { StyledUnderline, ToolsUsedRoot, Skills } from "./ToolsUsed.styles";
import StartIcon from "./icons/StarIcon";

const skills = [
  { skill: "vue-js", usage: "frequently" },
  { skill: "react", usage: "frequently" },
  { skill: "javascript", usage: "frequently" },
  { skill: "css-3", usage: "frequently" },
  { skill: "html", usage: "frequently" },
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
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", mass: 2.5, delay: 0.7 }}
        >
          <StyledUnderline>Technologies</StyledUnderline> I&apos;ve Used
        </motion.h2>
        <Skills
          ref={skillsRef}
          onMouseMove={(e) => skillMouseOverHandler(e)}
          onMouseOut={() => removeAllListeners({ skills: skillsRef.current })}
        >
          {skills.map(({ skill, usage }, index) => (
            <motion.div
              className="skill"
              key={skill}
              onMouseMove={() => setUsage(usage)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.4,
                type: "tween",
                mass: 1.5,
                damping: 15,
                delay: 0.6 + 0.1 * index,
              }}
            >
              <Image src={`/assets/images/${skill}.svg`} alt="" layout="fill" />
            </motion.div>
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
