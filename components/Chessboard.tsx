import React from 'react';
import { motion } from 'framer-motion';

interface ChessboardProps {
  board: number[][]; // -1 for empty, 0-63 for move order
  startPos: { r: number, c: number } | null;
  onSquareClick: (r: number, c: number) => void;
  isSolving: boolean;
}

export const Chessboard: React.FC<ChessboardProps> = ({ board, startPos, onSquareClick, isSolving }) => {
  return (
    <div className="grid grid-cols-8 gap-1 p-2 bg-slate-800 rounded-lg shadow-2xl border-4 border-slate-700 w-fit mx-auto">
      {board.map((row, r) =>
        row.map((cell, c) => {
          const isBlack = (r + c) % 2 === 1;
          const isStart = startPos?.r === r && startPos?.c === c;
          const hasVisited = cell !== -1;
          const isCurrent = hasVisited && cell === Math.max(...board.flat());

          // Chess.com style colors (green/white theme default)
          const bgClass = isBlack ? 'bg-[#769656]' : 'bg-[#eeeed2]';
          // Use theme override if needed, but user asked for "chess.com" style specifically.
          // We can use a combination or just force these colors for the board itself.
          
          return (
            <div
              key={`${r}-${c}`}
              onClick={() => !isSolving && onSquareClick(r, c)}
              className={`
                w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
                flex items-center justify-center text-sm font-bold cursor-pointer relative z-10
                ${bgClass}
                ${isStart ? 'ring-4 ring-yellow-400 z-20' : ''}
              `}
            >
               {/* Coordinate labels (only on edges) */}
               {c === 0 && (
                   <span className={`absolute top-0.5 left-0.5 text-[10px] ${isBlack ? 'text-[#eeeed2]' : 'text-[#769656]'} font-bold`}>
                       {8 - r}
                   </span>
               )}
               {r === 7 && (
                   <span className={`absolute bottom-0.5 right-0.5 text-[10px] ${isBlack ? 'text-[#eeeed2]' : 'text-[#769656]'} font-bold`}>
                       {String.fromCharCode(97 + c)}
                   </span>
               )}

               {/* Visit Order Number (Subtle) */}
               {hasVisited && !isCurrent && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-black/30 font-bold text-lg select-none">{cell + 1}</span>
                </div>
               )}

               {/* Knight Piece - Realistic Style */}
               {isCurrent && (
                   <motion.div 
                     layoutId="knight-piece"
                     className="w-full h-full flex items-center justify-center drop-shadow-lg z-30"
                   >
                       {/* High quality Chess Knight SVG */}
                       <svg viewBox="0 0 45 45" className="w-[85%] h-[85%] fill-black stroke-white stroke-[1.5]">
                           <g>
                               <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" />
                               <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.17,5.37 16.5,4 16.5,4 C 16.5,4 14.07,4.5 15.24,6 C 16.37,7.197 22.84,13.95 24,18 Z" />
                               <path d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z" fill="white" stroke="none"/>
                               <path d="M 15 15.5 A 0.5 1.5 0 1 1 14,15.5 A 0.5 1.5 0 1 1 15 15.5 z" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" fill="white" stroke="none"/>
                           </g>
                       </svg>
                   </motion.div>
               )}
               
               {/* Path Dot for visited squares (Classic chess.com analysis style) */}
               {hasVisited && !isCurrent && (
                   <div className="w-3 h-3 rounded-full bg-black/20" />
               )}
            </div>
          );
        })
      )}
      
      {/* SVG Overlay for Path Lines */}
      {/* Use a cleaner stroke style */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
        {board.flat().some(v => v !== -1) && (
             <motion.path
                d={(() => {
                    const moves: {r: number, c: number, i: number}[] = [];
                    board.forEach((row, r) => row.forEach((val, c) => {
                        if (val !== -1) moves.push({ r, c, i: val });
                    }));
                    moves.sort((a, b) => a.i - b.i);
                    if (moves.length < 2) return "";
                    
                    const getCoords = (r: number, c: number) => {
                        return `${c * 12.5 + 6.25}% ${r * 12.5 + 6.25}%`;
                    };

                    let pathStr = `M ${getCoords(moves[0].r, moves[0].c)}`;
                    for (let i = 1; i < moves.length; i++) {
                        pathStr += ` L ${getCoords(moves[i].r, moves[i].c)}`;
                    }
                    return pathStr;
                })()}
                fill="none"
                stroke="var(--primary)" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2 }}
             />
        )}
      </svg>
    </div>
  );
};
