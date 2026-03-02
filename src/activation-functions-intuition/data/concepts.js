export const CONCEPTS = [
  { id: "sigmoid",     title: "Sigmoid",      accent: "#4caf50", group: "traditional" },
  { id: "tanh",        title: "Tanh",          accent: "#2196f3", group: "traditional" },
  { id: "binary-step", title: "Binary Step",   accent: "#f44336", group: "traditional" },
  { id: "relu",        title: "ReLU",          accent: "#ff9800", group: "rectified" },
  { id: "leaky-relu",  title: "Leaky ReLU",    accent: "#ffc107", group: "rectified" },
  { id: "elu",         title: "ELU",           accent: "#ff5722", group: "rectified" },
  { id: "selu",        title: "SELU",          accent: "#00bcd4", group: "rectified" },
  { id: "prelu",       title: "PReLU",         accent: "#ffd600", group: "rectified" },
  { id: "gelu",        title: "GELU",          accent: "#e91e63", group: "modern" },
  { id: "swish",       title: "Swish / SiLU",  accent: "#673ab7", group: "modern" },
  { id: "mish",        title: "Mish",          accent: "#3f51b5", group: "modern" },
  { id: "hardswish",   title: "Hardswish",     accent: "#ff6f00", group: "modern" },
  { id: "softmax",     title: "Softmax",       accent: "#9c27b0", group: "output" },
  { id: "softplus",    title: "Softplus",      accent: "#8bc34a", group: "output" },
  { id: "softsign",    title: "Softsign",      accent: "#009688", group: "output" },
  { id: "identity",    title: "Identity",      accent: "#607d8b", group: "output" },
];

export const GROUPS = [
  { id: "traditional", title: "Traditional / Classical" },
  { id: "rectified",   title: "Rectified Linear Units" },
  { id: "modern",      title: "Modern Smooth Functions" },
  { id: "output",      title: "Output & Special Purpose" },
];
