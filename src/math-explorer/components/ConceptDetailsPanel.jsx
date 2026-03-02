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

function splitIntoChecklist(text) {
  if (!text) return [];
  return text
    .split(/[.;]/)
    .map(function (item) {
      return item.trim();
    })
    .filter(Boolean)
    .slice(0, 4);
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

function buildDetailedVisualIntuition(
  concept,
  explanation,
  details,
  expansion,
) {
  var intuition = explanation.intuition || [];
  var firstConnection = expansion.connections[0] || concept.title;
  var firstPitfall =
    details.pitfalls[0] || "Check orientation, scale, and domain assumptions.";
  return [
    "Scene setup: " + explanation.visual,
    "Primary signal to track: " +
      (intuition[0] || "Track direction and magnitude changes."),
    "Secondary signal to track: " +
      (intuition[1] || "Compare input geometry against output geometry."),
    "Quantitative anchor: " + explanation.formula,
    "Interpretation bridge: connect the picture to " + firstConnection + ".",
    "Guardrail while interpreting: " + firstPitfall,
  ];
}

function buildDetailedUseCases(concept, details, expansion) {
  var useCases =
    details.useCases && details.useCases.length
      ? details.useCases
      : [
          "Use " +
            concept.title +
            " to reason about structure and behavior in models.",
        ];
  return useCases.map(function (useCase, i) {
    var connection =
      expansion.connections[i % Math.max(expansion.connections.length, 1)] ||
      concept.title;
    var pitfall =
      details.pitfalls[i % Math.max(details.pitfalls.length, 1)] ||
      "Validate assumptions before applying formulas directly.";
    return (
      useCase +
      ". Visual cue: relate it to " +
      connection +
      ". Validation step: " +
      details.quickCheck +
      ". Common failure mode: " +
      pitfall
    );
  });
}

export function ConceptDetailsPanel(props) {
  var concept = props.concept;
  var explanation = props.explanation;
  var details = props.details;
  var expansion = props.expansion;
  var checklist = splitIntoChecklist(expansion.computation);
  var selfTestPrompts = buildSelfTestPrompts(concept, details, expansion);
  var visualDeepDive = buildDetailedVisualIntuition(
    concept,
    explanation,
    details,
    expansion,
  );
  var detailedUseCases = buildDetailedUseCases(concept, details, expansion);

  return (
    <div>
      <h2
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 26,
          fontWeight: 400,
          color: concept.color,
          marginBottom: 3,
        }}
      >
        {concept.title}
      </h2>
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          color: concept.accent,
          marginBottom: 18,
          opacity: 0.6,
        }}
      >
        {concept.subtitle}
      </p>

      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 5,
          }}
        >
          Definition
        </div>
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.68)",
          }}
        >
          {explanation.what}
        </p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 5,
          }}
        >
          Visual Intuition
        </div>
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.68)",
          }}
        >
          {explanation.visual}
        </p>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 8,
          }}
        >
          Detailed Visual Intuition
        </div>
        {visualDeepDive.map(function (item, i) {
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 6,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  color: concept.color,
                  fontFamily: "monospace",
                  fontSize: 10,
                  opacity: 0.65,
                  flexShrink: 0,
                }}
              >
                {"::"}
              </span>
              <span
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.62)",
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 5,
          }}
        >
          Deeper View
        </div>
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.68)",
          }}
        >
          {details.deeper}
        </p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 5,
          }}
        >
          Algebraic Lens
        </div>
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.68)",
          }}
        >
          {expansion.algebraic}
        </p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 5,
          }}
        >
          Computation Notes
        </div>
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.68)",
          }}
        >
          {expansion.computation}
        </p>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 8,
          }}
        >
          Computation Checklist
        </div>
        {(checklist.length ? checklist : [expansion.computation]).map(
          function (item, i) {
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 6,
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    color: concept.accent,
                    fontFamily: "monospace",
                    fontSize: 10,
                    opacity: 0.7,
                    flexShrink: 0,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontSize: 12.5,
                    lineHeight: 1.55,
                    color: "rgba(255,255,255,0.62)",
                  }}
                >
                  {item}
                </span>
              </div>
            );
          },
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 5,
          }}
        >
          Micro Example
        </div>
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.68)",
          }}
        >
          {expansion.workedExample}
        </p>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 8,
          }}
        >
          Key Insights
        </div>
        {explanation.intuition.map(function (item, i) {
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 6,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  color: concept.color,
                  fontFamily: "monospace",
                  fontSize: 10,
                  opacity: 0.5,
                  flexShrink: 0,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 8,
          }}
        >
          Detailed Use-Case Walkthroughs
        </div>
        {detailedUseCases.map(function (item, i) {
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 6,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  color: concept.accent,
                  fontFamily: "monospace",
                  fontSize: 10,
                  opacity: 0.75,
                  flexShrink: 0,
                }}
              >
                {"=>"}
              </span>
              <span
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.62)",
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 8,
          }}
        >
          Connected Ideas
        </div>
        {expansion.connections.map(function (item, i) {
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 6,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  color: concept.color,
                  fontFamily: "monospace",
                  fontSize: 10,
                  opacity: 0.65,
                  flexShrink: 0,
                }}
              >
                {"->"}
              </span>
              <span
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 8,
          }}
        >
          Practical Use Cases
        </div>
        {details.useCases.map(function (item, i) {
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 6,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  color: concept.accent,
                  fontFamily: "monospace",
                  fontSize: 10,
                  opacity: 0.7,
                  flexShrink: 0,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 8,
          }}
        >
          Common Pitfalls
        </div>
        {details.pitfalls.map(function (item, i) {
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 6,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  color: "rgba(255,184,107,0.9)",
                  fontFamily: "monospace",
                  fontSize: 11,
                  flexShrink: 0,
                }}
              >
                !!
              </span>
              <span
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.58)",
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 10,
          padding: "10px 14px",
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 5,
          }}
        >
          Formula
        </div>
        <div style={{ color: concept.accent, overflowX: "auto" }}>
          <BlockMath
            math={texify(explanation.formula)}
            renderError={function (error) {
              return (
                <code
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
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

      <div
        style={{
          marginTop: 12,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 10,
          padding: "10px 14px",
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 5,
          }}
        >
          Quick Check
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 12.5,
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.65)",
          }}
        >
          {details.quickCheck}
        </p>
      </div>

      <div
        style={{
          marginTop: 12,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 10,
          padding: "10px 14px",
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 8,
          }}
        >
          Self-Test Prompts
        </div>
        {selfTestPrompts.map(function (item, i) {
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 6,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  color: concept.color,
                  fontFamily: "monospace",
                  fontSize: 10,
                  opacity: 0.6,
                  flexShrink: 0,
                }}
              >
                {"??"}
              </span>
              <span
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.62)",
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
