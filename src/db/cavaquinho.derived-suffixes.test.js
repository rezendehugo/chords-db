/* global describe, expect, it */

import cavaquinho from './cavaquinho';
import suffixes from './cavaquinho/suffixes';

const getChord = (key, suffix) =>
  cavaquinho.chords[key].find((chord) => chord.suffix === suffix);

describe('cavaquinho derived suffixes', () => {
  it('publishes every reviewed suffix definition', () => {
    expect(suffixes).toEqual(
      expect.arrayContaining([
        'm6',
        'add9',
        '7sus4',
        'aug',
        '69',
        'm9',
        'maj9',
        'madd9',
      ])
    );
  });

  it.each(['m6', 'add9'])('provides %s shapes for every key', (suffix) => {
    Object.keys(cavaquinho.chords).forEach((key) => {
      expect(getChord(key, suffix).positions.length).toBeGreaterThan(0);
    });
  });

  it('reuses valid sixth voicings for 6/9 without external notes', () => {
    Object.keys(cavaquinho.chords).forEach((key) => {
      expect(getChord(key, '69').positions.length).toBeGreaterThan(0);
    });
  });

  it.each(['aug', 'm9', 'maj9', 'madd9'])(
    'does not invent %s shapes when the source corpus has no compatible voicing',
    (suffix) => {
      Object.keys(cavaquinho.chords).forEach((key) => {
        expect(getChord(key, suffix).positions).toEqual([]);
      });
    }
  );
});
