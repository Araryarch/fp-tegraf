# Implementation Plan: FP Tegraf (Knight's Tour & LMIS)

## Objective
Develop a web application containing solutions for two specific problems:
1.  **The Knight's Tour**: Simulate a knight visiting every square on an 8x8 chessboard.
2.  **Largest Monotonically Increasing Subsequence (LMIS)**: Visualize the search for the longest increasing subsequence using a Tree structure.

## Architecture: Clean Architecture
We will separate the Domain Logic (Algorithms) from the UI (React Components).

### Directory Structure
```
src/
  ├── core/                 # Domain Layer (Business Logic)
  │   ├── algorithms/       
  │   │   ├── knightsTour.ts  # Warnsdorff's Algorithm / Backtracking
  │   │   └── lmis.ts         # Tree-based LMIS Algorithm
  │   └── types/            # Shared Types
  ├── presentation/         # UI Layer
  │   ├── components/       # Reusable Components
  │   │   ├── Chessboard/
  │   │   ├── TreeVisualizer/
  │   │   └── Layout/
  │   └── pages/
  │       ├── HomePage.tsx
  │       ├── KnightsTourPage.tsx
  │       └── LmisPage.tsx
  ├── App.tsx
  └── main.tsx
```

## Detailed Requirements

### Page 1: The Knight's Tour
*   **Input**: Starting position (e.g., coordinate or click on board).
*   **Features**:
    *   **Open Tour**: Knight ends at any square.
    *   **Closed Tour**: Knight ends at a square attacking the start square (completing a loop).
*   **Visualization**:
    *   8x8 Grid.
    *   Step-by-step animation of the knight's move.
    *   Numbering squares 1-64.

### Page 2: Largest Monotonically Increasing Subsequence (LMIS)
*   **Input**: Sequence of numbers (Default: `4, 1, 13, 7, 0, 2, 8, 11, 3`).
*   **Algorithm**: Use a Tree-based approach as requested by the prompt ("Aplikasi tree untuk mencari...").
    *   Each node represents a state in the subsequence formation.
    *   Visual representation of the tree structure.
    *   Highlighting the resulting longest path.

## Tech Stack
*   **Framework**: React (Vite) + TypeScript
*   **Styling**: Vanilla CSS (Modular & Clean)
*   **Routing**: React Router DOM

## Next Steps
1.  Initialize Vite Project (React + TS).
2.  Install `react-router-dom`.
3.  Implement Core Algorithms.
4.  Build UI Components.
