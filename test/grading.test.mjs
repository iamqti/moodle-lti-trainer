import test from 'node:test';
import assert from 'node:assert/strict';
import { grade, normalize, tasks } from '../src/grading.mjs';
test('normalization and zero score', () => {
  assert.equal(normalize('  POST  '), 'post');
  assert.equal(grade({ q1: '', q2: '', q3: '' }).scoreGiven, 0);
});
test('maximum and partial result', () => {
  const answers = Object.fromEntries(tasks.map(t => [t.id, t.answer]));
  assert.equal(grade(answers).scoreGiven, 10);
  assert.equal(grade(answers).scoreMaximum, 10);
  answers.q2 = '__wrong__';
  assert.equal(grade(answers).scoreGiven, 7);
});
test('invalid answers cannot become grades', () => {
  assert.throws(() => grade({ q1: 'post', q2: 'object' }));
  assert.throws(() => grade({ q1: [], q2: 'object', q3: 'ags' }));
  assert.throws(() => grade({ q1: 'x'.repeat(201), q2: 'object', q3: 'ags' }));
});
test('only q1 correct (HTTP header) gives 3 of 10, case/whitespace insensitive', () => {
  const result = grade({ q1: '  Authorization  ', q2: 'wrong', q3: 'wrong' });
  assert.equal(result.scoreGiven, 3);
  assert.equal(result.items.find(i => i.id === 'q1').correct, true);
});
