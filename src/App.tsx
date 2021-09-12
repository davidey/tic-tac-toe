import { useState } from "react";
import "./App.scss";

enum Mark {
  X = -1,
  O = 1
}

type BoardTile = {
  position: number;
  mark: Mark | null;
};

type Board = BoardTile[];

type Move = {
  position: number;
  mark: Mark.X | Mark.O;
};

type Player = Mark.X | Mark.O;

type WinningPattern = [number, number, number];

type GameStatus = {
  winner: null | Player;
  winningPattern: null | WinningPattern;
};

type Game = {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
};

interface TicTacToe {
  startGame: () => Game;
  isMoveAllowed: (g: Game, m: Move) => boolean;
  checkWinner: (b: Board) => GameStatus | null;
  makeMove: (g: Game, m: Move) => Game;
}

const emptyBoard: Board = new Array(9).fill(null).map((_, i) => {
  return {
    position: i,
    mark: null
  } as BoardTile;
});

const winningPatterns: WinningPattern[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const ticTacToe: TicTacToe = {
  startGame: () => {
    const game: Game = {
      board: emptyBoard,
      currentPlayer: Mark.X,
      status: {
        winner: null,
        winningPattern: null
      }
    };
    return game;
  },

  isMoveAllowed: (game: Game, move: Move) => {
    const boardTile = game.board[move.position];
    return boardTile.mark === null;
  },

  checkWinner: (board: Board) => {
    const players = [Mark.X, Mark.O] as Player[];
    let winner: null | Player = null;
    let winningPattern: null | WinningPattern = null;
    players.some((player) => {
      if (
        winningPatterns.some((pattern) => {
          console.log("Checking pattern", pattern);
          if (
            pattern.every((tileIndex) => {
              console.log("Checking index", tileIndex);
              return board[tileIndex].mark === player;
            })
          ) {
            winningPattern = pattern;
            return true;
          }
          return false;
        })
      ) {
        winner = player;
        return true;
      }
      return false;
    });
    return {
      winner,
      winningPattern
    };
  },

  makeMove: (game: Game, move: Move) => {
    console.log("Making move");
    if (ticTacToe.isMoveAllowed(game, move)) {
      console.log("allowed");
      let board = game.board.map((tile, i) =>
        i === move.position ? { ...tile, mark: game.currentPlayer } : tile
      );
      return {
        ...game,
        board: board,
        currentPlayer: game.currentPlayer === Mark.X ? Mark.O : Mark.X,
        status: ticTacToe.checkWinner(board)
      } as Game;
    }
    return game;
  }
};

function App() {
  const [game, setGame] = useState(ticTacToe.startGame());

  const getTileClass = (
    boardTile: BoardTile,
    winningPattern: null | WinningPattern
  ) => {
    let baseClass = "BoardTileMark";

    if (winningPatterns && winningPattern?.includes(boardTile.position)) {
      baseClass = `${baseClass} BoardTileMark-winner`;
    }

    switch (boardTile.mark) {
      case Mark.X:
        return `${baseClass} BoardTileMark-X`;
      case Mark.O:
        return `${baseClass} BoardTileMark-O`;
      default:
        return baseClass;
    }
  };

  return (
    <div className="App">
      <div className="Board">
        {game.board.map((boardTile, i) => (
          <div
            className="BoardTile"
            onClick={() => {
              setGame(
                ticTacToe.makeMove(game, {
                  position: i,
                  mark: game.currentPlayer
                })
              );
            }}
            key={i}
          >
            <div
              className={getTileClass(boardTile, game.status.winningPattern)}
            ></div>
          </div>
        ))}
      </div>
      <pre>{JSON.stringify(game, undefined, 2)}</pre>
    </div>
  );
}

export default App;
