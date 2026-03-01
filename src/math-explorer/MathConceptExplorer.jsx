import { useState } from "react";
import { ConceptSelector, ConceptDetailsPanel } from "./components";

function getById(list, id) {
  return list.find(function (item) {
    return item.id === id;
  });
}

export default function MathConceptExplorer(props) {
  var domain = props.domain;
  var headerSlot = props.headerSlot;
  var title = domain.title;
  var subtitle = domain.subtitle;
  var concepts = domain.concepts;
  var groups = domain.groups;
  var explanations = domain.explanations;
  var detailsById = domain.details;
  var expansionsById = domain.expansions;
  var visuals = domain.visuals;
  var initialConceptId = domain.initialConceptId || concepts[0].id;

  var st = useState(initialConceptId);
  var active = st[0];
  var setActive = st[1];

  var concept = getById(concepts, active) || concepts[0];
  var explanation = explanations[active] || explanations[concept.id];
  var details = detailsById[active] ||
    detailsById[concept.id] || {
      deeper: "",
      useCases: [],
      pitfalls: [],
      quickCheck: "",
    };
  var expansion = expansionsById[active] ||
    expansionsById[concept.id] || {
      algebraic: "",
      computation: "",
      workedExample: "",
      connections: [],
    };
  var VisComponent = visuals[active] || visuals[concept.id];

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
        {headerSlot ? (
          <div style={{ marginBottom: 20 }}>{headerSlot}</div>
        ) : null}

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
            {title}
          </h1>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
              marginTop: 6,
            }}
          >
            {subtitle ||
              concepts.length + " interactive geometric interpretations"}
          </p>
        </div>

        <ConceptSelector
          groups={groups}
          concepts={concepts}
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
