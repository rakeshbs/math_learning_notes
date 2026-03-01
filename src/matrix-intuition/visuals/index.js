import {
  RankVis,
  RankSingularBarsVis,
  DetVis,
  DetOrientationVis,
  EigenVis,
  EigenDecomposeVis,
  NullVis,
  NullspaceFamilyVis,
  TraceVis,
  TransposeVis,
  InverseVis,
  IdentityVis,
  MultiplicationVis,
  NonCommuteVis,
  SpanVis,
} from "./coreVisuals";
import { OrthogonalVis, ProjectionVis, NormVis } from "./geometryVisuals";
import {
  SVDVis,
  SVDValuesVis,
  DiagonalizationVis,
  LUVis,
  QRVis,
  CholeskyVis,
  ConditionVis,
  PseudoinverseVis,
} from "./decompositionVisuals";
import { PosDefVis, SymmetricVis } from "./specialVisuals";
import { LinIndepVis, BasisVis } from "./foundationsVisuals";

export const VIS_MAP = {
  rank: [
    { id: "span-view", label: "Span View", component: RankVis },
    { id: "sv-bars", label: "Singular Values", component: RankSingularBarsVis },
  ],
  determinant: [
    { id: "area-scale", label: "Area Scale", component: DetVis },
    { id: "orientation", label: "Orientation", component: DetOrientationVis },
  ],
  eigenvalues: [
    { id: "eigen-directions", label: "Eigen Directions", component: EigenVis },
    {
      id: "eigenbasis-decomp",
      label: "Basis Decomposition",
      component: EigenDecomposeVis,
    },
  ],
  nullspace: [
    { id: "collapse-view", label: "Collapse View", component: NullVis },
    {
      id: "solution-family",
      label: "Solution Family",
      component: NullspaceFamilyVis,
    },
  ],
  trace: TraceVis,
  transpose: TransposeVis,
  inverse: InverseVis,
  identity: IdentityVis,
  multiplication: MultiplicationVis,
  noncommute: NonCommuteVis,
  span: SpanVis,
  orthogonal: OrthogonalVis,
  projection: ProjectionVis,
  norm: NormVis,
  svd: [
    {
      id: "transform-sequence",
      label: "Transform Sequence",
      component: SVDVis,
    },
    { id: "spectrum", label: "Singular Spectrum", component: SVDValuesVis },
  ],
  diagonalization: DiagonalizationVis,
  lu: LUVis,
  qr: QRVis,
  cholesky: CholeskyVis,
  posdef: PosDefVis,
  symmetric: SymmetricVis,
  condition: ConditionVis,
  pseudoinverse: PseudoinverseVis,
  linindep: LinIndepVis,
  basis: BasisVis,
};
