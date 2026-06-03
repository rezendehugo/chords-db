/* global it, describe, expect */

import cavaquinho from './cavaquinho';
import {
  strChord2array,
  chord2midi,
  processString,
  numberOfBarres,
  unique,
} from '../tools';

describe('cavaquinho Chords', () => {
  describe('Strings', () => {
    it('Should have 4 strings', () => expect(cavaquinho.main.strings).toEqual(4));
  });

  describe('Types', () => {
    cavaquinho.suffixes.map((suffix) =>
      it(`Type suffix ${suffix} should have a description`, () =>
        expect(suffix).toBeDefined())
    );
  });

  describe(`Test Cmajor midi notes`, () => {
    it(`Should generate valid MIDI notes`, () => {
      const Cmajor = cavaquinho.chords.C.find((chord) => chord.suffix === 'major');
      const midiNotes = chord2midi(
        processString(Cmajor.positions[0].frets),
        cavaquinho.tunings['standard']
      );
      expect(midiNotes.length).toBeGreaterThan(0);
      expect(
        midiNotes.every(
          (note) => Number.isInteger(note) && note >= 0 && note <= 127
        )
      ).toEqual(true);
    });
  });

  Object.keys(cavaquinho.chords).map((key) =>
    describe(`Key ${key} chords`, () => {
      const chords = cavaquinho.chords[key];

      it(`Should not have duplicated suffixes`, () => {
        let seen = new Set();
        const duplicates = chords.some(
          (chord) => seen.size === seen.add(chord.suffix).size
        );
        expect(duplicates).toBe(false);
      });

      it(`Should have every configured suffix`, () => {
        expect(chords.map((chord) => chord.suffix).sort()).toEqual(
          cavaquinho.suffixes.slice().sort()
        );
      });

      chords.map((chord) =>
        describe(`Chord ${chord.key}${chord.suffix}`, () => {
          describe('General properties', () => {
            it(`The chord ${key}${chord.suffix} should have a defined key property`, () =>
              expect(chord.key).toEqual(key.replace('sharp', '#')));
            it(`The chord ${key}${chord.suffix} should have a defined suffix property`, () =>
              expect(chord.suffix).toBeDefined());
            it(`The chord ${key}${chord.suffix} should have a list of positions`, () =>
              expect(chord.positions).toBeInstanceOf(Array));
            it(`The chord ${key}${chord.suffix} should have at least one position`, () =>
              expect(chord.positions.length).toBeGreaterThan(0));
          });

          describe(`Positions`, () => {
            it(`The chord ${key}${chord.suffix} should not have duplicated positions`, () => {
              const positions = chord.positions.map((position) =>
                JSON.stringify({
                  frets: position.frets,
                  fingers: position.fingers,
                  barres: position.barres || [],
                })
              );
              expect(new Set(positions).size).toEqual(positions.length);
            });

            chord.positions.map((position, index) => {
              const frets = Array.isArray(position.frets)
                ? position.frets
                : strChord2array(position.frets);
              describe(`Frets`, () => {
                it(`The ${
                  index + 1
                } position frets array should have 4 values`, () =>
                  expect(frets.length).toEqual(4));
                it(`The ${
                  index + 1
                } position frets array should have valid values`, () =>
                  expect(
                    frets.every(
                      (fret) => Number.isInteger(fret) && fret >= -1 && fret <= 24
                    )
                  ).toEqual(true));
                it(`The ${
                  index + 1
                } position frets array should have playable notes`, () =>
                  expect(frets.some((fret) => fret >= 0)).toEqual(true));
              });

              if (position.fingers) {
                describe(`Fingers`, () => {
                  const fingers = Array.isArray(position.fingers)
                    ? position.fingers
                    : strChord2array(position.fingers);
                  it(`The ${
                    index + 1
                  } position fingers array should have 4 values`, () =>
                    expect(fingers.length).toEqual(4));
                  it(`The ${
                    index + 1
                  } position fingers array should have values lower than 5`, () =>
                    expect(Math.max(...fingers)).toBeLessThan(5));
                  it(`The ${
                    index + 1
                  } position fingers array should have values higher or equal to 0`, () =>
                    expect(Math.min(...fingers)).toBeGreaterThanOrEqual(0));
                  });
              }

              describe(`Barres`, () => {
                if (position.fingers && !position.barres) {
                  it(`The ${index + 1} position needs a barres property`, () =>
                    expect(numberOfBarres(position.fingers)).toEqual(0));
                }

                if (!position.barres) {
                  it(`The ${
                    index + 1
                  } position doesn't need a capo property`, () =>
                    expect(position.capo).not.toEqual(true));
                }

                if (position.barres) {
                  const barres = Array.isArray(position.barres)
                    ? position.barres
                    : [position.barres];

                  it(`The ${
                    index + 1
                  } position with barres should define capo explicitly`, () =>
                    expect(typeof position.capo).toEqual('boolean'));

                  if (position.fingers) {
                    it(`The ${
                      index + 1
                    } position needs a barres property`, () =>
                      expect(numberOfBarres(position.fingers)).toEqual(
                        barres.length
                      ));
                  }

                  barres.map((barre) => {
                    it(`The barre at position ${
                      index + 1
                    } should have frets`, () =>
                      expect(frets.indexOf(barre)).not.toEqual(-1));
                    it(`The barre at position ${
                      index + 1
                    } should have two strings at least`, () =>
                      expect(frets.indexOf(barre)).not.toEqual(
                        frets.lastIndexOf(barre)
                      ));
                  });
                }
              });
            });

            describe('MIDI checks', () => {
              chord.positions.map((position, index) => {
                it(`The MIDI notes should be valid at position ${
                  index + 1
                }`, () => {
                  const notes = chord2midi(
                    processString(position.frets),
                    cavaquinho.tunings['standard']
                  );
                  expect(
                    notes.every(
                      (note) => Number.isInteger(note) && note >= 0 && note <= 127
                    )
                  ).toEqual(true);
                  expect(unique(notes).length).toBeGreaterThanOrEqual(
                    Math.min(notes.length, 3)
                  );
                });
              });
            });
          });
        })
      );
    })
  );
});
