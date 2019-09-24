import React from 'react';
import { EMPTY, MINE } from './lib/cellConstants';

const Cell = ({ value, revealed, onClick }) => {
  let text = '';
  if (revealed) {
    switch (value) {
      case EMPTY:
      case 0:
        text = '';
        break;
      case MINE:
        text = 'X';
        break;
      default:
        text = value;
        break;
    }
  }

  const handleClick = () => {
    onClick();
  };

  return (
    <div
      className="cell"
      style={{backgroundColor: revealed ? 'papayawhip' : 'white'}}
      onClick={handleClick}
    >
      {text}
    </div>
  );
};

export default Cell;
