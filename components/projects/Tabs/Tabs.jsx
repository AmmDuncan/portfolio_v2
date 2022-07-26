import React from "react";
import { TabsRoot } from "./Tabs.styles";
import cx from "classnames";

const tabs = ["Projects", "Side-Projects"];

function Tabs({ active, setActive }) {
  return (
    <TabsRoot>
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
