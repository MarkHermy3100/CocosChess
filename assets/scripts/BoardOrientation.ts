import { _decorator, Component, Sprite, SpriteFrame, resources, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { BoardState } from './BoardState';

@ccclass('BoardOrientation')
export class BoardOrientation extends Component {
    start() {
        BoardState.boardCenter = this.node.getWorldPosition().y;
    }

    update(deltaTime: number) {
        if (!BoardState.disable) {
            if (BoardState.flipped) {
                resources.load('art/chessboardFlipped/spriteFrame', SpriteFrame, (err: any, spriteFrame) => {
                    this.getComponent(Sprite).spriteFrame = spriteFrame;
                });
            }
            else {
                resources.load('art/chessboard/spriteFrame', SpriteFrame, (err: any, spriteFrame) => {
                    this.getComponent(Sprite).spriteFrame = spriteFrame;
                });
            }
        }
    }
}
