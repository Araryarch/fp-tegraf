export type Position = { r: number; c: number };

export const BOARD_SIZE = 8;

const MOVES = [
  { r: 2, c: 1 }, { r: 1, c: 2 }, { r: -1, c: 2 }, { r: -2, c: 1 },
  { r: -2, c: -1 }, { r: -1, c: -2 }, { r: 1, c: -2 }, { r: 2, c: -1 }
];

function isValid(r: number, c: number, board: number[][]): boolean {
  return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === -1;
}

function getDegree(r: number, c: number, board: number[][]): number {
  let count = 0;
  for (const m of MOVES) {
    if (isValid(r + m.r, c + m.c, board)) count++;
  }
  return count;
}

export function solveKnightsTour(start: Position, isClosed: boolean): Position[] | null {
  const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(-1));
  const path: Position[] = [];
  
  // Backtracking with Warnsdorff's heuristic
  function solve(curr: Position, moveCount: number): boolean {
    board[curr.r][curr.c] = moveCount;
    path.push(curr);

    if (moveCount === BOARD_SIZE * BOARD_SIZE - 1) {
      if (!isClosed) return true;
      // Check if we can jump back to start
      for (const m of MOVES) {
        if (curr.r + m.r === start.r && curr.c + m.c === start.c) return true;
      }
      // If closed tour required but not possible from here, backtrack
      path.pop();
      board[curr.r][curr.c] = -1;
      return false;
    }

    // Get all valid next moves
    const nextMoves: { r: number; c: number; degree: number }[] = [];
    for (const m of MOVES) {
      const nr = curr.r + m.r;
      const nc = curr.c + m.c;
      if (isValid(nr, nc, board)) {
        nextMoves.push({ r: nr, c: nc, degree: getDegree(nr, nc, board) });
      }
    }

    // Sort by degree (Warnsdorff's rule)
    nextMoves.sort((a, b) => a.degree - b.degree);

    for (const next of nextMoves) {
      if (solve({ r: next.r, c: next.c }, moveCount + 1)) return true;
    }

    // Backtrack
    board[curr.r][curr.c] = -1;
    path.pop();
    return false;
  }

  if (solve(start, 0)) {
    return path;
  }
  return null;
}
