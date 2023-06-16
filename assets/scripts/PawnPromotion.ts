import { _decorator, Component, Node, Vec3, input, Input, EventMouse, EventTouch } from 'cc';
const { ccclass, property } = _decorator;
import { BoardState } from './BoardState';

@ccclass('PawnPromotion')
export class PawnPromotion extends Component {
    @property
    private color: number = 0;
    private isClicked: boolean = false;
    private clickPosition: Vec3 = new Vec3();
    start() {
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchDown, this);
    }

    onMouseDown(event: EventMouse) {
        if (event.getButton() == EventMouse.BUTTON_LEFT) {
            this.clickPosition.x = event.getUILocation().x - BoardState.tileSize * 6;
            this.clickPosition.y = event.getUILocation().y - BoardState.boardCenter;
            this.clickPosition.z = 0;
            this.isClicked = true;
        }
    }

    onTouchDown(event: EventTouch) {
        if (event.getType() == "touch-start") {
            this.clickPosition.x = event.getUILocation().x - BoardState.tileSize * 6;
            this.clickPosition.y = event.getUILocation().y - BoardState.boardCenter;
            this.clickPosition.z = 0;
            this.isClicked = true;
        }
    }

    update(deltaTime: number) {
        if (BoardState.promoting.x > -1000) {
            if (this.color == BoardState.turn * -1) {
                if (!BoardState.flipped) {
                    this.node.setPosition(new Vec3(BoardState.promoting.x, BoardState.promoting.y - BoardState.tileSize / 2 * 3 * this.color, 0));
                }
                else {
                    this.node.setPosition(new Vec3(BoardState.promoting.x, BoardState.promoting.y + BoardState.tileSize / 2 * 3 * this.color, 0));
                }
            }
            else {
                this.node.getPosition(this.clickPosition);
            }
        }
        else {
            this.node.setPosition(BoardState.promoting);
        }
        if (this.isClicked) {
            if ((!BoardState.flipped && this.color == 1) || (BoardState.flipped && this.color == -1)) {
                if (Math.abs(this.clickPosition.x - BoardState.promoting.x) < BoardState.tileSize / 2 
                && Math.abs(this.clickPosition.y - BoardState.promoting.y) < BoardState.tileSize / 2) {
                    BoardState.piecePromoted = 8 * this.color;
                }
                else if (Math.abs(this.clickPosition.x - BoardState.promoting.x) < BoardState.tileSize / 2 
                && Math.abs(this.clickPosition.y - BoardState.promoting.y + BoardState.tileSize) < BoardState.tileSize / 2) {
                    BoardState.piecePromoted = 3 * this.color;
                }
                else if (Math.abs(this.clickPosition.x - BoardState.promoting.x) < BoardState.tileSize / 2 
                && Math.abs(this.clickPosition.y - BoardState.promoting.y + BoardState.tileSize * 2) < BoardState.tileSize / 2) {
                    BoardState.piecePromoted = 2 * this.color;
                }
                else if (Math.abs(this.clickPosition.x - BoardState.promoting.x) < BoardState.tileSize / 2 
                && Math.abs(this.clickPosition.y - BoardState.promoting.y + BoardState.tileSize * 3) < BoardState.tileSize / 2) {
                    BoardState.piecePromoted = 5 * this.color;
                }
            }
            else {
                if (Math.abs(this.clickPosition.x - BoardState.promoting.x) < BoardState.tileSize / 2 
                && Math.abs(this.clickPosition.y - BoardState.promoting.y - BoardState.tileSize * 3) < BoardState.tileSize / 2) {
                    BoardState.piecePromoted = 8 * this.color;
                }
                else if (Math.abs(this.clickPosition.x - BoardState.promoting.x) < BoardState.tileSize / 2 
                && Math.abs(this.clickPosition.y - BoardState.promoting.y - BoardState.tileSize * 2) < BoardState.tileSize / 2) {
                    BoardState.piecePromoted = 3 * this.color;
                }
                else if (Math.abs(this.clickPosition.x - BoardState.promoting.x) < BoardState.tileSize / 2 
                && Math.abs(this.clickPosition.y - BoardState.promoting.y - BoardState.tileSize) < BoardState.tileSize / 2) {
                    BoardState.piecePromoted = 2 * this.color;
                }
                else if (Math.abs(this.clickPosition.x - BoardState.promoting.x) < BoardState.tileSize / 2 
                && Math.abs(this.clickPosition.y - BoardState.promoting.y) < BoardState.tileSize / 2) {
                    BoardState.piecePromoted = 5 * this.color;
                }
            }
            this.isClicked = false;
        }
    }
}
