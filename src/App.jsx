import { useState } from "react";
import { MathConceptExplorer } from "./math-explorer";
import { ALL_DOMAINS } from "./domains";

function getDomainById(id) {
  return ALL_DOMAINS.find(function (domain) {
    return domain.id === id;
  });
}

export default function App() {
  var st = useState(ALL_DOMAINS[0].id);
  var activeDomainId = st[0];
  var setActiveDomainId = st[1];

  var activeDomain = getDomainById(activeDomainId) || ALL_DOMAINS[0];

  var tabs = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      {ALL_DOMAINS.map(function (domain) {
        var isActive = domain.id === activeDomain.id;
        return (
          <button
            key={domain.id}
            onClick={function () {
              setActiveDomainId(domain.id);
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
            {domain.title.replace("Visual Intuition for ", "")}
          </button>
        );
      })}
    </div>
  );

  return (
    <MathConceptExplorer
      key={activeDomain.id}
      domain={activeDomain}
      headerSlot={tabs}
    />
  );
}
