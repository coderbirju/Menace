import React, {useState, useEffect, useRef} from 'react'
import Board from './Board';
import { calculateWinner, getCurrentBoardStateString, getPositionString, getIforBoard } from '../helpers/helper';
import axios from 'axios';

const styles = {
  width: '300px',
  margin: '20px auto'
}

function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const winner = calculateWinner(board); 
  // const isFirstRender = useRef(true);
  const [compMove, setCompMove] = useState(false);

  const callApi = async (data) => {
    // console.log('data: ', data);
    var config = {
      method: 'post',
      url: 'http://127.0.0.1:5000/api/move',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    const response = await axios(config);
    // console.log('response: ', response, typeof response.data);
    return response;
  }

  const handleClick = (i) => {
    // console.log('i: ', i);
    const tempBoard = [...board];
    if(winner || tempBoard[i]) return;
    tempBoard[i] = isXNext ? 'X' : 'O';
    // console.log('tempBoard: ', tempBoard);
    setBoard(tempBoard);
    setIsXNext(!isXNext); 
  }

  

  useEffect(() => {
    
    async function callApiHelper(isCompMove = false) {
      const boardState = getCurrentBoardStateString(board);
      const freePositions = getPositionString(board);
      // console.log('boardState: ', boardState);
      // console.log('freePositions: ', freePositions);
      // console.log('board: ', board);
      let cbs = getCbs(boardState);
      // console.log('cbs: ', cbs);
      let curPlayer = isXNext ? 1 : -1;
      var data = JSON.stringify({
        position: freePositions,
        current_board_state: cbs,
        symbol: curPlayer
      });
      return await callApi(data);
    }
    
    // if(isFirstRender){
    //   return;
    // }

    if(board) {
      callApiHelper(compMove);
    }

  }, [board, compMove, isXNext]);


  

  const getCbs = (boardState) => {
    let cbs = "[";
    let test =  boardState;
    for(var iter in test){
      let c = JSON.stringify(test[iter]);
      cbs = cbs + c + ",";
    }
    // cbs.slice(0, -1);
    // cbs.slice(0, -1);
    // console.log('cbs: ', cbs);
    cbs = cbs + "]"
    return cbs;
  }

  const setSymbol = (data) => {
    console.log('data: setSymbol', data);
    let i = getIforBoard(data);
    handleClick(i);
  }

  const randomizeMove = async () => {
    const boardState = getCurrentBoardStateString(board);
    const freePositions = getPositionString(board);
    let cbs = getCbs(boardState);
    // console.log('cbs: ', cbs);
    let curPlayer = isXNext ? 1 : -1;
    var data = JSON.stringify({
      position: freePositions,
      current_board_state: cbs,
      symbol: curPlayer
    });
    let response = await callApi(data);
    let compMove = response.data;
    // call setSymbol function here
    setSymbol(compMove);
    // return await callApi(data);
  }

  const freshGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  }

  const renderMoves = () => (
    <>
    <button style={{ marginLeft: '100px', paddingLeft: '10px' }} onClick={() => freshGame()}>
      {winner ? "Restart Game" : "Start Game"}
    </button>
    <button style={{ marginLeft: '100px', paddingLeft: '10px' }} onClick={randomizeMove}>
      {"Random move"}
    </button>
    </>
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