import { useState } from "react";
import { ConceptSelector, ConceptDetailsPanel } from "./components";

function getById(list, id) {
  return list.find(function (item) {
    return item.id === id;
  });
}

function normalizeVisualVariants(entry) {
  if (!entry) return [];

  function toVariant(item, index) {
    if (typeof item === "function") {
      return {
        id: "view-" + (index + 1),
        label: "View " + (index + 1),
        component: item,
      };
    }
    if (
      item &&
      typeof item === "object" &&
      typeof item.component === "function"
    ) {
      return {
        id: item.id || "view-" + (index + 1),
        label: item.label || "View " + (index + 1),
        component: item.component,
      };
    }
    return null;
  }

  if (Array.isArray(entry)) {
    return entry.map(toVariant).filter(Boolean);
  }

  var single = toVariant(entry, 0);
  return single ? [single] : [];
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
  var visualVariants = normalizeVisualVariants(
    visuals[active] || visuals[concept.id],
  );

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
            {visualVariants.map(function (variant, idx) {
              var VariantComponent = variant.component;
              var isLast = idx === visualVariants.length - 1;
              return (
                <div key={variant.id} style={{ marginBottom: isLast ? 0 : 14 }}>
                  {visualVariants.length > 1 ? (
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: concept.accent,
                        opacity: 0.75,
                        marginBottom: 6,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {variant.label}
                    </div>
                  ) : null}
                  <VariantComponent key={active + ":" + variant.id} />
                </div>
              );
            })}
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
