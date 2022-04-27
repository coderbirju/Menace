import React, { useState, useEffect, useRef } from 'react';
import Board from './Board';
import {
  calculateWinner,
  getCurrentBoardStateString,
  getPositionString,
  getIforBoard,
  isGameOver
} from '../helpers/helper';
import axios from 'axios';
import './../index.css';


const styles = {
  width: '300px',
  margin: '20px auto',
};

const center = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
};

function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const winner = calculateWinner(board);
  // const isFirstRender = useRef(true);
  const [compMove, setCompMove] = useState(false);
  const gameOver = isGameOver(board, winner);
  console.log('winner: ', winner);
  console.log('isGameOver: ', gameOver);

  // api to call the python api to get the next move
  const callApi = async (data) => {
    // console.log('data: ', data);
    var config = {
      method: 'post',
      url: 'http://127.0.0.1:5000/api/move',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    const response = await axios(config);
    // console.log('response: ', response, typeof response.data);
    return response;
  };

  // handle human click on the board
  const handleClick = (i) => {
    // console.log('i: ', i);
    const tempBoard = [...board];
    if (winner || tempBoard[i]) return;
    tempBoard[i] = isXNext ? 'X' : 'O';
    // console.log('tempBoard: ', tempBoard);
    setBoard(tempBoard);
    setIsXNext(!isXNext);
  };

  // update the states based on changes to the boardState and other state variable
  useEffect(() => {
    async function callApiHelper(isCompMove = false) {
      const boardState = getCurrentBoardStateString(board);
      const freePositions = getPositionString(board);
      let cbs = getCbs(boardState);
      let curPlayer = isXNext ? 1 : -1;
      var data = JSON.stringify({
        position: freePositions,
        current_board_state: cbs,
        symbol: curPlayer,
      });
      return await callApi(data);
    }
    if (board) {
      callApiHelper(compMove);
    }
  }, [board, compMove, isXNext]);

  //utility to build the board state
  const getCbs = (boardState) => {
    let cbs = '[';
    let test = boardState;
    for (var iter in test) {
      let c = JSON.stringify(test[iter]);
      cbs = cbs + c + ',';
    }
    cbs = cbs + ']';
    return cbs;
  };

  // function to mimic a board click
  const setSymbol = (data) => {
    console.log('data: setSymbol', data);
    let i = getIforBoard(data); // gets the corresponding array position value based on the response from the MENACE model
    handleClick(i); // mimic the board click on the i'th position calculated above
  };

  // call the python Api to get the move from menace
  const randomizeMove = async () => {
    const boardState = getCurrentBoardStateString(board); // current board state in the format that the api requires
    const freePositions = getPositionString(board); // calculated free positions according to the required api request
    let cbs = getCbs(boardState);
    // console.log('cbs: ', cbs);
    let curPlayer = isXNext ? 1 : -1;
    var data = JSON.stringify({
      position: freePositions,
      current_board_state: cbs,
      symbol: curPlayer,
    });
    let response = await callApi(data);
    let compMove = response.data;
    // call setSymbol function here
    setSymbol(compMove);
    // return await callApi(data);
  };

  //reset the board
  const freshGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const renderMoves = () => (
    <>
      <div style={center}>
        <button
          style={{ marginLeft: '100px', paddingLeft: '10px' }}
          onClick={() => freshGame()}
        >
          {winner || gameOver ? 'Restart Game' : 'Start Game'}
        </button>
        <button
          style={{ marginLeft: '100px', paddingLeft: '10px' }}
          onClick={randomizeMove}
        >
          {'Random move'}
        </button>
      </div>
    </>
  );


  // Game renders this

  return (
    <>
      <>{renderMoves()}</>
      <Board squares={board} onClick={handleClick} />
      { winner && gameOver ? (
          <div class="death-background">
            <p>{winner} Won</p>
          </div>
        ) : (!winner && gameOver) ?
        (
          <div class="death-background">
            <p>Game Over</p>
          </div>
        )
        : (
          <div style={styles}>
            <p>{'Next Move: ' + (isXNext ? 'X' : 'O')}</p>
          </div>
        )
      }
    </>
  );
}

export default Game;
