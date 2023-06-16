import { _decorator, Component, Node, Label, CCInteger, color} from 'cc';
const { ccclass, property } = _decorator;
import { BoardState } from './BoardState';

@ccclass('TimerController')
export class TimerController extends Component {
    @property(Label)
    private timer: Label = null;
    @property(CCInteger)
    private timeInSeconds: number = 0;
    @property
    private color = 0;

    start() {
        this.startCountDown();
    }

    convertToMinutes(seconds: number): string {
        if ((seconds % 60) > 9) {
            return Math.floor(seconds / 60).toString() + ":" + (seconds % 60).toString();
        }
        return Math.floor(seconds / 60).toString() + ":0" + (seconds % 60).toString();
    }

    startCountDown() {
        this.timer.string = this.convertToMinutes(this.timeInSeconds);

        let callback = function() {
            if (BoardState.turn == this.color && BoardState.promoting.x == -1000 && BoardState.moves > 1 
                && !BoardState.gameOver && this.timeInSeconds > 0) {
                this.timeInSeconds--;
            }
            else if (BoardState.turn == -this.color && BoardState.promoting.x > -1000 && BoardState.moves > 1 
                && !BoardState.gameOver && this.timeInSeconds > 0) {
                this.timeInSeconds--;
            }
            this.timer.string = this.convertToMinutes(this.timeInSeconds);
            if (this.timeInSeconds == 0) {
                BoardState.gameOver = true;
            }
        }

        this.schedule(callback, 1);
    }

    update(deltaTime: number) {
        if (BoardState.moves == 0) {
            this.timeInSeconds = 600;
        }
    }
}
