import { ShapeEnum } from "./SimulationUtils";

export interface SimulationVector2D extends Pos2D {
  id: number,
  moveable: boolean,
  gid: number,
  shape: ShapeEnum,
  shapeIndex: number,
}

export interface Pos2D {
  x: number,
  y: number,
}
