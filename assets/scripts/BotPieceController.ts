import { _decorator, Component, Node, Vec3, Sprite, SpriteFrame, UITransform, resources } from 'cc';
const { ccclass, property } = _decorator;
import { BoardState } from './BoardState';

@ccclass('Bot')
export class Bot extends Component {
    @property
    private pieceName: number = 0;
    private prePieceName: number = 0;
    private piecePosition: Vec3 = new Vec3();
    private zerothPosition: Vec3 = new Vec3();
    @property
    private lastPiece: boolean = false;

    onLoad() {
        this.node.getPosition(this.zerothPosition);
        BoardState.setBoard(this.pieceName, this.zerothPosition);
        if (this.pieceName == 9) {
            BoardState.whiteKing.push(BoardState.convertCoordinates(this.zerothPosition)[0]);
            BoardState.whiteKing.push(BoardState.convertCoordinates(this.zerothPosition)[1]);
        }
        else if (this.pieceName == -9) {
            BoardState.blackKing.push(BoardState.convertCoordinates(this.zerothPosition)[0]);
            BoardState.blackKing.push(BoardState.convertCoordinates(this.zerothPosition)[1]);
        }
        if (this.lastPiece) {
            BoardState.lastPosition.x = this.zerothPosition.x
            BoardState.lastPosition.y = this.zerothPosition.y;
        }
    }

    start() {

    }

    update(deltaTime: number) {
        this.node.getPosition(this.piecePosition);
        if (BoardState.newGame) {
            if (this.prePieceName == 1) {
                resources.load('art/whitepawn/spriteFrame', SpriteFrame, (err: any, spriteFrame) => {
                    this.getComponent(Sprite).spriteFrame = spriteFrame;
                });
                this.getComponent(UITransform).width = 44;
                this.getComponent(UITransform).height = 56;
                this.pieceName = 1;
            }
            else if (this.prePieceName == -1) {
                resources.load('art/blackpawn/spriteFrame', SpriteFrame, (err: any, spriteFrame) => {
                    this.getComponent(Sprite).spriteFrame = spriteFrame;
                });
                this.getComponent(UITransform).width = 44;
                this.getComponent(UITransform).height = 56;
                this.pieceName = -1;
            }
            this.prePieceName = 0;
            this.node.setPosition(this.zerothPosition);
            if (this.piecePosition.x == BoardState.lastPosition.x && this.piecePosition.y == BoardState.lastPosition.y) {
                BoardState.newGame = false;
            }
            this.node.getPosition(this.piecePosition);
        }
        if (this.piecePosition.x == -1000) {
            return;
        }
        if (BoardState.promoting.x > -1000) {
            return;
        }
        if (this.lastPiece) {
            this.node.getPosition(BoardState.lastPosition);
        }
        if (BoardState.board[BoardState.convertCoordinates(this.piecePosition)[0]]
        [BoardState.convertCoordinates(this.piecePosition)[1]] != this.pieceName 
        && BoardState.board[BoardState.convertCoordinates(this.piecePosition)[0]]
        [BoardState.convertCoordinates(this.piecePosition)[1]] != 0) {
            this.node.setPosition(-1000, -1000, 0);
        }
        if (this.pieceName == 5) {
            if (BoardState.justCastled[0] && this.piecePosition.x == BoardState.leftEdge) {
                this.node.setPosition(BoardState.leftEdge + BoardState.tileSize * 2, BoardState.topEdge, 0);
                BoardState.setBoard(0, new Vec3(BoardState.leftEdge, BoardState.topEdge, 0));
                BoardState.setBoard(5, new Vec3(BoardState.leftEdge + BoardState.tileSize * 2, BoardState.topEdge, 0));
            }
            if (BoardState.justCastled[2] && this.piecePosition.x == BoardState.rightEdge) {
                this.node.setPosition(BoardState.rightEdge - BoardState.tileSize * 3, BoardState.topEdge, 0);
                BoardState.setBoard(0, new Vec3(BoardState.rightEdge, BoardState.topEdge, 0));
                BoardState.setBoard(-5, new Vec3(BoardState.rightEdge - BoardState.tileSize * 3, BoardState.topEdge, 0));
            }
        }
        else if (this.pieceName == -5) {
            if (BoardState.justCastled[1] && this.piecePosition.x == BoardState.rightEdge) {
                this.node.setPosition(BoardState.rightEdge - BoardState.tileSize * 2, BoardState.topEdge, 0);
                BoardState.setBoard(0, new Vec3(BoardState.rightEdge, BoardState.topEdge, 0));
                BoardState.setBoard(-5, new Vec3(BoardState.rightEdge - BoardState.tileSize * 2, BoardState.topEdge, 0));
            }
            if (BoardState.justCastled[3] && this.piecePosition.x == BoardState.leftEdge) {
                this.node.setPosition(BoardState.leftEdge + BoardState.tileSize * 3, BoardState.topEdge, 0);
                BoardState.setBoard(0, new Vec3(BoardState.leftEdge, BoardState.topEdge, 0));
                BoardState.setBoard(-5, new Vec3(BoardState.leftEdge + BoardState.tileSize * 3, BoardState.topEdge, 0));
            }
        }
        if (Math.abs(this.pieceName) == 1) {
            if (BoardState.convertCoordinates(this.piecePosition)[0] == BoardState.justPassed[0] 
            && BoardState.convertCoordinates(this.piecePosition)[1] == BoardState.justPassed[1]) {
                BoardState.setBoard(0, this.piecePosition);
                this.node.setPosition(-1000, -1000, 0);
                BoardState.justPassed = [-1, -1];
                return;
            }
        }
        if (BoardState.turn == -Math.sign(this.pieceName) && BoardState.nextBotMove[0][0] > -1) {
            if (BoardState.convertCoordinates(this.piecePosition)[0] == BoardState.nextBotMove[0][0]
            && BoardState.convertCoordinates(this.piecePosition)[1] == BoardState.nextBotMove[0][1]) {
                BoardState.setBoard(0, this.piecePosition);
                BoardState.setBoard(this.pieceName, BoardState.convertUIPosition(BoardState.nextBotMove[1]));
                if (this.pieceName == 9) {
                    BoardState.castlingRights[0] = false;
                    BoardState.castlingRights[2] = false;
                    BoardState.whiteKing[0] = BoardState.nextBotMove[1][0];
                    BoardState.whiteKing[1] = BoardState.nextBotMove[1][1];
                    if (BoardState.nextBotMove[1][1] - BoardState.nextBotMove[0][1] == 2) {
                        BoardState.justCastled[2] = true;
                    }
                    if (BoardState.nextBotMove[0][1] - BoardState.nextBotMove[1][1] == 2) {
                        BoardState.justCastled[0] = true;
                    }
                }
                else if (this.pieceName == -9) {
                    BoardState.castlingRights[1] = false;
                    BoardState.castlingRights[3] = false;
                    BoardState.blackKing[0] = BoardState.nextBotMove[1][0];
                    BoardState.blackKing[1] = BoardState.nextBotMove[1][1];
                    if (BoardState.nextBotMove[1][1] - BoardState.nextBotMove[0][1] == 2) {
                        BoardState.justCastled[1] = true;
                    }
                    if (BoardState.nextBotMove[0][1] - BoardState.nextBotMove[1][1] == 2) {
                        BoardState.justCastled[3] = true;
                    }
                }
                if (this.pieceName == 5) {
                    if (BoardState.nextBotMove[0][0] == 0 && BoardState.nextBotMove[0][1] == 7) {
                        BoardState.castlingRights[2] = false;
                    }
                    if (BoardState.nextBotMove[0][0] == 0 && BoardState.nextBotMove[0][1] == 0) {
                        BoardState.castlingRights[0] = false;
                    }
                }
                else if (this.pieceName == -5) {
                    if (BoardState.nextBotMove[0][0] == 0 && BoardState.nextBotMove[0][1] == 7) {
                        BoardState.castlingRights[1] = false;
                    }
                    if (BoardState.nextBotMove[0][0] == 0 && BoardState.nextBotMove[0][1] == 0) {
                        BoardState.castlingRights[3] = false;
                    }
                }
                if (this.pieceName == 1) {
                    if (BoardState.nextBotMove[1][0] - BoardState.nextBotMove[0][0] == 2) {
                        BoardState.enPassant = BoardState.nextBotMove[1];
                    }
                    else {
                        if (BoardState.nextBotMove[1][0] - 1 == BoardState.enPassant[0] 
                        && BoardState.nextBotMove[1][1] == BoardState.enPassant[1]) {
                            BoardState.justPassed[0] = BoardState.enPassant[0];
                            BoardState.justPassed[1] = BoardState.enPassant[1];
                        }
                        BoardState.enPassant = [-1, -1];
                    }
                    if (BoardState.nextBotMove[1][0] == 0) {
                        let pieceBag: number[] = [8, 5, 3, 2];
                        BoardState.piecePromoted = pieceBag[Math.floor(Math.random() * 4)];
                        if (BoardState.piecePromoted == 8) {
                            resources.load('art/whitequeen/spriteFrame', SpriteFrame, (err: any, spriteFrame) => {
                                this.getComponent(Sprite).spriteFrame = spriteFrame;
                            });
                            this.getComponent(UITransform).width = 65;
                            this.getComponent(UITransform).height = 65;
                        }
                        else if (BoardState.piecePromoted == 5) {
                            resources.load('art/whiterook/spriteFrame', SpriteFrame, (err: any, spriteFrame) => {
                                this.getComponent(Sprite).spriteFrame = spriteFrame;
                            });
                            this.getComponent(UITransform).width = 48;
                            this.getComponent(UITransform).height = 61;
                        }
                        else if (BoardState.piecePromoted == 3) {
                            resources.load('art/whitebishop/spriteFrame', SpriteFrame, (err: any, spriteFrame) => {
                                this.getComponent(Sprite).spriteFrame = spriteFrame;
                            });
                            this.getComponent(UITransform).width = 49;
                            this.getComponent(UITransform).height = 67;
                        }
                        else if (BoardState.piecePromoted == 2) {
                            resources.load('art/whiteknight/spriteFrame', SpriteFrame, (err: any, spriteFrame) => {
                                this.getComponent(Sprite).spriteFrame = spriteFrame;
                            });
                            this.getComponent(UITransform).width = 56;
                            this.getComponent(UITransform).height = 65;
                        }
                        this.prePieceName = this.pieceName;
                        this.pieceName = BoardState.piecePromoted;
                        BoardState.setBoard(this.pieceName, BoardState.convertUIPosition(BoardState.nextBotMove[1]));
                        BoardState.piecePromoted = 0;
                    }
                    else {
                        BoardState.promoting.x = -1000;
                        BoardState.promoting.y = -1000;
                    }
                }
                else if (this.pieceName == -1) {
                    if (BoardState.nextBotMove[1][0] - BoardState.nextBotMove[0][0] == 2) {
                        BoardState.enPassant = BoardState.nextBotMove[1];
                    }
                    else {
                        if (BoardState.nextBotMove[1][0] - 1 == BoardState.enPassant[0] 
                        && BoardState.nextBotMove[1][1] == BoardState.enPassant[1]) {
                            BoardState.justPassed[0] = BoardState.enPassant[0];
                            BoardState.justPassed[1] = BoardState.enPassant[1];
                        }
                        BoardState.enPassant = [-1, -1];
                    }
                    if (BoardState.nextBotMove[1][0] == 7) {
                        let pieceBag: number[] = [-8, -5, -3, -2];
                        BoardState.piecePromoted = pieceBag[Math.floor(Math.random() * 4)];
                        if (BoardState.piecePromoted == -8) {
                            resources.load('art/blackqueen/spriteFrame', SpriteFrame, (err: any, spriteFrame) => {
                                this.getComponent(Sprite).spriteFrame = spriteFrame;
                            });
                            this.getComponent(UITransform).width = 65;
                            this.getComponent(UITransform).height = 65;
                        }
                        else if (BoardState.piecePromoted == -5) {
                            resources.load('art/blackrook/spriteFrame', SpriteFrame, (err: any, spriteFrame) => {
                                this.getComponent(Sprite).spriteFrame = spriteFrame;
                            });
                            this.getComponent(UITransform).width = 48;
                            this.getComponent(UITransform).height = 61;
                        }
                        else if (BoardState.piecePromoted == -3) {
                            resources.load('art/blackbishop/spriteFrame', SpriteFrame, (err: any, spriteFrame) => {
                                this.getComponent(Sprite).spriteFrame = spriteFrame;
                            });
                            this.getComponent(UITransform).width = 49;
                            this.getComponent(UITransform).height = 67;
                        }
                        else if (BoardState.piecePromoted == -2) {
                            resources.load('art/blackknight/spriteFrame', SpriteFrame, (err: any, spriteFrame) => {
                                this.getComponent(Sprite).spriteFrame = spriteFrame;
                            });
                            this.getComponent(UITransform).width = 56;
                            this.getComponent(UITransform).height = 65;
                        }
                        this.prePieceName = this.pieceName;
                        this.pieceName = BoardState.piecePromoted;
                        BoardState.setBoard(this.pieceName, BoardState.convertUIPosition(BoardState.nextBotMove[1]));
                        BoardState.piecePromoted = 0;
                    }
                    else {
                        BoardState.promoting.x = -1000;
                        BoardState.promoting.y = -1000;
                    }
                }
                else {
                    BoardState.enPassant = [-1, -1];
                    BoardState.promoting.x = -1000;
                    BoardState.promoting.y = -1000;
                }
                this.node.setPosition(BoardState.convertUIPosition(BoardState.nextBotMove[1]));
                BoardState.nextBotMove = [[-1, -1], [-1, -1]];
            }
        }
    }
}
