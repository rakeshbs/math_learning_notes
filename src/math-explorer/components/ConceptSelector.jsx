export function ConceptSelector(props) {
  var groups = props.groups;
  var concepts = props.concepts;
  var active = props.active;
  var onSelect = props.onSelect;

  return (
    <div style={{ marginBottom: 28 }}>
      {groups.map(function (g) {
        return (
          <div key={g.id} style={{ marginBottom: 10 }}>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                color: "rgba(255,255,255,0.22)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: 5,
              }}
            >
              {g.label}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {concepts
                .filter(function (c) {
                  return c.group === g.id;
                })
                .map(function (c) {
                  return (
                    <button
                      key={c.id}
                      onClick={function () {
                        onSelect(c.id);
                      }}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 16,
                        border:
                          active === c.id
                            ? "1.5px solid " + c.color
                            : "1.5px solid rgba(255,255,255,0.06)",
                        background:
                          active === c.id ? c.color + "15" : "transparent",
                        color:
                          active === c.id ? c.color : "rgba(255,255,255,0.4)",
                        fontFamily: "monospace",
                        fontSize: 11,
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {c.title}
                    </button>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
