import { useState } from "react";
import { MathConceptExplorer } from "./math-explorer";
import { ALL_DOMAINS } from "./domains";
import LearningStepByStepArticle from "./gpu-step-by-step/LearningStepByStepArticle";

var LEARNING_TAB = {
  id: "learning",
  label: "Learning",
};

function getDomainById(id) {
  return ALL_DOMAINS.find(function (domain) {
    return domain.id === id;
  });
}

export default function App() {
  var st = useState(ALL_DOMAINS[0].id);
  var activeTabId = st[0];
  var setActiveTabId = st[1];
  var isLearningTab = activeTabId === LEARNING_TAB.id;

  var activeDomain = getDomainById(activeTabId) || ALL_DOMAINS[0];
  var tabItems = ALL_DOMAINS.map(function (domain) {
    return {
      id: domain.id,
      label: domain.title.replace("Visual Intuition for ", ""),
    };
  }).concat([LEARNING_TAB]);

  var tabs = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      {tabItems.map(function (tab) {
        var isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            onClick={function () {
              setActiveTabId(tab.id);
            }}
            style={{
              padding: "7px 14px",
              borderRadius: 18,
              border: isActive
                ? "1.5px solid rgba(255,255,255,0.32)"
                : "1.5px solid rgba(255,255,255,0.08)",
              background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
              color: isActive ? "#fff" : "rgba(255,255,255,0.58)",
              fontFamily: "monospace",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );

  if (isLearningTab) {
    return <LearningStepByStepArticle headerSlot={tabs} />;
  }

  return (
    <MathConceptExplorer
      key={activeDomain.id}
      domain={activeDomain}
      headerSlot={tabs}
    />
  );
}
