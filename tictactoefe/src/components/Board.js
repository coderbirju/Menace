import React from 'react';
import Square from './Square';

const style = {
  borderRadius: "5px",
  border: "4px solid darkblue",
  width: "300px",
  height: "300px",
  margin: "0 auto",
  display: "grid",
  gridTemplate: "repeat(3, 1fr) / repeat(3, 1fr)",
  
}

const Board = ({squares, onClick}) => (
    <div style={style}>
      {squares.map((square, i) => (
        <Square key={i} value={square} onClick={() => onClick(i)} />
      ))}
    </div>
    

)

export default Board