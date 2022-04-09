import React, {useState} from 'react'
import Board from './Board';
import { calculateWinner } from '../helpers/helper';

const styles = {
  width: '300px',
  margin: '20px auto'
}

function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const winner = calculateWinner(board);


  const handleClick = (i) => {
    console.log('i: ', i);
    const tempBoard = [...board];
    console.log('tempBoard: ', tempBoard);
    if(winner || tempBoard[i]) return;
    tempBoard[i] = isXNext ? 'X' : 'O';
    setBoard(tempBoard);
    setIsXNext(!isXNext); 
  }

  const jumpTo = () => {

  }

  const renderMoves = () => (
    <button style={{ marginLeft: '100px', paddingLeft: '10px' }} onClick={() => setBoard(Array(9).fill(null))}>
      Start Game
    </button>
  )

  return (
    <>
      <Board squares={board} onClick={handleClick} /> 
      <div style={styles}>
        <p>
          {winner ? 'Game Winner: ' + winner : 'Next Move: ' + (isXNext ? 'X' : 'O')}
          {renderMoves()}
        </p>
      </div>
    </>
  )
}

export default Game