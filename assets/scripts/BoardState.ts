import { Vec3, isValid } from 'cc'
import { PieceRules } from './PieceRules';

var BoardState = {
    turn: 1,
    tileSize: 80,
    board: new Array<Array<number>>,
    whiteKing: new Array<number>,
    blackKing: new Array<number>,
    lastPosition: new Vec3(),
    topEdge: 280,
    bottomEdge: -280,
    leftEdge: -120,
    rightEdge: 440,
    boardCenter: 0,
    moves: 0,
    justMoved: false,
    flip: false,
    flipped: false,
    newGame: false,
    castlingRights: new Array<boolean>,
    justCastled: new Array<boolean>,
    enPassant: [-1, -1],
    justPassed: [-1, -1],
    promoting: new Vec3(-1000, -1000, 0),
    piecePromoted: 0,
    nextBotMove: [[-1, -1], [-1, -1]],
    gameOver: false,
    disable: true,

    initialize(): void {
        for (let i: number = 0; i < 8; i++) {
            let line: number[] = []
            for (let j: number = 0; j < 8; j++) {
                line.push(0);
            }
            this.board.push(line);
        }
        for (let i: number = 0; i < 4; i++) {
            this.castlingRights.push(true);
            this.justCastled.push(false);
        }
    },

    convertCoordinates(position: Vec3): number[] {
        return [(this.topEdge - position.y) / this.tileSize, (position.x - this.leftEdge) / this.tileSize];
    },

    convertUIPosition(coor: number[]): Vec3 {
        return new Vec3(this.leftEdge + this.tileSize * coor[1], this.topEdge - this.tileSize * coor[0], 0);
    },

    setBoard(piece: number, position: Vec3): void {
        if (position.x == 0) {
            return;
        }
        this.board[this.convertCoordinates(position)[0]][this.convertCoordinates(position)[1]] = piece;
    },

    newBoard(): void {
        this.turn = 1;
        this.board[0] = [-5,-2,-3,-8,-9,-3,-2,-5];
        this.board[1] = [-1,-1,-1,-1,-1,-1,-1,-1];
        for (let i: number = 2; i < 6; i++) {
            this.board[i] = [0,0,0,0,0,0,0,0];
        }
        this.board[6] = [ 1, 1, 1, 1, 1, 1, 1, 1];
        this.board[7] = [ 5, 2, 3, 8, 9, 3, 2, 5];
        this.whiteKing = [7, 4];
        this.blackKing = [0, 4];
        this.flipped = false;
        this.castlingRights = [true, true, true, true];
        this.justCastled = [false, false, false, false];
        this.enPassant = [-1, -1];
        this.justPassed = [-1, -1];
        this.promoting = new Vec3(-1000, -1000, 0);
        this.piecePromoted = 0;
        this.moves = 0;
        this.gameOver = false;
        this.nextBotMove = [[-1, -1], [-1, -1]];
    },

    newFlippedBoard(): void {
        this.turn = 1;
        this.board[7] = [-5,-2,-3,-9,-8,-3,-2,-5];
        this.board[6] = [-1,-1,-1,-1,-1,-1,-1,-1];
        for (let i: number = 2; i < 6; i++) {
            this.board[i] = [0,0,0,0,0,0,0,0];
        }
        this.board[1] = [ 1, 1, 1, 1, 1, 1, 1, 1];
        this.board[0] = [ 5, 2, 3, 9, 8, 3, 2, 5];
        this.whiteKing = [0, 3];
        this.blackKing = [7, 3];
        this.flipped = true;
        this.castlingRights = [true, true, true, true];
        this.justCastled = [false, false, false, false];
        this.enPassant = [-1, -1];
        this.justPassed = [-1, -1];
        this.promoting = new Vec3(-1000, -1000, 0);
        this.piecePromoted = 0;
        this.moves = 0;
        this.gameOver = false;
        this.nextBotMove = [[-1, -1], [-1, -1]];
    },

    flipBoard(): void {
        for (let i: number = 0; i < 4; i++) {
            [this.board[i], this.board[7 - i]] = [this.board[7 - i], this.board[i]];
            this.board[i].reverse();
            this.board[7 - i].reverse();
        }
        this.whiteKing[0] = 7 - this.whiteKing[0];
        this.whiteKing[1] = 7 - this.whiteKing[1];
        this.blackKing[0] = 7 - this.blackKing[0];
        this.blackKing[1] = 7 - this.blackKing[1];
        if (this.enPassant[0] > -1) {
            this.enPassant[0] = 7 - this.enPassant[0];
            this.enPassant[1] = 7 - this.enPassant[1];
        }
    },

    isValidMove(piece: number, position: Vec3, aftPosition: Vec3): boolean {
        if (aftPosition.x < this.leftEdge || aftPosition.x > this.rightEdge) {
            return false;
        }
        if (aftPosition.y < this.bottomEdge || aftPosition.y > this.topEdge) {
            return false;
        }
        if (position.x == aftPosition.x && position.y == aftPosition.y) {
            return false;
        }
        if (this.turn * piece < 0) {
            return false;
        }
        if (this.board[this.convertCoordinates(aftPosition)[0]][this.convertCoordinates(aftPosition)[1]] * piece > 0) {
            return false;
        }
        switch (Math.abs(piece)) {
            case 9:
                if (!PieceRules.isReachableByKing(this.board, this.convertCoordinates(position), 
                this.convertCoordinates(aftPosition), this.castlingRights, this.flipped)) {
                    return false;
                }
                break;
            case 8:
                if (!PieceRules.isReachableByQueen(this.board, this.convertCoordinates(position), 
                this.convertCoordinates(aftPosition))) {
                    return false;
                }
                break;
            case 5:
                if (!PieceRules.isReachableByRook(this.board, this.convertCoordinates(position), 
                this.convertCoordinates(aftPosition))) {
                    return false;
                }
                break;
            case 3:
                if (!PieceRules.isReachableByBishop(this.board, this.convertCoordinates(position), 
                this.convertCoordinates(aftPosition))) {
                    return false;
                }
                break;
            case 2:
                if (!PieceRules.isReachableByKnight(this.convertCoordinates(position), this.convertCoordinates(aftPosition))) {
                    return false;
                }
                break;
            case 1:
                if (!PieceRules.isReachableByPawn(this.board, this.convertCoordinates(position), 
                this.convertCoordinates(aftPosition), this.flipped)) {
                    if (!this.flipped) {
                        if (Math.abs(this.convertCoordinates(position)[1] - this.convertCoordinates(aftPosition)[1]) != 1) {
                            return false;
                        }
                        if (this.convertCoordinates(position)[0] - piece != this.convertCoordinates(aftPosition)[0]) {
                            return false;
                        }
                        if (this.convertCoordinates(aftPosition)[0] + piece != this.enPassant[0] || 
                        this.convertCoordinates(aftPosition)[1] != this.enPassant[1]) {
                            return false;
                        }
                    }
                    else {
                        if (Math.abs(this.convertCoordinates(position)[1] - this.convertCoordinates(aftPosition)[1]) != 1) {
                            return false;
                        }
                        if (this.convertCoordinates(position)[0] + piece != this.convertCoordinates(aftPosition)[0]) {
                            return false;
                        }
                        if (this.convertCoordinates(aftPosition)[0] - piece != this.enPassant[0] || 
                        this.convertCoordinates(aftPosition)[1] != this.enPassant[1]) {
                            return false;
                        }
                    }
                    this.board[this.enPassant[0]][this.enPassant[1]] = 0;
                    if (piece > 0) {
                        if (!PieceRules.isKingSafe(PieceRules.pseudoBoard(this.board, this.convertCoordinates(position), 
                        this.convertCoordinates(aftPosition)), this.whiteKing, this.flipped)) {
                            this.board[this.enPassant[0]][this.enPassant[1]] = -piece;
                            return false;
                        }
                    }
                    else {
                        if (!PieceRules.isKingSafe(PieceRules.pseudoBoard(this.board, this.convertCoordinates(position), 
                        this.convertCoordinates(aftPosition)), this.blackKing, this.flipped)) {
                            this.board[this.enPassant[0]][this.enPassant[1]] = -piece;
                            return false;
                        }
                    }
                    this.board[this.enPassant[0]][this.enPassant[1]] = -piece;
                }
                break;
            default:
                return false;
        }
        if (piece > 0) {
            if (piece < 9) {
                if (!PieceRules.isKingSafe(PieceRules.pseudoBoard(this.board, this.convertCoordinates(position), 
                this.convertCoordinates(aftPosition)), this.whiteKing, this.flipped)) {
                    return false;
                }
            }
            else {
                if (!PieceRules.isKingSafe(PieceRules.pseudoBoard(this.board, this.convertCoordinates(position), 
                this.convertCoordinates(aftPosition)), this.convertCoordinates(aftPosition), this.flipped)) {
                    return false;
                }
            }
        }
        else {
            if (piece > -9) {
                if (!PieceRules.isKingSafe(PieceRules.pseudoBoard(this.board, this.convertCoordinates(position), 
                this.convertCoordinates(aftPosition)), this.blackKing, this.flipped)) {
                    return false;
                }
            }
            else {
                if (!PieceRules.isKingSafe(PieceRules.pseudoBoard(this.board, this.convertCoordinates(position), 
                this.convertCoordinates(aftPosition)), this.convertCoordinates(aftPosition), this.flipped)) {
                    return false;
                }
            }
        }
        return true;
    },

    isCheckmate(position: number[]): boolean {
        for (let i: number = 0; i < 8; i++) {
            for (let j: number = 0; j < 8; j++) {
                if (this.board[i][j] * this.board[position[0]][position[1]] > 0) {
                    for (let aft_i: number = 0; aft_i < 8; aft_i++) {
                        for (let aft_j: number = 0; aft_j < 8; aft_j++) {
                            if (Math.abs(this.board[i][j]) < 9 && this.isValidMove(this.board[i][j], 
                                this.convertUIPosition([i, j]), this.convertUIPosition([aft_i, aft_j]))
                                && PieceRules.isKingSafe(PieceRules.pseudoBoard(this.board, [i, j], [aft_i, aft_j]), position, this.flipped)) {
                                return false;
                            }
                            if (Math.abs(this.board[i][j]) == 9 && this.isValidMove(this.board[i][j], 
                                this.convertUIPosition([i, j]), this.convertUIPosition([aft_i, aft_j]))
                                && PieceRules.isKingSafe(PieceRules.pseudoBoard(this.board, [i, j], [aft_i, aft_j]), [aft_i, aft_j], this.flipped)) {
                                return false;
                            }
                        }
                    }
                }
            }
        }
        this.gameOver = true;
        return !PieceRules.isKingSafe(this.board, position, this.flipped);
    },

    isStalemate(position: number[]): boolean {
        for (let i: number = 0; i < 8; i++) {
            for (let j: number = 0; j < 8; j++) {
                if (this.board[i][j] * this.board[position[0]][position[1]] > 0) {
                    for (let aft_i: number = 0; aft_i < 8; aft_i++) {
                        for (let aft_j: number = 0; aft_j < 8; aft_j++) {
                            if (Math.abs(this.board[i][j]) < 9 && this.isValidMove(this.board[i][j], 
                                this.convertUIPosition([i, j]), this.convertUIPosition([aft_i, aft_j]))
                                && PieceRules.isKingSafe(PieceRules.pseudoBoard(this.board, [i, j], [aft_i, aft_j]), position, this.flipped)) {
                                return false;
                            }
                            if (Math.abs(this.board[i][j]) == 9 && this.isValidMove(this.board[i][j], 
                                this.convertUIPosition([i, j]), this.convertUIPosition([aft_i, aft_j]))
                                && PieceRules.isKingSafe(PieceRules.pseudoBoard(this.board, [i, j], [aft_i, aft_j]), [aft_i, aft_j], this.flipped)) {
                                return false;
                            }
                        }
                    }
                }
            }
        }
        this.gameOver = true;
        return PieceRules.isKingSafe(this.board, position, this.flipped);
    },

    isInsufficient() {
        let remains: number[] = [];
        for (let i: number = 0; i < 8; i++) {
            for (let j: number = 0; j < 8; j++) {
                let piece = this.board[i][j];
                if (Math.abs(piece) == 1 || Math.abs(piece) == 5 || Math.abs(piece) == 8) {
                    return false;
                }
                if (piece != 0 && Math.abs(piece) != 9) {
                    remains.push(piece);
                }
            }
        }
        if (remains.length > 2) {
            return false;
        }
        if (remains.length == 2) {
            if (remains[0] * remains[1] > 4) {
                return false;
            }
        }
        this.gameOver = true;
        return true;
    },

    print(): void {
        for (let i: number = 0; i < 8; i++) {
            console.log(this.board[i]);
        }
        console.log("\n");
    }
};

BoardState.initialize();
export { BoardState };
