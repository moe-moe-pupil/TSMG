import { _decorator, Component, Node, TiledLayer, TiledMap, Vec2 } from 'cc';
import { SimulationVector2D } from './types';
import { simulation } from './SimulationUtils';
const { ccclass, property } = _decorator;

@ccclass('TetrisController')
export class TetrisController extends Component {
    private _simulationMap: SimulationVector2D[] = []
    private _timeStamp = 0;
    private _width;
    private _height;
    public static TIMESTAMP = 0.5;
    public map: TiledMap;

    addShape = () => {

    }

    getSimulationTile(x: number, y: number) {
        return this._simulationMap.find((tile) => tile.x === x && tile.y === y);
    }

    run() {
        simulation(this._simulationMap, { x: this._width, y: this._height });
        this.sync();
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
        this.map._layers[0].setTileGIDAt(2, 0, 0);
        this._simulationMap.push({
            id: 1,
            moveable: true,
            gid: 2,
            x: 0,
            y: 0
        });
    }

    update(deltaTime: number) {
        // unit type second
        this._timeStamp += deltaTime;
        while (this._timeStamp > TetrisController.TIMESTAMP) {
            this._timeStamp -= TetrisController.TIMESTAMP;
            this.run();
        }
    }
}


