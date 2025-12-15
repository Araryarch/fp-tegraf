'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, RotateCcw, CheckCircle, XCircle, MousePointer2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Chessboard } from '@/components/Chessboard';
import { solveKnightsTour, Position } from '@/core/algorithms/knightsTour';

const BOARD_SIZE = 8;

export default function KnightsTourPage() {
  const [board, setBoard] = useState<number[][]>(Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(-1)));
  const [startPos, setStartPos] = useState<Position | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'solving' | 'completed' | 'failed'>('idle');
  const [speed, setSpeed] = useState<number>(200);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const handleSquareClick = (r: number, c: number) => {
    if (isSolving) return;
    setStartPos({ r, c });
    setBoard(Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(-1)));
    setStatus('idle');
  };

  const startTour = async () => {
    if (!startPos) return;
    
    setIsSolving(true);
    setStatus('solving');
    setBoard(Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(-1)));

    // Run Algorithm
    const path = solveKnightsTour(startPos, isClosed);

    if (!path || path.length === 0) {
        setStatus('failed');
        setIsSolving(false);
        return;
    }

    // Animate
    let step = 0;
    const animate = () => {
        if (step >= path.length) {
            setIsSolving(false);
            setStatus('completed');
            return;
        }

        const { r, c } = path[step];
        setBoard(prev => {
            const newBoard = prev.map(row => [...row]);
            newBoard[r][c] = step;
            return newBoard;
        });

        step++;
        animationRef.current = setTimeout(animate, speed); 
    };

    animate();
  };

  const reset = () => {
    if (animationRef.current) clearTimeout(animationRef.current);
    setIsSolving(false);
    setStartPos(null);
    setBoard(Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(-1)));
    setStatus('idle');
  };
  
  // Clean up
  useEffect(() => {
      return () => {
          if (animationRef.current) clearTimeout(animationRef.current);
      }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-8 flex flex-col items-center transition-colors duration-300">
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={20} /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-foreground">
            The Knight's Tour
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 w-full max-w-6xl items-start justify-center">
        {/* Controls */}
        <div className="flex flex-col gap-6 w-full lg:w-1/3 bg-card p-6 rounded-xl border border-border shadow-xl transition-colors duration-300">
            <div>
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-foreground">
                    <MousePointer2 size={20} className="text-primary"/> 
                    Instructions
                </h2>
                <p className="text-muted-foreground text-sm">
                    Select a starting square on the board, choose the mode, and watch the Knight visit every square exactly once!
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border border-border">
                    <span className="text-foreground">Strategy</span>
                    <span className="text-xs bg-card px-2 py-1 rounded text-primary font-mono border border-border">Warnsdorff's Rule</span>
                </div>
                
                <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border border-border">
                    <span className="text-foreground">Closed Tour</span>
                    <button 
                        onClick={() => !isSolving && setIsClosed(!isClosed)}
                        className={`w-12 h-6 rounded-full relative transition-colors ${isClosed ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    >
                        <motion.div 
                            className="absolute top-1 w-4 h-4 bg-primary-foreground rounded-full shadow-md"
                            animate={{ left: isClosed ? 'calc(100% - 1.25rem)' : '0.25rem' }}
                        />
                    </button>
                </div>

                <div className="flex flex-col gap-2 bg-muted/50 p-3 rounded-lg border border-border">
                    <span className="text-sm font-bold text-muted-foreground mb-1">Animation Speed</span>
                    <div className="flex gap-2">
                        {[
                            { label: 'Slow', val: 500 },
                            { label: 'Normal', val: 200 },
                            { label: 'Fast', val: 50 },
                            { label: 'Hyper', val: 10 }
                        ].map((s) => (
                            <button
                                key={s.label}
                                onClick={() => setSpeed(s.val)}
                                disabled={isSolving}
                                className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${speed === s.val ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card text-muted-foreground hover:bg-muted-foreground/10'}`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={startTour}
                        disabled={!startPos || isSolving}
                        className="flex-1 bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
                    >
                       {isSolving ? 'Running...' : <><Play size={18} /> Start Tour</>}
                    </button>
                    <button
                        onClick={reset}
                        disabled={isSolving}
                         className="px-4 bg-muted hover:bg-muted/80 disabled:opacity-50 text-muted-foreground rounded-lg font-bold flex items-center justify-center transition-all border border-border"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            {/* Status Display */}
            <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30 min-h-[100px] flex items-center justify-center text-center shadow-inner">
                 {status === 'idle' && !startPos && <span className="text-muted-foreground">Pick a starting square</span>}
                 {status === 'idle' && startPos && <span className="text-primary font-medium">Ready to start at {String.fromCharCode(97 + startPos.c)}{8 - startPos.r}</span>}
                 {status === 'solving' && <span className="text-secondary animate-pulse">Calculating path...</span>}
                 {status === 'completed' && (
                     <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-1 text-primary">
                         <CheckCircle size={32} />
                         <span className="font-bold">Tour Completed!</span>
                     </motion.div>
                 )}
                 {status === 'failed' && (
                     <div className="flex flex-col items-center gap-1 text-red-500">
                         <XCircle size={32} />
                         <span className="font-bold">No Solution Found</span>
                     </div>
                 )}
            </div>
        </div>

        {/* Board */}
        <div className="flex-1 flex justify-center perspective-1000">
             <Chessboard 
                board={board} 
                startPos={startPos} 
                onSquareClick={handleSquareClick}
                isSolving={isSolving}
             />
        </div>
      </div>
    </div>
  );
}
