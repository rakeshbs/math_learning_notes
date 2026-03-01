import { useState } from "react";
import {
  CONCEPTS,
  GROUPS,
  EXPLANATIONS,
  CONCEPT_DETAILS,
  CONCEPT_EXPANSIONS,
} from "./matrix-intuition/data";
import { VIS_MAP } from "./matrix-intuition/visuals";
import {
  ConceptSelector,
  ConceptDetailsPanel,
} from "./matrix-intuition/components";

export default function MatrixIntuition() {
  var st = useState("rank");
  var active = st[0];
  var setActive = st[1];

  var concept =
    CONCEPTS.find(function (c) {
      return c.id === active;
    }) || CONCEPTS[0];
  var explanation = EXPLANATIONS[active] || EXPLANATIONS[concept.id];
  var details = CONCEPT_DETAILS[active] || CONCEPT_DETAILS[concept.id];
  var expansion = CONCEPT_EXPANSIONS[active] || CONCEPT_EXPANSIONS[concept.id];
  var VisComponent = VIS_MAP[active] || VIS_MAP[concept.id];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#09090f",
        color: "#e8e8e8",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "24px 16px",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 34,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            Visual Intuition for Matrices
          </h1>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
              marginTop: 6,
            }}
          >
            {CONCEPTS.length + " interactive geometric interpretations"}
          </p>
        </div>

        <ConceptSelector
          groups={GROUPS}
          concepts={CONCEPTS}
          active={active}
          onSelect={setActive}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 28,
            alignItems: "start",
          }}
        >
          <div>
            <VisComponent key={active} />
          </div>
          <ConceptDetailsPanel
            concept={concept}
            explanation={explanation}
            details={details}
            expansion={expansion}
          />
        </div>
      </div>
    </div>
  );
}
