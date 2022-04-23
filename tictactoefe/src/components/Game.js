import React, {useState, useEffect, useRef} from 'react'
import Board from './Board';
import { calculateWinner, getCurrentBoardStateString, getPositionString, getIforBoard } from '../helpers/helper';
import axios from 'axios';
import Victory from './victory';

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
    try {
      var config = {
        method: 'post',
        url: 'http://127.0.0.1:5000/api/move',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      const response = await axios(config);
      return response;
    } catch(ex){
      throw ex;
    }
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

  

  // useEffect(() => {
    
  //   async function callApiHelper(isCompMove = false) {
  //     const boardState = getCurrentBoardStateString(board);
  //     const freePositions = getPositionString(board);
  //     let cbs = getCbs(boardState);
  //     let curPlayer = isXNext ? 1 : -1;
  //     var data = JSON.stringify({
  //       position: freePositions,
  //       current_board_state: cbs,
  //       symbol: curPlayer
  //     });
  //     return await callApi(data);
  //   }
    
  //   if(board) {
  //     callApiHelper(compMove);
  //   }

  // }, [board, compMove, isXNext]);


  

  const getCbs = (boardState) => {
    let cbs = "[";
    let test =  boardState;
    for(var iter in test){
      let c = JSON.stringify(test[iter]);
      cbs = cbs + c + ",";
    }
    cbs = cbs + "]"
    return cbs;
  }

  const setSymbol = (data) => {
    let i = getIforBoard(data);
    handleClick(i);
  }

  const randomizeMove = async () => {
    try {
      const boardState = getCurrentBoardStateString(board);
      const freePositions = getPositionString(board);
      console.log('freePositions: ', freePositions);
      let cbs = getCbs(boardState);
      if(freePositions === "[]"){
        return;
      }
      let curPlayer = isXNext ? 1 : -1;
      var data = JSON.stringify({
        position: freePositions,
        current_board_state: cbs,
        symbol: curPlayer
      });
      let response = await callApi(data);
      let compMove = response.data;
      setSymbol(compMove);
    } catch(e){
      console.log("exception", e);
      
    }
  }



  const freshGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  }

  const renderMoves = () => (
    <>
    <button style={{ verticalAlign: "center", padding: '10px', margin:"auto", marginBottom: "10px"}} onClick={() => freshGame()}>
      {winner ? "Restart Game" : "Start Game"}
    </button>
    <button style={{ verticalAlign: "center", padding: '10px', marginBottom: "10px" }} onClick={randomizeMove}>
      {"Random move"}
    </button>
    </>
  )

  const victoryScreen = () => (
    <>
      <Victory winner={winner} onClick={freshGame}/>
      <Board squares={board} onClick={handleClick} /> 
    </>
  )

  const renderGame = () => (
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


  return (
    <>
      {
        winner ? victoryScreen() : renderGame()
      }
    </>
  )
}

export default Game