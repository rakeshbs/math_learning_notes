import React from "react";
import { BlockMath } from "react-katex";

function texify(str) {
  if (!str) return "";
  var res = str;
  var symbols = [
    "phi",
    "theta",
    "lambda",
    "sigma",
    "mu",
    "alpha",
    "beta",
    "gamma",
    "tau",
    "eps",
    "nabla",
    "approx",
    "sqrt",
    "sum",
    "integral",
    "pi",
    "det",
    "exp",
    "log",
    "max",
    "min",
    "in",
  ];
  symbols.forEach(function (sym) {
    res = res.replace(new RegExp("\\b" + sym + "\\b", "g"), "\\" + sym);
  });
  res = res.replace(/\\eps/g, "\\epsilon");
  res = res.replace(/->/g, "\\rightarrow");
  res = res.replace(/<=/g, "\\leq");
  res = res.replace(/>=/g, "\\geq");
  res = res.replace(/\bR\^/g, "\\mathbb{R}^");
  res = res.replace(/\|\|/g, "\\|");
  res = res.replace(/≈/g, "\\approx");
  res = res.replace(/√/g, "\\sqrt ");
  res = res.replace(/³/g, "^3");
  res = res.replace(/Σ/g, "\\Sigma");
  res = res.replace(/argmax/g, "\\operatorname{argmax}");
  res = res.replace(/argmin/g, "\\operatorname{argmin}");
  return res;
}

var CARD = {
  background: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 12,
  padding: "16px 18px",
};

var CARD_ACCENT = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 12,
  padding: "16px 18px",
};

function SectionLabel(props) {
  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: 10,
        color: "rgba(255,255,255,0.3)",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        marginBottom: 8,
        fontWeight: 600,
      }}
    >
      {props.children}
    </div>
  );
}

function BodyText(props) {
  return (
    <p
      style={{
        margin: 0,
        fontSize: 13.5,
        lineHeight: 1.7,
        color: "rgba(255,255,255,0.72)",
      }}
    >
      {props.children}
    </p>
  );
}

function BulletList(props) {
  var items = props.items;
  var marker = props.marker;
  var markerColor = props.markerColor;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {items.map(function (item, i) {
        return (
          <div
            key={i}
            style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
          >
            <span
              style={{
                color: markerColor,
                fontFamily: "monospace",
                fontSize: 11,
                lineHeight: "1.9",
                flexShrink: 0,
                opacity: 0.85,
              }}
            >
              {marker(i)}
            </span>
            <span
              style={{
                fontSize: 13,
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.68)",
              }}
            >
              {item}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function buildSelfTestPrompts(concept, details, expansion) {
  return [
    "Explain " + concept.title + " geometrically in one minute.",
    "Starting from the formula, derive a quick numerical sanity check.",
    "Identify one failure mode and how you would detect it early.",
    "Connect this concept to: " +
      (expansion.connections[0] || details.useCases[0] || "a nearby idea") +
      ".",
  ];
}

export function ConceptDetailsPanel(props) {
  var concept = props.concept;
  var explanation = props.explanation;
  var details = props.details;
  var expansion = props.expansion;
  var selfTestPrompts = buildSelfTestPrompts(concept, details, expansion);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* ── Title + Formula ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "stretch" }}>
        {/* Title block */}
        <div style={{ flex: "1 1 220px" }}>
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 28,
              fontWeight: 400,
              color: concept.color,
              margin: "0 0 4px",
              lineHeight: 1.2,
            }}
          >
            {concept.title}
          </h2>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: concept.accent,
              margin: 0,
              opacity: 0.7,
            }}
          >
            {concept.subtitle}
          </p>
        </div>

        {/* Formula card */}
        <div
          style={{
            flex: "2 1 320px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid " + concept.color + "30",
            borderRadius: 12,
            padding: "12px 18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <SectionLabel>Formula</SectionLabel>
          <div style={{ color: concept.accent, overflowX: "auto" }}>
            <BlockMath
              math={texify(explanation.formula)}
              renderError={function () {
                return (
                  <code
                    style={{
                      fontFamily: "monospace",
                      fontSize: 13,
                      color: concept.accent,
                    }}
                  >
                    {explanation.formula}
                  </code>
                );
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Definition + Visual Intuition ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <div style={{ ...CARD, flex: "1 1 260px" }}>
          <SectionLabel>Definition</SectionLabel>
          <BodyText>{explanation.what}</BodyText>
        </div>
        <div style={{ ...CARD, flex: "1 1 260px" }}>
          <SectionLabel>Visual Intuition</SectionLabel>
          <BodyText>{explanation.visual}</BodyText>
        </div>
      </div>

      {/* ── Key Insights ── */}
      {explanation.intuition && explanation.intuition.length > 0 && (
        <div style={CARD}>
          <SectionLabel>Key Insights</SectionLabel>
          <BulletList
            items={explanation.intuition}
            marker={function (i) { return String(i + 1).padStart(2, "0"); }}
            markerColor={concept.color}
          />
        </div>
      )}

      {/* ── Algebraic Lens + Deeper View ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {expansion.algebraic && (
          <div style={{ ...CARD, flex: "1 1 260px" }}>
            <SectionLabel>Algebraic Lens</SectionLabel>
            <BodyText>{expansion.algebraic}</BodyText>
          </div>
        )}
        {details.deeper && (
          <div style={{ ...CARD, flex: "1 1 260px" }}>
            <SectionLabel>Deeper View</SectionLabel>
            <BodyText>{details.deeper}</BodyText>
          </div>
        )}
      </div>

      {/* ── Computation Notes ── */}
      {expansion.computation && (
        <div style={CARD}>
          <SectionLabel>Computation Notes</SectionLabel>
          <BodyText>{expansion.computation}</BodyText>
        </div>
      )}

      {/* ── How to Calculate ── */}
      {expansion.howToCompute && expansion.howToCompute.length > 0 && (
        <div
          style={{
            ...CARD,
            borderColor: concept.color + "35",
          }}
        >
          <SectionLabel>How to Calculate</SectionLabel>
          <BulletList
            items={expansion.howToCompute}
            marker={function (i) { return String(i + 1) + "."; }}
            markerColor={concept.accent}
          />
        </div>
      )}

      {/* ── Use Cases + Connections ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {details.useCases && details.useCases.length > 0 && (
          <div style={{ ...CARD, flex: "1 1 260px" }}>
            <SectionLabel>Practical Use Cases</SectionLabel>
            <BulletList
              items={details.useCases}
              marker={function (i) { return String(i + 1).padStart(2, "0"); }}
              markerColor={concept.accent}
            />
          </div>
        )}
        {expansion.connections && expansion.connections.length > 0 && (
          <div style={{ ...CARD, flex: "1 1 260px" }}>
            <SectionLabel>Connected Ideas</SectionLabel>
            <BulletList
              items={expansion.connections}
              marker={function () { return "→"; }}
              markerColor={concept.color}
            />
          </div>
        )}
      </div>

      {/* ── Pitfalls + Quick Check ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {details.pitfalls && details.pitfalls.length > 0 && (
          <div
            style={{
              ...CARD,
              flex: "1 1 260px",
              borderColor: "rgba(255,184,107,0.18)",
            }}
          >
            <SectionLabel>Common Pitfalls</SectionLabel>
            <BulletList
              items={details.pitfalls}
              marker={function () { return "!"; }}
              markerColor="rgba(255,184,107,0.9)"
            />
          </div>
        )}
        {details.quickCheck && (
          <div style={{ ...CARD, flex: "1 1 260px" }}>
            <SectionLabel>Quick Check</SectionLabel>
            <BodyText>{details.quickCheck}</BodyText>
          </div>
        )}
      </div>

      {/* ── Worked Example ── */}
      {expansion.workedExample && (
        <div style={CARD}>
          <SectionLabel>Micro Example</SectionLabel>
          <BodyText>{expansion.workedExample}</BodyText>
        </div>
      )}

      {/* ── Deep Dive ── */}
      {explanation.deepDive && explanation.deepDive.length > 0 && (
        <div style={CARD}>
          <SectionLabel>Deep Dive</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {explanation.deepDive.map(function (entry, i) {
              if (
                typeof entry === "string" &&
                entry.startsWith("$$") &&
                entry.endsWith("$$")
              ) {
                return (
                  <div key={i} style={{ overflowX: "auto" }}>
                    <BlockMath
                      math={entry.slice(2, -2).trim()}
                      renderError={function () {
                        return (
                          <code
                            style={{
                              fontFamily: "monospace",
                              fontSize: 13,
                              color: concept.accent,
                            }}
                          >
                            {entry}
                          </code>
                        );
                      }}
                    />
                  </div>
                );
              }
              return <BodyText key={i}>{entry}</BodyText>;
            })}
          </div>
        </div>
      )}

      {/* ── Self-Test Prompts ── */}
      <div
        style={{
          ...CARD_ACCENT,
          borderColor: concept.color + "28",
        }}
      >
        <SectionLabel>Self-Test Prompts</SectionLabel>
        <BulletList
          items={selfTestPrompts}
          marker={function () { return "?"; }}
          markerColor={concept.color}
        />
      </div>
    </div>
  );
}
