import { LEVELS, sizes } from './levelConstants';
import { LOST, PLAYING, WON } from './gameConstants';
import Game from './Game'
import { MINE } from './cellConstants';

export const newGame = (level = LEVELS.EASY) => {
  const boardSize = sizes[level].boardSize;
  const numMines = sizes[level].numMines;
  const mineCoords = Game.generateMines(numMines, boardSize);
  const grid = Game.buildGrid(boardSize, mineCoords);
  return {
    grid,
    numMines,
    status: PLAYING,
    done: false
  }
};

const NEIGHBOR_DIFFS =
  [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

const findNeighbors = ([x, y], grid) => {
  const neighborCoords = NEIGHBOR_DIFFS.map(
    ([first, second]) => [x + first, y + second],
  ).filter(([neighborX, neighborY]) =>
    neighborX >= 0 && neighborX < grid.length &&
    neighborY >= 0 && neighborY < grid.length,
  );

  return neighborCoords.map(([first, second]) => grid[first][second]);
};

const clone = o => JSON.parse(JSON.stringify(o));

const isWon = game => {
  const numRemainingCells = game.grid.reduce(
    (sum, row) => sum = sum + row.filter(cell => !cell.revealed).length,
    0
  );

  return numRemainingCells === game.numMines;
};

const playingGame = (prevGame, newGrid) => (
  {
    ...clone(prevGame),
    grid: newGrid,
    status: '😀',
    done: false,
  }
);

const wonGame = (prevGame, newGrid) => (
  {
    ...clone(prevGame),
    grid: newGrid,
    status: '😎',
    done: true,
  }
);

const loseGame = (prevGame, newGrid) => (
  {
    ...clone(prevGame),
    status: '😵',
    grid: newGrid.map(row => row.map(cell => {
      if (cell.value === MINE) {
        cell.revealed = true
      }
      return cell;
    })),
    done: true,
  }
);

const cellsToReveal = (grid, [x, y]) => {
  if (grid[x][y].revealed) return [];
  const cells = [[x, y]];

  const neighbors = findNeighbors([x, y], grid);
  const numMineNeighbors = neighbors.filter(neighbor => neighbor.value === MINE).length;

  if (numMineNeighbors === 0) neighbors.forEach(neighbor => game.revealCell(neighbor));
};

export const nextTurn = ([x, y], game) => {
  if (game.done) return clone(game);
  if (game.grid[x][y].revealed) return clone(game);

  let newGrid = clone(game.grid);

  newGrid.grid[x][y].revealed = true;

  if (game.grid[x][y].value === MINE) return loseGame(game, newGrid);

  const neighbors = findNeighbors([x, y], game.grid);
  const numMineNeighbors = neighbors.filter(neighbor => neighbor.value === MINE).length;

  game.grid[x][y].value = numMineNeighbors;
  console.log(game.grid);

  if (numMineNeighbors === 0) neighbors.forEach(neighbor => game.revealCell(neighbor));

  if (isWon(game)) {
    return wonGame(game);
  } else {
    return playingGame(game);
  }
};
