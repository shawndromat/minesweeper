import { LEVELS, sizes } from './levelConstants';
import { EMPTY, MINE } from './cellConstants';

const PLAYING = 'playing';
const WON = 'won';
const LOST = 'lost';

const containsCell = (arrayOfCells, targetCell) => {
  arrayOfCells.find(cell =>
    cell[0] === targetCell[0] && cell[1] === targetCell[1],
  );
};

const randomInteger = (upperBound) => Math.floor(Math.random() * upperBound);

const NEIGHBOR_DIFFS =
  [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

export default class Game {
  static generateMines = (numMines, boardSize) => {
    const mines = [];

    while (mines.length < numMines) {
      const potentialMine = [randomInteger(boardSize), randomInteger(boardSize)];
      const mineIsDuplicate = containsCell(mines, potentialMine);
      if (!mineIsDuplicate) mines.push(potentialMine);
    }

    return mines;
  };

  static buildGrid = (size, mines) => {
    const grid = new Array(size).fill(null)
      .map((_, x) => new Array(size).fill(null)
        .map((_, y) => ({
          x,
          y,
          value: EMPTY,
          revealed: false,
        })),
      );

    mines.forEach(([mineX, mineY]) => grid[mineX][mineY].value = MINE);

    return grid;
  };

  constructor(level = LEVELS.EASY) {
    this.boardSize = sizes[level].boardSize;
    this.numMines = sizes[level].numMines;
    const mineCoords = Game.generateMines(this.numMines, this.boardSize);
    this.grid = Game.buildGrid(10, mineCoords);
    this.status = PLAYING;
  }

  revealCell = ({x, y}) => {
    if (this.grid[x][y].revealed) return;

    this.grid[x][y].revealed = true;

    if (this.grid[x][y].value === MINE) {
      this.status = LOST;
      return;
    }

    const neighbors = this.findNeighbors([x, y]);
    const numMineNeighbors = neighbors.filter(neighbor => neighbor.value === MINE).length;

    this.grid[x][y].value = numMineNeighbors;

    if (numMineNeighbors === 0) neighbors.forEach(neighbor => this.revealCell(neighbor));

    this.checkIfWon();
  };

  getDisplay = () => {
    switch (this.status) {
      case PLAYING:
        return {
          status: '😀',
          grid: JSON.parse(JSON.stringify(this.grid)),
          done: false,
        };
      case LOST:
        return {
          status: '😵',
          grid: this.grid.map(row => row.map(cell => {
            if (cell.value === MINE) {
              cell.revealed = true
            }
            return cell;
          })),
          done: true,
        };
      case WON:
        return {
          status: '😎',
          grid: JSON.parse(JSON.stringify(this.grid)),
          done: true,
        };
    }
  };

  findNeighbors = ([x, y]) => {
    const neighborCoords = NEIGHBOR_DIFFS.map(
      ([first, second]) => [x + first, y + second],
    ).filter(([neighborX, neighborY]) =>
      neighborX >= 0 && neighborX < this.boardSize &&
      neighborY >= 0 && neighborY < this.boardSize,
    );

    return neighborCoords.map(([first, second]) => this.grid[first][second]);
  };

  checkIfWon = () => {
    const numRemainingCells = this.grid.reduce(
      (sum, row) => sum = sum + row.filter(cell => !cell.revealed).length,
      0
    );

    if (numRemainingCells === this.numMines) this.status = WON;
  }
};

