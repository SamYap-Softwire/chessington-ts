import Pawn from '../../../src/engine/pieces/pawn';
import Board from '../../../src/engine/board';
import Player from '../../../src/engine/player';
import Square from '../../../src/engine/square';
import Rook from '../../../src/engine/pieces/rook';
import King from '../../../src/engine/pieces/king';
import Queen from '../../../src/engine/pieces/queen';


describe('Pawn', () => {

    let board: Board;
    beforeEach(() => board = new Board());

    describe('white pawns', () => {

        it('can only move one square up if they have already moved', () => {
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(1, 0), pawn);
            pawn.moveTo(board, Square.at(2, 0));

            const moves = pawn.getAvailableMoves(board);

            moves.should.have.length(1);
            moves.should.deep.include(Square.at(3, 0));
        });

        it('can move one or two squares up on their first move', () => {
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(1, 7), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.have.length(2);
            moves.should.deep.include.members([Square.at(2, 7), Square.at(3, 7)]);
        });

        it('cannot move at the top of the board', () => {
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(7, 3), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.be.empty;
        });

        it('can move diagonally if there is a piece to take', () => {
            const pawn = new Pawn(Player.WHITE);
            const opposingPiece = new Rook(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(5, 3), opposingPiece);

            const moves = pawn.getAvailableMoves(board);

            moves.should.deep.include(Square.at(5, 3));
        });

        it('cannot move diagonally if there is no piece to take', () => {
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(4, 4), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(5, 3));
        });

        it('cannot take a friendly piece', () => {
            const pawn = new Pawn(Player.WHITE);
            const friendlyPiece = new Rook(Player.WHITE);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(5, 3), friendlyPiece);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(5, 3));
        });

        it('cannot take the opposing king', () => {
            const pawn = new Pawn(Player.WHITE);
            const opposingKing = new King(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(5, 3), opposingKing);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(5, 3));
        });

        it('can en passant immediately after', () => {
            const pawn = new Pawn(Player.WHITE);
            const opposingPawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(6, 5), opposingPawn);

            board.currentPlayer = Player.BLACK;
            opposingPawn.moveTo(board, Square.at(4, 5));

            board.currentPlayer = Player.WHITE;
            const moves = pawn.getAvailableMoves(board);

            moves.should.deep.include(Square.at(5, 5));
        })

        it('cannot en passant if not from starting position', () => {
            const pawn = new Pawn(Player.WHITE);
            const opposingPawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(5, 5), opposingPawn);

            board.currentPlayer = Player.BLACK;
            opposingPawn.moveTo(board, Square.at(4, 5));

            board.currentPlayer = Player.WHITE;
            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(5, 5));
        })

        it('cannot en passant if other moves made in between', () => {
            const pawn = new Pawn(Player.WHITE);
            const pawn2 = new Pawn(Player.WHITE);
            const opposingPawn = new Pawn(Player.BLACK);
            const opposingPawn2 = new Pawn(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(3, 1), pawn2);
            board.setPiece(Square.at(6, 5), opposingPawn);
            board.setPiece(Square.at(5, 7), opposingPawn2);

            board.currentPlayer = Player.BLACK;
            opposingPawn.moveTo(board, Square.at(4, 5));

            board.currentPlayer = Player.WHITE;
            pawn2.moveTo(board, Square.at(4, 1));

            board.currentPlayer = Player.BLACK;
            opposingPawn2.moveTo(board, Square.at(4,7));

            board.currentPlayer = Player.WHITE;
            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(5,5));
        })

        it('opponent pawn is no longer a piece after en passant', () => {
            const pawn = new Pawn(Player.WHITE);
            const opposingPawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(6, 5), opposingPawn);

            board.currentPlayer = Player.BLACK;
            opposingPawn.moveTo(board, Square.at(4, 5));

            board.currentPlayer = Player.WHITE;
            pawn.moveTo(board, Square.at(5,5));
            board.currentPlayer = Player.BLACK;
            const piece = board.getPiece(Square.at(3,5));
            (typeof(piece) === 'undefined').should.be.true;
        })

        it('pawn promoted to queen when arrives on the other end', () => {
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(6,3), pawn);
            pawn.moveTo(board, Square.at(7,3));

            const piece = board.getPiece(Square.at(7,3));

            (piece instanceof Queen).should.be.true;
        })
    });

    describe('black pawns', () => {

        let board: Board;
        beforeEach(() => board = new Board(Player.BLACK));

        it('can only move one square down if they have already moved', () => {
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(6, 0), pawn);
            pawn.moveTo(board, Square.at(5, 0));

            const moves = pawn.getAvailableMoves(board);

            moves.should.have.length(1);
            moves.should.deep.include(Square.at(4, 0));
        });

        it('can move one or two squares down on their first move', () => {
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(6, 7), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.have.length(2);
            moves.should.deep.include.members([Square.at(4, 7), Square.at(5, 7)]);
        });

        it('cannot move at the bottom of the board', () => {
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(0, 3), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.be.empty;
        });

        it('can move diagonally if there is a piece to take', () => {
            const pawn = new Pawn(Player.BLACK);
            const opposingPiece = new Rook(Player.WHITE);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(3, 3), opposingPiece);

            const moves = pawn.getAvailableMoves(board);

            moves.should.deep.include(Square.at(3, 3));
        });

        it('cannot move diagonally if there is no piece to take', () => {
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(3, 3));
        });

        it('cannot take a friendly piece', () => {
            const pawn = new Pawn(Player.BLACK);
            const friendlyPiece = new Rook(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(3, 3), friendlyPiece);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(3, 3));
        });

        it('cannot take the opposing king', () => {
            const pawn = new Pawn(Player.BLACK);
            const opposingKing = new King(Player.WHITE);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(3, 3), opposingKing);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(3, 3));
        });

        it('can en passant immediately after', () => {
            const pawn = new Pawn(Player.BLACK);
            const opposingPawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(3, 4), pawn);
            board.setPiece(Square.at(1,5), opposingPawn);

            board.currentPlayer = Player.WHITE;
            opposingPawn.moveTo(board, Square.at(3, 5));
    
            board.currentPlayer = Player.BLACK;
            const moves = pawn.getAvailableMoves(board);
    
            moves.should.deep.include(Square.at(2, 5));
        })

        it('cannot en passant if not from starting position', () => {
            const pawn = new Pawn(Player.BLACK);
            const opposingPawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(3, 4), pawn);
            board.setPiece(Square.at(2,5), opposingPawn);

            board.currentPlayer = Player.WHITE;
            opposingPawn.moveTo(board, Square.at(3, 5));
    
            board.currentPlayer = Player.BLACK;
            const moves = pawn.getAvailableMoves(board);
    
            moves.should.not.deep.include(Square.at(2, 5));
        })
    
        it('cannot en passant if other moves made in between', () => {
            const pawn = new Pawn(Player.BLACK);
            const pawn2 = new Pawn(Player.BLACK);
            const opposingPawn = new Pawn(Player.WHITE);
            const opposingPawn2 = new Pawn(Player.WHITE);
            board.setPiece(Square.at(3, 4), pawn);
            board.setPiece(Square.at(5, 7), pawn2);
            board.setPiece(Square.at(1, 5), opposingPawn);
            board.setPiece(Square.at(3, 1), opposingPawn2);
    
            board.currentPlayer = Player.WHITE;
            opposingPawn.moveTo(board, Square.at(3, 5));

            board.currentPlayer = Player.BLACK;
            pawn2.moveTo(board, Square.at(4, 7));

            board.currentPlayer = Player.WHITE;
            opposingPawn2.moveTo(board, Square.at(4,1));
    
            board.currentPlayer = Player.BLACK;
            const moves = pawn.getAvailableMoves(board);
    
            moves.should.not.deep.include(Square.at(2,5));
        })
    
        it('opponent pawn is no longer a piece after en passant', () => {
            const pawn = new Pawn(Player.BLACK);
            const opposingPawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(3, 4), pawn);
            board.setPiece(Square.at(1, 5), opposingPawn);

            board.currentPlayer = Player.WHITE;
            opposingPawn.moveTo(board, Square.at(3, 5));

            board.currentPlayer = Player.BLACK;
            pawn.moveTo(board, Square.at(2, 5));
            board.currentPlayer = Player.WHITE;
            const piece = board.getPiece(Square.at(3,5));
            (typeof(piece) === 'undefined').should.be.true;
        })

        it('pawn promoted to queen when arrives on the other end', () => {
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(1,3), pawn);
            pawn.moveTo(board, Square.at(0,3));

            const piece = board.getPiece(Square.at(0,3));

            (piece instanceof Queen).should.be.true;
        })
    });

    it('cannot move if there is a piece in front', () => {
        const pawn = new Pawn(Player.BLACK);
        const blockingPiece = new Rook(Player.WHITE);
        board.setPiece(Square.at(6, 3), pawn);
        board.setPiece(Square.at(5, 3), blockingPiece);

        const moves = pawn.getAvailableMoves(board);

        moves.should.be.empty;
    });

    it('cannot move two squares if there is a piece two sqaures in front', () => {
        const pawn = new Pawn(Player.BLACK);
        const blockingPiece = new Rook(Player.WHITE);
        board.setPiece(Square.at(6, 3), pawn);
        board.setPiece(Square.at(4, 3), blockingPiece);

        const moves = pawn.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(4, 3));
    });
});
