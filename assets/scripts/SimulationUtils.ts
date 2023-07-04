import { Pos2D, SimulationVector2D } from "./types";

export const isEmpty = (pos: Pos2D, simulationMap: SimulationVector2D[], mapSize: Pos2D, id: number, to: Pos2D = { x: 0, y: 1 }) => {
  const toPos: Pos2D = { x: pos.x + to.x, y: pos.y + to.y };
  return toPos.y < mapSize.y && !simulationMap.find((p) => p.x === toPos.x && p.y === toPos.y && (p.id !== id || p.id === -1))
}

export const fall = (id: number, simulationMap: SimulationVector2D[], mapHeight: number) => {
  simulationMap.map((tile) => {
    if (tile.id === id || tile.id === -1) {
      tile.y = Math.min(tile.y + 1, mapHeight);
    }
  })
}

export const fixTile = (id: number, simulationMap: SimulationVector2D[]) => {
  simulationMap.map((tile) => {
    if (tile.id === id) {
      tile.moveable = false;
      // tile.id = -1;
    }
  })
}

export type Shape = {
  i: {
    gid: number,
    offsets: Pos2D[],
  },
  j: {
    gid: number,
    offsets: Pos2D[]
  },
  l: {
    gid: number,
    offsets: Pos2D[]
  },
  o: {
    gid: number,
    offsets: Pos2D[]
  },
  s: {
    gid: number,
    offsets: Pos2D[]

  },
  t: {
    gid: number,
    offsets: Pos2D[]
  },
  z: {
    gid: number,
    offsets: Pos2D[]
  }
}

export const defalutShapes: Shape = {
  i: {
    gid: 2,
    offsets: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
    ],
  },
  j: {
    gid: 3,
    offsets: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: -1, y: 2 },
    ]
  },
  l: {
    gid: 4,
    offsets: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 }
    ]
  },
  o: {
    gid: 5,
    offsets: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ]
  },
  s: {
    gid: 6,
    offsets: [
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 1 }
    ]
  },
  t: {
    gid: 7,
    offsets: [
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 0 }
    ]
  },
  z: {
    gid: 8,
    offsets: [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 }
    ]
  }

}

export type ShapeEnum = keyof Shape;

export const generateShape = (simulationMap: SimulationVector2D[], shape: ShapeEnum, mapSize: Pos2D, id: number, gameOver: ()=>void) => {
  const shapeSimulation: SimulationVector2D[] = defalutShapes[shape].offsets.map((p, idx) => {
    const nowSimulationVector2D: SimulationVector2D = {
      id,
      moveable: true,
      gid: defalutShapes[shape].gid,
      x: Math.floor(mapSize.x / 2) + p.x,
      y: 0 + p.y,
      shape,
      shapeIndex: idx,
    }
    if (simulationMap.find((tile) => tile.x === Math.floor(mapSize.x / 2) + p.x && tile.y === p.y)) {
      gameOver();
    }
    return nowSimulationVector2D;
  })
  simulationMap.push(...shapeSimulation);
}

export const clearLine = (y: number[], simulationMap: SimulationVector2D[], changeSimulationMap: (newMap: SimulationVector2D[]) => void) => {
  changeSimulationMap(simulationMap.filter((tile) => y.indexOf(tile.y) == -1));
}

export const checkLine = (width: number, height: number, simulationMap: SimulationVector2D[], changeSimulationMap: (newMap: SimulationVector2D[]) => void) => {
  let count: number[] = [];
  for (let i = 0; i < height; i++) {
    count.push(0);
  }
  simulationMap.map((tile) => {
    count[tile.y] += 1;
  })

  let clearY: number[] = [];
  count.map((c, y) => {
    if (c === width) {
      clearY.push(y);
    }
  })
  if (!simulationMap.find((tile) => tile.moveable)) {
    clearLine(clearY, simulationMap, changeSimulationMap)
  }
}

export const isInCanvas = (pos: Pos2D, mapSize: Pos2D) => {
  return pos.x >= 0 && pos.x < mapSize.x && pos.y >= 0 && pos.y < mapSize.y;
}

let origin: Pos2D = { x: 0, y: 0 }

export const calcAbsolutePos = (pos: Pos2D): Pos2D => {
  return { x: origin.x + pos.x, y: origin.y + pos.y }
}
export const rotate = (originPos: Pos2D, absPos: Pos2D): Pos2D => {

  return { y: absPos.x - originPos.x + originPos.y, x: -(absPos.y - originPos.y) + originPos.x };
}

export const rotateShape = (simulationMap: SimulationVector2D[], mapSize: Pos2D) => {
  const shapeSets: SimulationVector2D[] = simulationMap.filter((tile) => tile.moveable);
  const preMap: SimulationVector2D[] = simulationMap.filter((tile) => !tile.moveable);
  if (shapeSets[0].shape === 'o') {
    return simulationMap;
  }
  const originTile = shapeSets.find((tile) => tile.shapeIndex === 1);
  const canMove = shapeSets.every((tile) => {
    const toPos: Pos2D = rotate({ x: originTile.x, y: originTile.y }, { x: tile.x, y: tile.y });
    return isInCanvas(toPos, mapSize) && isEmpty({ x: toPos.x, y: toPos.y }, simulationMap, mapSize, tile.id, { x: 0, y: 0 })
  })
  if (canMove) {
    return preMap.concat(shapeSets.map((tile) => {
      const toPos: Pos2D = rotate({ x: originTile.x, y: originTile.y }, { x: tile.x, y: tile.y });
      return {
        ...tile,
        x: toPos.x,
        y: toPos.y,
      } as SimulationVector2D
    }))
  }
  return simulationMap;
}

export const moveShape = (simulationMap: SimulationVector2D[], mapSize: Pos2D, to: -1 | 1) => {
  const shapeSets: SimulationVector2D[] = simulationMap.filter((tile) => tile.moveable);
  const preMap: SimulationVector2D[] = simulationMap.filter((tile) => !tile.moveable);
  const canMove = shapeSets.every((tile) => {
    const toPos: Pos2D = { x: tile.x + to, y: tile.y };
    return isInCanvas(toPos, mapSize) && isEmpty({ x: tile.x, y: tile.y }, simulationMap, mapSize, tile.id, { x: to, y: 0 })
  })

  if (canMove) {
    return preMap.concat(shapeSets.map((tile) => {
      return {
        ...tile,
        x: tile.x + to,
      } as SimulationVector2D
    }))
  }
  return simulationMap;
}

export const simulation = (simulationMap: SimulationVector2D[], mapSize: Pos2D, changeSimulationMap: (newMap: SimulationVector2D[]) => void) => {
  simulationMap.sort((a, b) => a.id - b.id);
  console.log("simulation");
  for (let i = 0; i < simulationMap.length; i) {

    const nowSameIdSet: SimulationVector2D[] = [simulationMap[i]];
    const nowId = simulationMap[i].id;
    let j = i + 1;
    while (j < simulationMap.length && simulationMap[j].id === nowId && simulationMap[j].id !== -1) {
      nowSameIdSet.push(simulationMap[j]);
      j += 1;
    }
    const canFall = nowSameIdSet.every((pos) =>
      isEmpty(pos, simulationMap, mapSize, nowId)
    )
    i = j;

    if (canFall) {
      fall(nowId, nowSameIdSet, mapSize.y);
    } else {
      fixTile(nowId, nowSameIdSet);
      checkLine(mapSize.x, mapSize.y, simulationMap, changeSimulationMap);
    }
  }
}
