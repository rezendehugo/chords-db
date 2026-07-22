import { chordDefinitions, fretValues, isReusableVoicing } from './chordTheory';

const derivedSuffixes = [
  'm6',
  'add9',
  '7sus4',
  'aug',
  '69',
  'm9',
  'maj9',
  'madd9',
];

const positionIdentity = (position) => fretValues(position).join(':');

const clonePosition = (position) => ({
  ...position,
  frets: [...fretValues(position)],
  fingers: Array.isArray(position.fingers)
    ? [...position.fingers]
    : position.fingers,
  barres: Array.isArray(position.barres)
    ? [...position.barres]
    : position.barres,
});

const matchingPositions = (positions, key, suffix) => [
  ...new Map(
    positions
      .filter((position) => isReusableVoicing(position, key, suffix))
      .map((position) => [positionIdentity(position), clonePosition(position)])
  ).values(),
];

export function deriveSuffixVoicings(chordsByKey) {
  const sourcePositions = Object.values(chordsByKey).flatMap((chords) =>
    chords.flatMap((chord) => chord.positions)
  );

  return Object.fromEntries(
    Object.entries(chordsByKey).map(([key, chords]) => [
      key,
      chords.concat(
        derivedSuffixes.map((suffix) => ({
          key,
          suffix,
          positions: matchingPositions(sourcePositions, key, suffix),
        }))
      ),
    ])
  );
}

export { chordDefinitions };
