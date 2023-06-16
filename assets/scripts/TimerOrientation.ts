import { _decorator, Button, Component, Label, Sprite, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { BoardState } from './BoardState';

@ccclass('TimerOrientation')
export class TimerOrientation extends Component {
    @property
    private color: number = 0;
    private timerPosition: Vec3 = new Vec3();

    onLoad() {
        this.node.getPosition(this.timerPosition);
    }

    start() {

    }

    update(deltaTime: number) {
        if (BoardState.flipped) {
            this.node.setPosition(this.timerPosition.x, this.timerPosition.y + BoardState.tileSize * 6 * this.color, 0);
        }
        else {
            this.node.setPosition(this.timerPosition);
        }
        if ((BoardState.turn == this.color && BoardState.promoting.x == -1000) 
        || (BoardState.turn == -this.color && BoardState.promoting.x > -1000)) {
            this.getComponent(Sprite).spriteFrame = this.getComponent(Button).disabledSprite;
        }
        else {
            this.getComponent(Sprite).spriteFrame = this.getComponent(Button).pressedSprite;
        }
    }
}
