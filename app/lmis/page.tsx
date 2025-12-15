'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Network, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { buildLmisTree, LmisNode, DEFAULT_SEQUENCE } from '@/core/algorithms/lmis';
import { calculateTreeLayout, TreeNode } from '@/core/algorithms/treeLayout';
import { motion, AnimatePresence } from 'framer-motion';

export default function LmisPage() {
  const [inputStr, setInputStr] = useState(DEFAULT_SEQUENCE.join(', '));
  const [layout, setLayout] = useState<{ root: TreeNode, width: number, height: number } | null>(null);
  const [transform, setTransform] = useState({ x: 50, y: 50, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Validate and parse input
  const sequence = useMemo(() => {
    try {
      return inputStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    } catch {
      return [];
    }
  }, [inputStr]);

  const handleBuild = () => {
    if (sequence.length === 0) return;
    const { root } = buildLmisTree(sequence);
    const layoutData = calculateTreeLayout(root);
    setLayout(layoutData);
    setTransform({ x: 50, y: 50, scale: 1 }); // Reset view
  };

  // Zoom / Pan Handlers
  const handleWheel = (e: React.WheelEvent) => {
      const zoomSensitivity = 0.001;
      const newScale = Math.min(Math.max(0.1, transform.scale - e.deltaY * zoomSensitivity), 5);
      setTransform(prev => ({ ...prev, scale: newScale }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return;
      
      // Use movementX/Y for robust delta updates regardless of absolute positioning
      setTransform(prev => ({
          ...prev,
          x: prev.x + e.movementX,
          y: prev.y + e.movementY
      }));
  };

  const handleMouseUp = () => {
      setIsDragging(false);
  };
  
  // Custom Node Component
  const Node = ({ node }: { node: TreeNode }) => {
      const isRoot = node.index === -1;
      const isResult = node.isResult;

      return (
        <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ 
                left: node.x, 
                top: node.y, 
                width: 50, 
                height: 50,
                zIndex: 10
            }}
        >
            <div 
                className={`
                    w-12 h-12 rounded-full flex items-center justify-center 
                    border-[2px] shadow-lg select-none
                    ${isResult 
                        ? 'bg-primary border-primary-foreground text-primary-foreground' 
                        : isRoot 
                            ? 'bg-muted border-muted-foreground text-foreground' 
                            : 'bg-card border-secondary text-foreground'
                    }
                `}
                style={{
                    boxShadow: isResult ? '0 0 10px var(--primary)' : '0 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                <span className="font-mono font-bold text-lg pointer-events-none">
                    {node.value === -Infinity ? 'S' : node.value}
                </span>
            </div>
        </div>
      );
  };

  // Custom Recursive Link Renderer
  const Links = ({ node }: { node: TreeNode }) => {
      return (
          <>
            {node.children.map(child => (
                <React.Fragment key={child.id}>
                    <path
                        d={`M ${node.x} ${node.y} C ${node.x} ${node.y + 50}, ${child.x} ${child.y - 50}, ${child.x} ${child.y}`}
                        fill="none"
                        stroke={child.isResult && node.isResult ? "var(--primary)" : "var(--border)"}
                        strokeWidth={child.isResult && node.isResult ? "3" : "2"}
                        strokeDasharray={child.isResult && node.isResult ? "none" : "5,5"}
                        style={{ opacity: 0.6 }}
                    />
                    <Links node={child} />
                </React.Fragment>
            ))}
          </>
      );
  };

  // Prepare flat list for rendering nodes on top of SVG
  const getAllNodes = (node: TreeNode): TreeNode[] => {
      let nodes = [node];
      for(const child of node.children) {
          nodes = [...nodes, ...getAllNodes(child)];
      }
      return nodes;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-8 flex flex-col items-center transition-colors duration-300">
      <div className="w-full max-w-6xl flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={20} /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-foreground">
            Monotonically Increasing Subsequence
        </h1>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-6 h-[80vh]">
        {/* Controls */}
        <div className="bg-card p-6 rounded-lg border border-border flex flex-col md:flex-row gap-6 items-end shrink-0 shadow-sm transition-colors duration-300">
            <div className="flex-1 w-full">
                <label className="block text-sm text-muted-foreground mb-2">Input Sequence</label>
                <input 
                    type="text" 
                    value={inputStr}
                    onChange={(e) => setInputStr(e.target.value)}
                    className="w-full bg-background border border-border rounded px-4 py-3 text-lg font-mono tracking-wide focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                    placeholder="e.g. 4, 1, 13, 7, 0, 2"
                />
            </div>
            
            <div className="flex gap-3">
                 <button
                    onClick={handleBuild}
                    className="bg-primary hover:opacity-90 text-primary-foreground px-6 py-3 rounded font-bold flex items-center gap-2 transition-all shadow-md"
                >
                    <Network size={18} /> Build Tree
                </button>
            </div>
        </div>

        {/* Visualization Area */}
        <div className="bg-muted/10 border border-border rounded-lg flex-1 overflow-hidden relative shadow-inner flex flex-col">
             {/* Toolbar */}
             <div className="absolute top-4 right-4 flex gap-2 z-20">
                 <button onClick={() => setTransform(t => ({...t, scale: Math.min(t.scale + 0.1, 5)}))} className="p-2 bg-card border border-border rounded hover:bg-muted text-foreground transition-colors"><ZoomIn size={16}/></button>
                 <button onClick={() => setTransform(t => ({...t, scale: Math.max(t.scale - 0.1, 0.1)}))} className="p-2 bg-card border border-border rounded hover:bg-muted text-foreground transition-colors"><ZoomOut size={16}/></button>
                 <button onClick={() => setTransform({ x: 50, y: 50, scale: 1 })} className="p-2 bg-card border border-border rounded hover:bg-muted text-foreground transition-colors"><RotateCcw size={16}/></button>
             </div>

             <div 
                className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--muted)_1px,_transparent_1px)] bg-[length:20px_20px]"
                ref={containerRef}
                style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
             >
                 {layout ? (
                     <>
                         <div 
                            className={`relative origin-top-left ${isDragging ? '' : 'transition-transform duration-200 ease-out z-10'}`}
                            style={{ 
                                width: Math.max(layout.width + 100, containerRef.current?.clientWidth || 0), 
                                height: Math.max(layout.height + 100, containerRef.current?.clientHeight || 0),
                                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                                transformOrigin: '0 0',
                                minWidth: '100%',
                                minHeight: '100%'
                            }}
                         >
                            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                                <Links node={layout.root} />
                            </svg>
                            
                            {getAllNodes(layout.root).map((node) => (
                                <Node key={node.id} node={node} />
                            ))}
                         </div>

                         {/* Detailed Legend & Instructions Panel */}
                         <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-4">
                             {/* Key Legend */}
                             <div className="bg-card/95 backdrop-blur shadow-2xl border border-border p-4 rounded-xl flex flex-col gap-3 min-w-[200px]">
                                 <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 uppercase tracking-wider text-xs opacity-70">
                                     Node Key
                                 </h3>
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 animate-pulse-subtle">
                                         <span className="text-primary-foreground font-mono text-xs font-bold">5</span>
                                     </div>
                                     <div className="flex flex-col">
                                         <span className="text-sm font-bold text-foreground">Result Node</span>
                                         <span className="text-xs text-muted-foreground">Part of the Longest Sequence</span>
                                     </div>
                                 </div>
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-card border-2 border-secondary flex items-center justify-center shadow-sm">
                                         <span className="text-foreground font-mono text-xs font-bold">3</span>
                                     </div>
                                     <div className="flex flex-col">
                                         <span className="text-sm font-bold text-foreground">Normal Node</span>
                                         <span className="text-xs text-muted-foreground">Standard Recursion Step</span>
                                     </div>
                                 </div>
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-muted border border-muted-foreground flex items-center justify-center">
                                         <span className="text-muted-foreground font-mono text-xs font-bold">S</span>
                                     </div>
                                     <div className="flex flex-col">
                                         <span className="text-sm font-bold text-foreground">Start Node</span>
                                         <span className="text-xs text-muted-foreground">Tree Root (Index -1)</span>
                                     </div>
                                 </div>
                             </div>

                             {/* Interaction Help */}
                             <div className="bg-card/95 backdrop-blur shadow-xl border border-border p-3 rounded-xl flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="p-1 bg-muted rounded border border-border font-mono">Drag</div>
                                    <span>to move/pan canvas</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="p-1 bg-muted rounded border border-border font-mono">Scroll</div>
                                    <span>to zoom in/out</span>
                                </div>
                             </div>
                         </div>
                     </>
                 ) : (
                     <div className="flex flex-col items-center justify-center text-muted-foreground h-full w-full pointer-events-none select-none">
                         <Network size={64} className="mb-4 opacity-20" />
                         <p>Enter a sequence and click "Build Tree"</p>
                     </div>
                 )}
             </div>
        </div>
      </div>
    </div>
  );
}
