import Player from './player';
import GameSettings from './gameSettings';
import Square from './square';
import Piece from './pieces/piece';
import King from './pieces/king';
import Rook from './pieces/rook';


export default class Board {
    public currentPlayer: Player;
    public previousMove: (Square[]) = [];
    public allBoardPositions: [Board, number][] = [];
    private readonly board: (Piece | undefined)[][];

    public constructor(currentPlayer?: Player) {
        this.currentPlayer = currentPlayer ? currentPlayer : Player.WHITE;
        this.board = this.createBoard();
    }

    public setPiece(square: Square, piece: Piece | undefined) {
        this.board[square.row][square.col] = piece;
    }

    public getPiece(square: Square) {
        return this.board[square.row][square.col];
    }

    public findPiece(pieceToFind: Piece) {
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                if (this.board[row][col] === pieceToFind) {
                    return Square.at(row, col);
                }
            }
        }
        throw new Error('The supplied piece is not on the board');
    }

    public movePiece(fromSquare: Square, toSquare: Square) {
        const movingPiece = this.getPiece(fromSquare);        
        if (!!movingPiece && movingPiece.player === this.currentPlayer) {
            this.setPiece(toSquare, movingPiece);
            this.setPiece(fromSquare, undefined);
            this.currentPlayer = (this.currentPlayer === Player.WHITE ? Player.BLACK : Player.WHITE);
            this.previousMove = [fromSquare, toSquare];
            this.updateBoard();
        }
    }

    public isInBoard(square: Square){
        const row = square.row;
        const column = square.col;
        return row >= 0 && column >= 0 && row <= 7 && column <= 7;
    }

    public squareIsOccupied(position: Square){
        const possiblePiece = this.getPiece(position);
        return possiblePiece !== undefined
    }

    public squareHasCapturablePiece(position: Square){
        const possiblePiece = this.getPiece(position);
        return possiblePiece!.player !== this.currentPlayer && !(possiblePiece instanceof King);
    }

    public rookInStartingPosition(){
        const allRooksInStartingPosition = [];

        if (this.currentPlayer === Player.WHITE){
            for (const square of [Square.at(0,0), Square.at(0,7)]){
                const piece = this.getPiece(square);
                if (piece instanceof Rook && piece.player === this.currentPlayer && !piece.MOVED) allRooksInStartingPosition.push(square);
            }
        } else {
            for (const square of [Square.at(7,0), Square.at(7,7)]){
                const piece = this.getPiece(square);
                if (piece instanceof Rook && piece.player === this.currentPlayer && !piece.MOVED) allRooksInStartingPosition.push(square);
            }
        }
        return allRooksInStartingPosition;
    }

    public isLegalMove(){
        // TODO: Implement this method
        return true;
    }

    public inCheck() {
        // TODO: Implement this method
        return false;
    }

    public compareWith(board: Board){
        if (this.currentPlayer !== board.currentPlayer){
            return false;
        }

        for (let row = 0; row < 8; row++){
            for (let col = 0; col < 8; col++){
                if (this.getPiece(Square.at(row, col)) !== board.getPiece(Square.at(row, col))){
                    return false;
                }
            }
        }
        return true;
        // TODO: implement tests
    }

    public updateBoard(){
        let exists = false;
        for (let index = 0; index < this.allBoardPositions.length; index++){
            if (this.compareWith(this.allBoardPositions[index][0])){
                this.allBoardPositions[index][1] += 1;
                exists = true;
                break;
            }
        }
        return exists;
        // TODO: implement tests
    }

    public threeFoldRepetition(){
        for (let index = 0; index < this.allBoardPositions.length; index++){
            const currentBoardCount = this.allBoardPositions[index];
            if (this.compareWith(currentBoardCount[0]) && currentBoardCount[1] === 3) {
                return true;
            }
        }
        return false;
        // TODO: implement tests
    }

    public isStalemate(){
        if (!(this.inCheck())) {
            // case if current king not in check but there are no legal moves for any piece
            for (const row of this.board) {
                for (const piece of row) {
                    if (piece !== undefined && piece.player === this.currentPlayer) {
                        if (piece.getAvailableMoves(this).length === 0) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
        return this.threeFoldRepetition();
        // TODO: Need to think of where this is implemented
    }

    private createBoard() {
        const board = new Array(GameSettings.BOARD_SIZE);
        for (let i = 0; i < board.length; i++) {
            board[i] = new Array(GameSettings.BOARD_SIZE);
        }
        return board;
    }
}
