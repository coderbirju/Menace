import React, {useState, useEffect} from 'react'
import Board from './Board';
import { calculateWinner, getCurrentBoardStateString, getPositionString } from '../helpers/helper';
import axios from 'axios';

const styles = {
  width: '300px',
  margin: '20px auto'
}

function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const winner = calculateWinner(board); 

  const callApi = async (data) => {
    var config = {
      method: 'post',
      url: 'http://127.0.0.1:5000/api/move',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    const response = await axios(config);
    console.log('response: ', response);
    return response;
  }


  const handleClick =  async (i) => {
    const tempBoard = [...board];
    if(winner || tempBoard[i]) return;
    tempBoard[i] = isXNext ? 'X' : 'O';
    setBoard(tempBoard);
    setIsXNext(!isXNext); 
  }

  useEffect(() => {
    async function callApiHelper() {
      const boardState = getCurrentBoardStateString(board);
      const freePositions = getPositionString(board);
      console.log('boardState: ', boardState);
      console.log('freePositions: ', freePositions);
      console.log('board: ', board);
      let cbs = "";
      let test =  boardState;
      for(var iter in test){
        let c = JSON.stringify(test[iter]);
        cbs = cbs + c + ",";
      }
      cbs.slice(0, -1);
      
      var data = JSON.stringify({
        position: freePositions,
        current_board_state: cbs,
        symbol: -1
      });
  
      return await callApi(data);
    }

    if(board) {
      callApiHelper()
    }
}, [board]);

  const renderMoves = () => (
    <button style={{ marginLeft: '100px', paddingLeft: '10px' }} onClick={() => setBoard(Array(9).fill(null))}>
      {winner ? "Restart Game" : "Start Game"}
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