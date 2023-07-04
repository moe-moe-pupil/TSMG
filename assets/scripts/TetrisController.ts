import { _decorator, Component, EventKeyboard, input, Input, KeyCode, Node, TiledLayer, TiledMap, Vec2, game } from 'cc';
import { SimulationVector2D } from './types';
import { defalutShapes, generateShape, moveShape, rotateShape, ShapeEnum, simulation } from './SimulationUtils';
const { ccclass, property } = _decorator;

@ccclass('TetrisController')
export class TetrisController extends Component {
    private _simulationMap: SimulationVector2D[] = []
    private _timeStamp = 0;
    private _width;
    private _height;
    private _shapeId = 0;
    private _timeStep = 0.5;
    private _move: 1 | -1 | 0 = 0;
    public timeStep = this._timeStep;
    public map: TiledMap;

    gameOver() {
        game.restart();
    }

    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    changeSimulationMap(newMap: SimulationVector2D[]) {
        this._simulationMap = newMap;
    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ARROW_DOWN:
                this.speedModify(4);
                break;
            case KeyCode.ARROW_LEFT:
                this._move = -1;
                this._simulationMap = moveShape(this._simulationMap, { x: this._width, y: this._height }, this._move as 1 | -1);
                this.sync();
                break;
            case KeyCode.ARROW_RIGHT:
                this._move = 1;
                this._simulationMap = moveShape(this._simulationMap, { x: this._width, y: this._height }, this._move as 1 | -1);
                this.sync();
                break;
            case KeyCode.ARROW_UP:
                this._simulationMap = rotateShape(this._simulationMap, { x: this._width, y: this._height });
                this.sync();
                break;
        }
    }

    onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ARROW_DOWN:
                this.speedModify(1);
                break;
            case KeyCode.ARROW_LEFT:
                this._move = 0;
                break;
            case KeyCode.ARROW_RIGHT:
                this._move = 0;
                break;
        }
    }

    speedModify(m: number) {
        this.timeStep = this._timeStep / m;
    }

    hasMoveableTile = () => {
        return this._simulationMap.find((tile) => tile.moveable);
    }

    randomShape = () => {
        const keys = Object.keys(defalutShapes);
        return keys[Math.floor(Math.random() * keys.length)]
    }

    addShape = (shape: ShapeEnum) => {
        if (!this.hasMoveableTile()) {
            generateShape(this._simulationMap, shape, { x: this._width, y: this._height }, this._shapeId, this.gameOver.bind(this));
            this._shapeId += 1;
        }
    }

    getSimulationTile(x: number, y: number) {
        return this._simulationMap.find((tile) => tile.x === x && tile.y === y);
    }

    run() {
        simulation(this._simulationMap, { x: this._width, y: this._height }, this.changeSimulationMap.bind(this));
        this.addShape(this.randomShape() as ShapeEnum);
    }

    sync() {
        for (let x = 0; x < this._width; x++) {
            for (let y = 0; y < this._height; y++) {
                const tile = this.getSimulationTile(x, y);
                const nowGid = tile ? tile.gid : 1;
                this.map.getLayers()[0].setTileGIDAt(nowGid, x, y);
                this.map.getLayers()[0].updateViewPort(x, y, this._width, this._height)
            }
        }


    }

    start() {
        this.map = this.getComponent<TiledMap>(TiledMap);
        this._width = this.map.getMapSize().width;
        this._height = this.map.getMapSize().height;
    }

    update(deltaTime: number) {
        // unit type second
        this._timeStamp += deltaTime;
        this.sync();
        while (this._timeStamp > this.timeStep) {
            this._timeStamp -= this.timeStep;
            this.run();
        }
    }
}


