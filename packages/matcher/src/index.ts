interface TrieNode {
  children: Map<string, TrieNode>
  failure: TrieNode | null
  outputs: Array<{ id: string; length: number }>
}

export interface PatternMatch {
  id: string
  start: number
  end: number
}

export class AhoCorasick {
  private root: TrieNode = { children: new Map(), failure: null, outputs: [] }
  private built = false

  addPattern(id: string, text: string): void {
    if (this.built) throw new Error('Cannot add patterns after build()')
    const lower = text.toLowerCase()
    let node = this.root
    for (const char of lower) {
      if (!node.children.has(char)) {
        node.children.set(char, { children: new Map(), failure: null, outputs: [] })
      }
      node = node.children.get(char)!
    }
    node.outputs.push({ id, length: lower.length })
  }

  build(): void {
    if (this.built) return
    const queue: TrieNode[] = []

    // Depth-1 nodes fail back to root
    for (const child of this.root.children.values()) {
      child.failure = this.root
      queue.push(child)
    }

    while (queue.length > 0) {
      const curr = queue.shift()!
      for (const [char, child] of curr.children) {
        // Walk up failure chain from curr's failure until we find `char` or reach root
        let f = curr.failure!
        while (f !== this.root && !f.children.has(char)) f = f.failure!
        child.failure = f.children.get(char) ?? this.root
        // Avoid self-loop at root level
        if (child.failure === child) child.failure = this.root
        // Inherit suffix outputs (dictionary links)
        child.outputs = [...child.outputs, ...child.failure.outputs]
        queue.push(child)
      }
    }

    this.built = true
  }

  search(text: string): PatternMatch[] {
    if (!this.built) throw new Error('Call build() before search()')
    const lower = text.toLowerCase()
    const results: PatternMatch[] = []
    let node = this.root

    for (let i = 0; i < lower.length; i++) {
      const char = lower[i]
      // Follow failure links until we find a valid transition or reach root
      while (node !== this.root && !node.children.has(char)) node = node.failure!
      if (node.children.has(char)) node = node.children.get(char)!
      for (const { id, length } of node.outputs) {
        results.push({ id, start: i - length + 1, end: i + 1 })
      }
    }

    return results
  }
}
