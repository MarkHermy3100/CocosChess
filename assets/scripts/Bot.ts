import { _decorator, Component, Node, Vec3, Sprite, SpriteFrame, UITransform, resources } from 'cc';
const { ccclass, property } = _decorator;
import { BoardState } from './BoardState';

@ccclass('Bot')
export class Bot extends Component {
    @property
    private color: number = 0;

    onLoad() {
        if (this.color == 1) {
            BoardState.flipped = true;
        }
    }

    chooseMove(): void {
        let moves: number[][] = [];
        let aftMoves: number[][] = [];
        for (let i: number = 0; i < 8; i++) {
            for (let j: number = 0; j < 8; j++) {
                if (BoardState.board[i][j] * BoardState.turn > 0) {
                    for (let aft_i: number = 0; aft_i < 8; aft_i++) {
                        for (let aft_j: number = 0; aft_j < 8; aft_j++) {
                            if (BoardState.isValidMove(BoardState.board[i][j], 
                                BoardState.convertUIPosition([i, j]), BoardState.convertUIPosition([aft_i, aft_j]))) {
                                moves.push([i, j]);
                                aftMoves.push([aft_i, aft_j]);
                            }
                        }
                    }
                }
            }
        }
        if (moves.length == 0) {
            return;
        }
        let roll = Math.floor(Math.random() * moves.length);
        BoardState.nextBotMove[0] = moves[roll];
        BoardState.nextBotMove[1] = aftMoves[roll];
    }

    update (deltaTime: number) {
        if (BoardState.gameOver) {
            return;
        }
        if (BoardState.turn == this.color && BoardState.promoting.x == -1000) {
            if (BoardState.nextBotMove[0][0] == -1) {
                this.chooseMove();
                if (BoardState.nextBotMove[0][0] == -1) {
                    BoardState.gameOver = true;
                    return;
                }
                this.schedule(function() {
                    BoardState.turn *= -1;
                    BoardState.moves += 1;
                    BoardState.justMoved = true;
                }, 0, 0, 4);
            }
                   
        }
    }
}
