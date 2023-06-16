import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;
import { BoardState } from './BoardState';

@ccclass('opponentRedirect')
export class opponentRedirect extends Component {
    start() {

    }

    vsBot() {
        director.loadScene("Color");
    }

    vsPlayer() {
        BoardState.disable = false;
        director.loadScene("PvP");
    }

    vsBlackBot() {
        BoardState.disable = false;
        director.loadScene("PvBB");
    }

    vsWhiteBot() {
        BoardState.disable = false;
        director.loadScene("PvWB");
    }

    menu() {
        BoardState.disable = true;
        director.loadScene("Menu");
    }

    update(deltaTime: number) {
        
    }
}


