export function ConceptDetailsPanel(props) {
  var concept = props.concept;
  var explanation = props.explanation;
  var details = props.details;
  var expansion = props.expansion;

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
        <code
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            color: concept.accent,
          }}
        >
          {explanation.formula}
        </code>
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
    </div>
  );
}
