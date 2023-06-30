import 'chai/register-should';
import Board from '../../src/engine/board';
import Pawn from '../../src/engine/pieces/pawn';
import Player from '../../src/engine/player';
import Square from '../../src/engine/square';
import King from "../../src/engine/pieces/king";
import Knight from "../../src/engine/pieces/knight";
import Queen from "../../src/engine/pieces/queen";

describe('Board', () => {

    describe('pawns', () => {

        let board : Board;
        beforeEach(() => { // Common code executed before each test.
            board = new Board();
        });

        it('can be added to the board', () => {
            // Arrange
            const pawn = new Pawn(Player.WHITE);
            const square = Square.at(0, 0);

            // Act
            board.setPiece(square, pawn);

            // Assert
            const piece = board.getPiece(square);
            pawn.should.equal(piece); // Object equality: same object reference
        });

        it('can be found on the board', () => {
            // Arrange
            const pawn = new Pawn(Player.WHITE);
            const square = Square.at(6, 4);

            // Act
            board.setPiece(square, pawn);

            // Assert
            board.findPiece(pawn).should.eql(square); // Object equivalence: different objects, same data
        });

        it('isStalemate returns true when there are no legal moves and king not in check', () => {
            // Arrange
            const myKing = new King(Player.WHITE);
            const opponentKing = new King(Player.BLACK);
            const opponentKnight = new Knight(Player.BLACK);

            // Act
            board.setPiece(Square.at(0,0), myKing);
            board.setPiece(Square.at(2,0), opponentKing);
            board.setPiece(Square.at(2,2), opponentKnight);

            // Assert
            board.isStalemate().should.be.true;
        });

        it('isStalemate returns true when king in check and there is constantly only one legal move', () => {
            // Arrange
            const myKing = new King(Player.WHITE);
            const myPawn = new Pawn(Player.WHITE);
            const opponentQueen = new Queen(Player.BLACK);

            // Act
            board.setPiece(Square.at(1,0), myKing);
            board.setPiece(Square.at(1,1), myPawn);
            board.setPiece(Square.at(3,0), opponentQueen);

            // Assert
            board.isStalemate().should.be.true;
        });

        it('isStalemate returns true when board position repeats involving multiple moves');
        // need specific example for this

    });
});
