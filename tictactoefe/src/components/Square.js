import React from 'react';

const style = {
  // borderRadius: "5px",
  background: 'lightblue',
  fontSize: '50px',
  fontWeight: 800,
  cursor: 'pointer',
  outline: 'none',
  border: '1px solid gray',
};

function Square({ value, onClick }) {
  return (
    <button style={style} onClick={onClick}>
      {value}
    </button>
  );
}

export default Square;
