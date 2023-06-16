import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { BoardState } from './BoardState';

@ccclass('BoardSetup')
export class BoardSetup extends Component {
    start() {

    }

    startGame() {
        BoardState.newGame = true;
        BoardState.newBoard();
    }

    startFlippedGame() {
        BoardState.newGame = true;
        BoardState.newFlippedBoard();
    }

    flipBoard() {
        if (BoardState.promoting.x == -1000) {
            BoardState.flip = true;
            BoardState.flipBoard();
        }
    }

    update(deltaTime: number) {

    }
}
