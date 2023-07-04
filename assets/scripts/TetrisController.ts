import { _decorator, Component, Node, TiledLayer, TiledMap, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TetrisController')
export class TetrisController extends Component {
    private _tilesMap: { x: number, y: number, id: number }[] = []
    private _timeStamp = 0;
    public map: TiledMap;

    falling() {
        this.
    }

    run() {

    }

    start() {
        this.map = this.getComponent<TiledMap>(TiledMap);
        this.map._layers[0].setTileGIDAt(2, 0, 0);
    }

    update(deltaTime: number) {
        // unit type second
        this._timeStamp += deltaTime;
        console.log(deltaTime);
        while(this._timeStamp > 1) {
            this._timeStamp -= 1;
            this.run();
        }
    }
}


