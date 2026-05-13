import { describe, it, expect } from 'vitest'
import { AhoCorasick, fuzzyMatchVenue } from './index'

describe('AhoCorasick', () => {
  // ── 空输入 ──────────────────────────────────────────────────────────────────
  it('returns empty array for empty text', () => {
    const ac = new AhoCorasick()
    ac.addPattern('a', 'hello')
    ac.build()
    expect(ac.search('')).toEqual([])
  })

  it('returns empty array when no patterns were added', () => {
    const ac = new AhoCorasick()
    ac.build()
    expect(ac.search('hello world')).toEqual([])
  })

  it('returns empty array when text has no matches', () => {
    const ac = new AhoCorasick()
    ac.addPattern('kw1', 'hello')
    ac.build()
    expect(ac.search('goodbye world')).toEqual([])
  })

  // ── 单词匹配 ────────────────────────────────────────────────────────────────
  it('matches a single keyword and returns correct positions', () => {
    const ac = new AhoCorasick()
    ac.addPattern('kw1', 'hello')
    ac.build()
    expect(ac.search('say hello world')).toEqual([{ id: 'kw1', start: 4, end: 9 }])
  })

  it('matches keyword at the start of text', () => {
    const ac = new AhoCorasick()
    ac.addPattern('kw1', 'hello')
    ac.build()
    expect(ac.search('hello world')).toEqual([{ id: 'kw1', start: 0, end: 5 }])
  })

  it('matches keyword at the end of text', () => {
    const ac = new AhoCorasick()
    ac.addPattern('kw1', 'world')
    ac.build()
    expect(ac.search('hello world')).toEqual([{ id: 'kw1', start: 6, end: 11 }])
  })

  // ── 多词匹配 ────────────────────────────────────────────────────────────────
  it('matches multiple distinct keywords in one pass', () => {
    const ac = new AhoCorasick()
    ac.addPattern('kw1', 'foo')
    ac.addPattern('kw2', 'bar')
    ac.build()
    const results = ac.search('foo and bar')
    expect(results).toHaveLength(2)
    expect(results).toContainEqual({ id: 'kw1', start: 0, end: 3 })
    expect(results).toContainEqual({ id: 'kw2', start: 8, end: 11 })
  })

  it('matches same keyword appearing multiple times', () => {
    const ac = new AhoCorasick()
    ac.addPattern('kw1', 'cat')
    ac.build()
    const results = ac.search('cat and cat')
    expect(results).toHaveLength(2)
    expect(results[0]).toEqual({ id: 'kw1', start: 0, end: 3 })
    expect(results[1]).toEqual({ id: 'kw1', start: 8, end: 11 })
  })

  // ── 重叠词 ──────────────────────────────────────────────────────────────────
  it('detects overlapping patterns (classic: ushers)', () => {
    const ac = new AhoCorasick()
    ac.addPattern('p1', 'he')
    ac.addPattern('p2', 'she')
    ac.addPattern('p3', 'hers')
    ac.build()
    // "ushers": she@[1,4), he@[2,4), hers@[2,6)
    const results = ac.search('ushers')
    expect(results).toContainEqual({ id: 'p2', start: 1, end: 4 })
    expect(results).toContainEqual({ id: 'p1', start: 2, end: 4 })
    expect(results).toContainEqual({ id: 'p3', start: 2, end: 6 })
    expect(results).toHaveLength(3)
  })

  it('detects overlapping patterns with shared suffix', () => {
    const ac = new AhoCorasick()
    ac.addPattern('long', 'abcde')
    ac.addPattern('short', 'cde')
    ac.build()
    const results = ac.search('abcde')
    expect(results).toHaveLength(2)
    expect(results).toContainEqual({ id: 'long', start: 0, end: 5 })
    expect(results).toContainEqual({ id: 'short', start: 2, end: 5 })
  })

  // ── 大小写不敏感 ────────────────────────────────────────────────────────────
  it('is case-insensitive for text', () => {
    const ac = new AhoCorasick()
    ac.addPattern('kw1', 'bitcoin')
    ac.build()
    expect(ac.search('BITCOIN rises')).toHaveLength(1)
    expect(ac.search('Bitcoin rises')).toHaveLength(1)
    expect(ac.search('BiTcOiN rises')).toHaveLength(1)
  })

  it('is case-insensitive for patterns', () => {
    const ac = new AhoCorasick()
    ac.addPattern('kw1', 'Bitcoin')
    ac.build()
    expect(ac.search('bitcoin price')).toHaveLength(1)
    expect(ac.search('BITCOIN price')).toHaveLength(1)
  })

  // ── 错误处理 ────────────────────────────────────────────────────────────────
  it('throws if addPattern is called after build', () => {
    const ac = new AhoCorasick()
    ac.build()
    expect(() => ac.addPattern('x', 'test')).toThrow('Cannot add patterns after build()')
  })

  it('throws if search is called before build', () => {
    const ac = new AhoCorasick()
    ac.addPattern('x', 'test')
    expect(() => ac.search('test')).toThrow('Call build() before search()')
  })

  it('build() is idempotent', () => {
    const ac = new AhoCorasick()
    ac.addPattern('kw1', 'hello')
    ac.build()
    ac.build() // should not throw
    expect(ac.search('hello')).toHaveLength(1)
  })
})

describe('ThaiNight venue fuzzy matching', () => {
  it('matches exact venue names inside text', () => {
    const match = fuzzyMatchVenue('Any update on Nana Plaza tonight?', [
      { slug: 'nana-plaza', name: 'Nana Plaza', city: 'bangkok' },
    ])
    expect(match?.venue.slug).toBe('nana-plaza')
    expect(match?.score).toBe(1)
  })

  it('matches venue names by token overlap', () => {
    const match = fuzzyMatchVenue('Is Rabbit Hole still open in Thonglor?', [
      { slug: 'rabbit-hole-bar-eatery', name: 'Rabbit Hole Bar & Eatery' },
    ])
    expect(match?.venue.slug).toBe('rabbit-hole-bar-eatery')
    expect(match?.score).toBeGreaterThanOrEqual(0.75)
  })
})
