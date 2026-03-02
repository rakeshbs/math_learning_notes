import React from "react";

const Plot = ({
  fn,
  xRange = [-5, 5],
  yRange = [-1.5, 1.5],
  color = "#4caf50",
  width = 300,
  height = 150,
}) => {
  const points = [];
  const step = (xRange[1] - xRange[0]) / width;
  const yMin = yRange[0];
  const ySpan = yRange[1] - yRange[0];

  for (let x = xRange[0]; x <= xRange[1]; x += step) {
    const y = fn(x);
    const px = ((x - xRange[0]) / (xRange[1] - xRange[0])) * width;
    const py = height - ((y - yMin) / ySpan) * height;
    points.push([px, py]);
  }

  const path = points
    .map((p, i) => (i === 0 ? "M" : "L") + `${p[0].toFixed(2)},${p[1].toFixed(2)}`)
    .join(" ");

  const zeroX = ((-xRange[0]) / (xRange[1] - xRange[0])) * width;
  const zeroY = height - ((-yMin) / ySpan) * height;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ background: "rgba(255,255,255,0.05)", borderRadius: 4 }}
    >
      <line x1={0} y1={zeroY} x2={width} y2={zeroY} stroke="rgba(255,255,255,0.2)" />
      <line x1={zeroX} y1={0} x2={zeroX} y2={height} stroke="rgba(255,255,255,0.2)" />
      <path d={path} stroke={color} strokeWidth={2} fill="none" />
    </svg>
  );
};

export const SigmoidVis = () => (
  <Plot fn={(x) => 1 / (1 + Math.exp(-x))} yRange={[-0.1, 1.1]} color="#4caf50" />
);

export const TanhVis = () => (
  <Plot fn={(x) => Math.tanh(x)} yRange={[-1.3, 1.3]} color="#2196f3" />
);

export const BinaryStepVis = () => (
  <Plot fn={(x) => (x < 0 ? 0 : 1)} yRange={[-0.2, 1.4]} color="#f44336" />
);

export const ReLUVis = () => (
  <Plot fn={(x) => Math.max(0, x)} yRange={[-0.5, 5.5]} color="#ff9800" />
);

export const LeakyReLUVis = () => (
  <Plot fn={(x) => (x > 0 ? x : 0.1 * x)} yRange={[-0.8, 5.5]} color="#ffc107" />
);

export const ELUVis = () => (
  <Plot fn={(x) => (x > 0 ? x : 1.0 * (Math.exp(x) - 1))} yRange={[-1.2, 5.5]} color="#ff5722" />
);

export const SELUVis = () => {
  const scale = 1.0507009873554805;
  const alpha = 1.6732632423543772;
  return (
    <Plot
      fn={(x) => scale * (x > 0 ? x : alpha * (Math.exp(x) - 1))}
      yRange={[-1.8, 5.5]}
      color="#00bcd4"
    />
  );
};

export const PReLUVis = () => (
  <Plot fn={(x) => (x > 0 ? x : 0.25 * x)} yRange={[-1.5, 5.5]} color="#ffd600" />
);

export const GELUVis = () => (
  <Plot
    fn={(x) =>
      0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x * x * x)))
    }
    yRange={[-0.5, 5.5]}
    color="#e91e63"
  />
);

export const SwishVis = () => (
  <Plot
    fn={(x) => x / (1 + Math.exp(-x))}
    yRange={[-0.5, 5.5]}
    color="#673ab7"
  />
);

export const MishVis = () => (
  <Plot
    fn={(x) => x * Math.tanh(Math.log(1 + Math.exp(x)))}
    yRange={[-0.5, 5.5]}
    color="#3f51b5"
  />
);

export const HardswishVis = () => (
  <Plot
    fn={(x) => {
      if (x <= -3) return 0;
      if (x >= 3) return x;
      return (x * (x + 3)) / 6;
    }}
    yRange={[-0.5, 5.5]}
    color="#ff6f00"
  />
);

export const SoftmaxVis = () => (
  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.6 }}>
    Softmax operates on a vector, not a single value — it cannot be shown as a 2D curve.
    <br />
    <br />
    Example input: <code style={{ color: "#9c27b0" }}>[1.0, 2.0, 3.0]</code>
    <br />
    After softmax: <code style={{ color: "#9c27b0" }}>[0.09, 0.24, 0.67]</code>
    <br />
    <br />
    The largest score (3.0) captures 67% of the probability mass.
  </div>
);

export const SoftplusVis = () => (
  <Plot fn={(x) => Math.log(1 + Math.exp(x))} yRange={[-0.3, 5.5]} color="#8bc34a" />
);

export const SoftsignVis = () => (
  <Plot fn={(x) => x / (1 + Math.abs(x))} yRange={[-1.3, 1.3]} color="#009688" />
);

export const IdentityVis = () => (
  <Plot fn={(x) => x} xRange={[-5, 5]} yRange={[-5.5, 5.5]} color="#607d8b" />
);
