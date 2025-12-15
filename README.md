# FP Tegraf Project

This project implements the solutions for the Graph Theory & Automata (Tegraf) practicum assignments (The Knight's Tour & LMIS).

## Features
1.  **The Knight's Tour (Warnsdorff's Algorithm)**:
    *   Simulates a knight visiting every square on an 8x8 chessboard exactly once.
    *   Supports Open Tour (end anywhere) and Closed Tour (end at a square attacking the start).
    *   Visualizes the path with step-by-step animation and connecting lines.

2.  **Largest Monotonically Increasing Subsequence (LMIS)**:
    *   Visualizes the recursive search tree for the Longest Increasing Subsequence problem.
    *   Highlights the resulting longest path in the tree.
    *   Allows custom integer sequence input.

## Tech Stack
*   **Framework**: Next.js 15 (React 19)
*   **Language**: TypeScript
*   **Styling**: TailwindCSS v4 + Vanilla CSS
*   **Animation**: Framer Motion
*   **Icons**: Lucide React

## How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    # or
    bun install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    # or
    bun dev
    ```

3.  **Open in Browser**:
    Navigate to [http://localhost:3000](http://localhost:3000).

## Usage Guide

### Knight's Tour Page
1.  Click on any square on the 8x8 grid to set the **Starting Position**.
2.  Toggle **"Closed Tour"** if you want the knight to attempt finding a path that loops back to the start.
3.  Click **"Start Tour"** to begin the simulation.
4.  Watch the animation as the knight moves. The path is drawn with lines, and squares are numbered 1-64.

### LMIS Page
1.  Enter a sequence of numbers separated by commas in the input field (e.g., `4, 1, 13, 7, 0, 2, 8, 11, 3`).
2.  Click **"Build Tree"** to generate the recursion tree structure.
3.  Click **"Find Longest Path"** to highlight the nodes that form the Maximum Monotonically Increasing Subsequence.

## Architecture
The project follows a Clean Architecture approach:
*   `core/`: Contains pure algorithms (`knightsTour.ts`, `lmis.ts`).
*   `components/`: Contains UI components (`Chessboard`, `TreeVisualizer`).
*   `app/`: Contains page logic and routing.
