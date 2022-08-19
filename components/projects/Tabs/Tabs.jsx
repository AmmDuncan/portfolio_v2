import React from "react";
import { TabsRoot } from "./Tabs.styles";
import cx from "classnames";
import { motion } from "framer-motion";

const tabs = ["Projects", "Side-Projects"];

function Tabs({ active, setActive }) {
  return (
    <TabsRoot
      as={motion.div}
      initial={{ opacity: 0, y: 24 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, type: "spring", mass: 1.5, delay: 0.3, damping: 18 }}
    >
      {tabs.map((tab) => (
        <div
          className={cx(["tab", { active: active === tab }])}
          onClick={() => setActive(tab)}
          key={tab}
        >
          {tab}
        </div>
      ))}
    </TabsRoot>
  );
}

export default Tabs;
