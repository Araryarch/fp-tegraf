export interface LmisNode {
  id: string;
  value: number;
  index: number;
  children: LmisNode[];
  isResult?: boolean; // Highlight for the longest path
}

export const DEFAULT_SEQUENCE = [4, 1, 13, 7, 0, 2, 8, 11, 3];

export function buildLmisTree(sequence: number[]): { root: LmisNode, longestPathNodes: Set<string> } {
  let nodeIdCounter = 0;
  
  // DP to find the length of LIS ending at each index effectively, 
  // but to build the tree we look forward.
  // Actually, standard LIS is usually solved from end or start. 
  // Let's use memoization to find the max length starting from index i.
  
  const memo: { [key: number]: number } = {};
  
  function getMaxLength(currentIndex: number): number {
    if (memo[currentIndex] !== undefined) return memo[currentIndex];
    
    let maxLen = 1;
    const currentVal = sequence[currentIndex];
    
    for (let i = currentIndex + 1; i < sequence.length; i++) {
        if (sequence[i] > currentVal) {
            maxLen = Math.max(maxLen, 1 + getMaxLength(i));
        }
    }
    memo[currentIndex] = maxLen;
    return maxLen;
  }
  
  // Calculate max length starting from each position to determine the best path
  const bestLengths = sequence.map((_, i) => getMaxLength(i));
  const overallMax = Math.max(...bestLengths);

  // Reconstruct the path(s) for highlighting
  const longestPathNodes = new Set<string>();

  // Helper to build tree nodes
  function buildNode(index: number, parentId: string): LmisNode {
    const id = `node-${index}-${nodeIdCounter++}`;
    const value = sequence[index];
    const node: LmisNode = {
      id,
      value,
      index,
      children: [],
      isResult: false
    };

    // Find children
    for (let i = index + 1; i < sequence.length; i++) {
      if (sequence[i] > value) {
        node.children.push(buildNode(i, id));
      }
    }
    return node;
  }
  
  // The 'Root' of the visualization usually connects to all possible starts
  // Or maybe valid starts for the optimal solution? The image shows a root connecting to many.
  // We'll create a virtual root.
  const root: LmisNode = {
    id: 'root',
    value: -Infinity, // Virtual
    index: -1,
    children: [],
    isResult: false
  };
  
  for (let i = 0; i < sequence.length; i++) {
      // Connect root to all nodes? Or just "roots" of increasing subsequences?
      // LIS definition: subsequence can start anywhere. 
      // Only add those that *can* be start of a chain? No, any number can be start.
      root.children.push(buildNode(i, 'root'));
  }
  
  // Now we need to mark the longest path in the tree
  // We need to match the tree nodes to the optimal path.
  // This is tricky because the tree has duplicated nodes (same index appearing in different branches).
  // The logic: If node X is on the longest path, one of its children Y must be such that 
  // len(X) = 1 + len(Y). and length matches overall max.
  
  function markLongestPath(node: LmisNode, targetLen: number): boolean {
    if (targetLen === 0) return true; // Consumed all length
    
    // For the virtual root, target is overallMax
    if (node.id === 'root') {
        for (const child of node.children) {
            if (bestLengths[child.index] === targetLen) {
                if (markLongestPath(child, targetLen)) {
                    // Start of a longest path
                    // We only need ONE longest path usually, but let's try to mark one.
                    return true;
                }
            }
        }
        return false;
    }

    // For normal nodes
    // Current node contributes 1 to length. 
    // Need to find child with bestLengths == targetLen - 1
    
    node.isResult = true;
    longestPathNodes.add(node.id);
    
    if (targetLen === 1) return true; // End of chain

    for (const child of node.children) {
        if (bestLengths[child.index] === targetLen - 1) {
            if (markLongestPath(child, targetLen - 1)) return true;
        }
    }
    
    // If we reached here, this branch didn't work out to the MAX length 
    // (Wait, 'bestLengths' is the max possible from this index. So it MUST work if we follow logic)
    // However, buildNode creates a fresh tree. Every 'child' corresponds to 'sequence[child.index]'.
    return false;
  }
  
  markLongestPath(root, overallMax);

  return { root, longestPathNodes };
}
