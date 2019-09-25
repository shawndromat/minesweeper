import React, { useState } from 'react';
import './App.css';
import Game from './lib/Game';
import { LEVELS } from './lib/levelConstants';
import Cell from './Cell';
import { newGame, nextTurn } from './lib/turnedBased';

const App = () => {
  const [game, setGame] = useState(newGame());
  const { grid, status, done } = game;

  const onCellClick = (coords) => {
    if (done) return;
    setGame(game => nextTurn(coords, game));
  };

  return (
    <div className="App">
        <h2>{status}</h2>
          {
            grid.map((row, x) =>
              <div className="gameRow" key={`row-${x}`}>
                {
                  row.map((cell, y) =>
                    <Cell
                      key={`${x} ${y}`}
                      revealed={cell.revealed}
                      value={cell.value}
                      onClick={() => {
                        onCellClick([x, y])
                      }}
                    />
                  )
                }
              </div>
            )
          }
        <div>
          {
            Object.keys(LEVELS).map(level =>
              <button onClick={() => console.log(level)}>{level}</button>
            )
          }
        </div>
    </div>
  );
};

export default App;
