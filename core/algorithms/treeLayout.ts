import { LmisNode } from "./lmis";

export interface TreeNode extends LmisNode {
  x: number;
  y: number;
  width: number; // Subtree width
  children: TreeNode[];
}

// Simple layout settings
const NODE_SIZE = 50;
const GAP_X = 20;
const GAP_Y = 100;

export function calculateTreeLayout(root: LmisNode): { root: TreeNode, width: number, height: number } {
  // 1. Convert to TreeNode (clone)
  const mapNode = (node: LmisNode, depth: number): TreeNode => ({
    ...node,
    x: 0,
    y: depth * GAP_Y,
    width: 0,
    children: node.children.map(c => mapNode(c, depth + 1))
  });

  const treeRoot = mapNode(root, 0);

  // 2. Post-order traversal to calculate subtree widths and initial X positions
  // We'll store "left boundary" and "right boundary" effectively by just summing widths
  
  let maxX = 0;
  let maxY = 0;

  // This simple algorithm places all leaves 1 unit apart, then centers parents.
  // It handles the basic requirements well.
  
  let currentLeafX = 0;

  function firstPass(node: TreeNode) {
    if (node.children.length === 0) {
      // Leaf
      node.x = currentLeafX;
      node.width = NODE_SIZE + GAP_X;
      currentLeafX += NODE_SIZE + GAP_X;
    } else {
      // Internal
      node.children.forEach(firstPass);
      // Center over children
      const firstChild = node.children[0];
      const lastChild = node.children[node.children.length - 1];
      node.x = (firstChild.x + lastChild.x) / 2;
    }
    // Track bounds
    maxX = Math.max(maxX, node.x);
    maxY = Math.max(maxY, node.y);
  }

  firstPass(treeRoot);

  return { 
    root: treeRoot, 
    width: maxX + NODE_SIZE + GAP_X, // Add padding
    height: maxY + NODE_SIZE + GAP_Y 
  };
}
