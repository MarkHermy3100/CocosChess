var PieceRules = {
    pseudoBoard(board: number[][], position: number[], aftPosition: number[]): number[][] {
        let psBoard: number[][] = [];
        for (let i = 0; i < board.length; i++) {
            let line = [];
            for (let j = 0; j < board[i].length; j++) {
                line.push(board[i][j]);
            }
            psBoard.push(line);
        }
        psBoard[aftPosition[0]][aftPosition[1]] = psBoard[position[0]][position[1]];
        psBoard[position[0]][position[1]] = 0
        return psBoard;
    },
    isKingSafe(board: number[][], position: number[], flipped: boolean): boolean {
        let color: number = Math.sign(board[position[0]][position[1]]);
        for (let row: number = 0; row < 8; row++) {
            for (let col: number = 0; col < 8; col++) {
                if (board[row][col] == -9 * color) {
                    if (this.isReachableByKing(board, [row, col], position, [false, false, false, false], flipped)) {
                        return false;
                    }
                }
                else if (board[row][col] == -8 * color) {
                    if (this.isReachableByQueen(board, [row, col], position)) {
                        return false;
                    }
                }
                else if (board[row][col] == -5 * color) {
                    if (this.isReachableByRook(board, [row, col], position)) {
                        return false;
                    }
                }
                else if (board[row][col] == -3 * color) {
                    if (this.isReachableByBishop(board, [row, col], position)) {
                        return false;
                    }
                }
                else if (board[row][col] == -2 * color) {
                    if (this.isReachableByKnight([row, col], position)) {
                        return false;
                    }
                }
                else if (board[row][col] == -1 * color) {
                    if (this.isReachableByPawn(board, [row, col], position, flipped)) {
                        if (Math.abs(col - position[1]) == 1) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    },
    isReachableByKing(board: number[][], position: number[], aftPosition: number[], castlingRights: boolean[], flipped: boolean): boolean {
        if (Math.abs(position[0] - aftPosition[0]) > 1) {
            return false;
        }
        if (Math.abs(position[1] - aftPosition[1]) > 2) {
            return false;
        }
        if (Math.abs(position[1] - aftPosition[1]) == 2) {
            if (position[0] != aftPosition[0])
                return false;
            if (!flipped) {
                if (board[position[0]][position[1]] > 0) {
                    if (!castlingRights[0] && !castlingRights[2]) {
                        return false;
                    }
                    if (!this.isKingSafe(board, [7, 4], flipped)) {
                        return false;
                    }
                    if (position[1] < aftPosition[1]) {
                        if (!castlingRights[0]) {
                            return false;
                        }
                        if (board[7][7] != 5) {
                            return false;
                        }
                        if (board[7][5] != 0 || board[7][6] != 0) {
                            return false;
                        }
                        if (!this.isKingSafe(this.pseudoBoard(board, [7, 4], [7, 5]), [7, 5], flipped)) {
                            return false;
                        }
                    }   
                    else {
                        if (!castlingRights[2]) {
                            return false;
                        }
                        if (board[7][0] != 5) {
                            return false;
                        }
                        if (board[7][1] != 0 || board[7][2] != 0 || board[7][3] != 0) {
                            return false;
                        }
                        if (!this.isKingSafe(this.pseudoBoard(board, [7, 4], [7, 3]), [7, 3], flipped)) {
                            return false;
                        }
                    }
                }
                else {
                    if (!castlingRights[1] && !castlingRights[3]) {
                        return false;
                    }
                    if (!this.isKingSafe(board, [0, 4], flipped)) {
                        return false;
                    }
                    if (position[1] < aftPosition[1]) {
                        if (!castlingRights[1]) {
                            return false;
                        }
                        if (board[0][7] != -5) {
                            return false;
                        }
                        if (board[0][5] != 0 || board[0][6] != 0) {
                            return false;
                        }
                        if (!this.isKingSafe(this.pseudoBoard(board, [0, 4], [0, 5]), [0, 5], flipped)) {
                            return false;
                        }
                    }   
                    else {
                        if (!castlingRights[3]) {
                            return false;
                        }
                        if (board[0][0] != -5) {
                            return false;
                        }
                        if (board[0][1] != 0 || board[0][2] != 0 || board[0][3] != 0) {
                            return false;
                        }
                        if (!this.isKingSafe(this.pseudoBoard(board, [0, 4], [0, 3]), [0, 3], flipped)) {
                            return false;
                        }
                    }
                }
            }
            else {
                if (board[position[0]][position[1]] > 0) {
                    if (!castlingRights[0] && !castlingRights[2]) {
                        return false;
                    }
                    if (!this.isKingSafe(board, [0, 3], flipped)) {
                        return false;
                    }
                    if (position[1] > aftPosition[1]) {
                        if (!castlingRights[0]) {
                            return false;
                        }
                        if (board[0][0] != 5) {
                            return false;
                        }
                        if (board[0][2] != 0 || board[0][1] != 0) {
                            return false;
                        }
                        if (!this.isKingSafe(this.pseudoBoard(board, [0, 3], [0, 2]), [0, 2], flipped)) {
                            return false;
                        }
                    }   
                    else {
                        if (!castlingRights[2]) {
                            return false;
                        }
                        if (board[0][7] != 5) {
                            return false;
                        }
                        if (board[0][4] != 0 || board[0][5] != 0 || board[0][6] != 0) {
                            return false;
                        }
                        if (!this.isKingSafe(this.pseudoBoard(board, [0, 3], [0, 4]), [0, 4], flipped)) {
                            return false;
                        }
                    }
                }
                else {
                    if (!castlingRights[1] && !castlingRights[3]) {
                        return false;
                    }
                    if (!this.isKingSafe(board, [7, 3], flipped)) {
                        return false;
                    }
                    if (position[1] > aftPosition[1]) {
                        if (!castlingRights[1]) {
                            return false;
                        }
                        if (board[7][0] != -5) {
                            return false;
                        }
                        if (board[7][2] != 0 || board[7][1] != 0) {
                            return false;
                        }
                        if (!this.isKingSafe(this.pseudoBoard(board, [7, 3], [7, 2]), [7, 2], flipped)) {
                            return false;
                        }
                    }   
                    else {
                        if (!castlingRights[3]) {
                            return false;
                        }
                        if (board[7][7] != -5) {
                            return false;
                        }
                        if (board[7][4] != 0 || board[7][5] != 0 || board[7][6] != 0) {
                            return false;
                        }
                        if (!this.isKingSafe(this.pseudoBoard(board, [7, 3], [7, 4]), [7, 4], flipped)) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    },
    isReachableByRook(board: number[][], position: number[], aftPosition: number[]): boolean {
        if (position[0] != aftPosition[0] && position[1] != aftPosition[1]) {
            return false;
        }
        if (position[0] == aftPosition[0]) {
            for (let i: number = Math.min(position[1], aftPosition[1]) + 1; i < Math.max(position[1], aftPosition[1]); i++) {
                if (board[position[0]][i] != 0) {
                    return false;
                }
            }
        }
        if (position[1] == aftPosition[1]) {
            for (let i: number = Math.min(position[0], aftPosition[0]) + 1; i < Math.max(position[0], aftPosition[0]); i++) {
                if (board[i][position[1]] != 0) {
                    return false;
                }
            }
        }
        return true;
    },
    isReachableByBishop(board: number[][], position: number[], aftPosition: number[]): boolean {
        let distance: number = Math.abs(position[0] - aftPosition[0]);
        if (distance != Math.abs(position[1] - aftPosition[1])) {
            return false;
        }
        if ((position[0] - aftPosition[0]) * (position[1] - aftPosition[1]) > 0) {
            for (let i: number = 1; i < distance; i++) {
                if (board[Math.min(position[0], aftPosition[0]) + i][Math.min(position[1], aftPosition[1]) + i] != 0) {
                    return false;
                }
            }
        }
        else {
            for (let i: number = 1; i < distance; i++) {
                if (board[Math.min(position[0], aftPosition[0]) + i][Math.max(position[1], aftPosition[1]) - i] != 0) {
                    return false;
                }
            }
        }
        return true;
    },
    isReachableByQueen(board: number[][], position: number[], aftPosition: number[]): boolean {
        return this.isReachableByRook(board, position, aftPosition) || this.isReachableByBishop(board, position, aftPosition);
    },
    isReachableByKnight(position: number[], aftPosition: number[]): boolean {
        let distance: number = Math.abs(position[0] - aftPosition[0]) + Math.abs(position[1] - aftPosition[1]);
        if (distance != 3) {
            return false;
        }
        if (position[0] == aftPosition[0]) {
            return false;
        }
        if (position[1] == aftPosition[1]) {
            return false;
        }
        return true;
    },
    isReachableByPawn(board: number[][], position: number[], aftPosition: number[], flipped: boolean): boolean {
        if (Math.abs(position[1] - aftPosition[1]) > 1) {
            return false;
        }
        else if (Math.abs(position[1] - aftPosition[1]) == 1) {
            if (!flipped && (position[0] - aftPosition[0]) * board[position[0]][position[1]] != 1) {
                return false;
            }
            if (flipped && (position[0] - aftPosition[0]) * board[position[0]][position[1]] != -1) {
                return false;
            }
            if (board[aftPosition[0]][aftPosition[1]] == 0) {
                return false;
            }
            return true;
        }
        if (board[aftPosition[0]][aftPosition[1]] != 0) {
            return false;
        }
        if ((board[position[0]][position[1]] > 0 && !flipped) || (board[position[0]][position[1]] < 0 && flipped)) {
            if (position[0] < 6) {
                if (position[0] - aftPosition[0] != 1) {
                    return false;
                }
            }
            else {
                if (position[0] - aftPosition[0] != 1 && position[0] - aftPosition[0] != 2) {
                    return false;
                }
                if (board[5][position[1]] != 0) {
                    return false;
                }
            }
        }
        else {
            if (position[0] > 1) {
                if (aftPosition[0] - position[0] != 1) {
                    return false;
                }
            }
            else {
                if (aftPosition[0] - position[0] != 1 && aftPosition[0] - position[0] != 2) {
                    return false;
                }
                if (board[2][position[1]] != 0) {
                    return false;
                }
            }
        }
        return true;
    }
};

export { PieceRules };
