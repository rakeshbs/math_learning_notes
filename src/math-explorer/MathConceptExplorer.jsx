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
        padding: "24px 16px 48px",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {headerSlot ? (
          <div style={{ marginBottom: 18 }}>{headerSlot}</div>
        ) : null}

        <div style={{ marginBottom: 20 }}>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 30,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#fff",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: "rgba(255,255,255,0.28)",
              margin: "5px 0 0",
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

        {/* Visual canvases */}
        {visualVariants.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              alignItems: "flex-start",
              marginBottom: 28,
            }}
          >
            {visualVariants.map(function (variant) {
              var VariantComponent = variant.component;
              return (
                <div
                  key={variant.id}
                  style={{ flex: "1 1 300px", minWidth: 0 }}
                >
                  {visualVariants.length > 1 ? (
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: 10,
                        color: concept.accent,
                        opacity: 0.7,
                        marginBottom: 6,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
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
        )}

        {/* Divider */}
        {visualVariants.length > 0 && (
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.06)",
              marginBottom: 28,
            }}
          />
        )}

        <ConceptDetailsPanel
          concept={concept}
          explanation={explanation}
          details={details}
          expansion={expansion}
        />
      </div>
    </div>
  );
}
