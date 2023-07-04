export interface SimulationVector2D extends Pos2D {
  id: number,
  moveable: boolean,
  gid: number,
}

export interface Pos2D {
  x: number,
  y: number,
}
