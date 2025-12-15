import React from 'react';
import { motion } from 'framer-motion';
import { LmisNode } from '@/core/algorithms/lmis';

interface TreeVisualizerProps {
  node: LmisNode;
  isRoot?: boolean;
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ node, isRoot = false }) => {
  return (
    <div className="flex flex-col items-center">
      {!isRoot && (
        <div className="h-8 w-px bg-slate-500 my-1" />
      )}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`
          flex items-center justify-center w-10 h-10 rounded-full border-2 
          ${node.isResult 
            ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
            : 'bg-slate-800 border-slate-600 text-slate-300'
          }
          font-bold z-10 relative
        `}
      >
        {node.value === -Infinity ? 'R' : node.value}
      </motion.div>

      {node.children.length > 0 && (
        <div className="flex flex-row gap-4 mt-1 relative pt-2">
            {/* Top connecting line logic is handled by parent, but we need lines to children */}
            {/* Simple CSS-only approach for tree lines is hard with flex. 
                But for this task, a simple flex row is "Clean" enough if aligned.
            */}
          {node.children.map((child) => (
            <div key={child.id} className="flex flex-col items-center">
              {/* Connector lines are tricky in pure flex. 
                  We'll just stack 'TreeVisualizer' components recursively.
                  The vertical line above the child is handled by the child itself (!isRoot check).
                  The horizontal bar connecting them requires a wrapper.
               */}
               <TreeVisualizer node={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
