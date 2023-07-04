import { Pos2D, SimulationVector2D } from "./types";

export const isEmpty = (pos: Pos2D, simulationMap: SimulationVector2D[], mapSize: Pos2D, to: Pos2D = { x: 0, y: 1 }) => {
  const toPos: Pos2D = { x: pos.x + to.x, y: pos.y + to.y };
  return toPos.y < mapSize.y && !simulationMap.find((p) => p.x === toPos.x && p.y === toPos.y)
}

export const fall = (id: number, simulationMap: SimulationVector2D[]) => {
  simulationMap.map((tile) => {
    if (tile.id === id) {
      tile.y += 1;
    }
  })
}

export const fixTile = (id: number, simulationMap: SimulationVector2D[]) => {
  simulationMap.map((tile) => {
    if (tile.id === id) {
      tile.moveable = false;
    }
  })
}

export const simulation = (simulationMap: SimulationVector2D[], mapSize: Pos2D) => {
  simulationMap.sort((a, b) => a.id - b.id);
  for (let i = 0; i < simulationMap.length; i) {
    if (!simulationMap[i].moveable) {
      continue;
    }
    const nowSameIdSet: SimulationVector2D[] = [simulationMap[i]];
    const nowId = simulationMap[i].id;
    let j = i + 1;
    while (j < simulationMap.length && simulationMap[j].id === nowId) {
      nowSameIdSet.push(simulationMap[j]);
      j += 1;
    }
    const canFall = nowSameIdSet.every((pos) =>
      isEmpty(pos, simulationMap, mapSize)
    )
    i = j;

    if (canFall) {
      fall(nowId, nowSameIdSet);
    } else {
      fixTile(nowId, nowSameIdSet)
    }
  }
}
