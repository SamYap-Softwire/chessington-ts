import Player from '../player';
import Board from '../board';
import Square from '../square';
import King from "./king";

export default class Piece {
    public player: Player;
    public MOVED: boolean = false;

    public constructor(player: Player) {
        this.player = player;
    }

    public getAvailableMoves(board: Board): Square[] {
        throw new Error('This method must be implemented, and return a list of available moves');
    }

    public moveTo(board: Board, newSquare: Square) {
        const currentSquare = board.findPiece(this);
        board.movePiece(currentSquare, newSquare);
        if (!this.MOVED) this.MOVED = true;
    }

}

