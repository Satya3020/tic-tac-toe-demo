import "./App.css";
import { useState } from "react";

//for declaring win we need to know the state of every box, so sharing components
function Square({ value, onSquareClick }) {
  return (
    <>
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
    </>
  );
}
//basically like a pre-defined function
//function handleClick() {
//setValue("X");
//console.log("Clicked!")
//shows in console, with frequency updated
//}
//   return (
//     <>
//       <button className="square" onClick={handleClick}>
//         {value}
//       </button>
//     </>
//   );
// }

//here value is set as x or o

function Board({ xIsNext, squares, onPlay }) {
  //fragments
  //value must be rendered as property for the elements
  //props in function & common var --> <Square value={1} /> value property
  //without props if state is used, then in return use the values (outside the tag)
  //const [xIsNext, setXIsNext] = useState(true);
  //cap to start of var in function
  //default to x
  //since we changed it in game function with history
  //const [squares, setSquares] = useState(Array(9).fill(null));
  //we declare squares as array

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    } //if already filled, we just stop
    const nextSquares = squares.slice();
    //slicing to keep history
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
    //state is rememebered
    //setSquares(nextSquares);
    //setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  //restricting the lenth to 3
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      //explanation for the above line, how the winner is calculated???
      return squares[a];
    }
  }
  return null;
}
//this function can be inside also
//top-level component is game now
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  //No need of usestate, since we are keeping track of the state
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    //like concatenation
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    //for undoand redo
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  //mapping each move to the squares
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  //Each move has an unique key

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board
            //our defined variables/properties
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    </>
  );
}
