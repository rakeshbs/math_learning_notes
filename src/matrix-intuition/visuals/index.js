import {
  RankVis,
  DetVis,
  EigenVis,
  NullVis,
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
  rank: RankVis,
  determinant: DetVis,
  eigenvalues: EigenVis,
  nullspace: NullVis,
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
  svd: SVDVis,
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
