import { run, ask, answer } from '../lib/utils.js';
import { sum, intersect } from '../lib/array.js';

const parse = (string) => {
  const [name, numbers] = string.split(':');
  const [, index] = name.split(/\s+/);
  const [part1, part2] = numbers.split('|');
  const winningNumbers = part1
    .trim()
    .split(/\s+/)
    .map((num) => parseFloat(num));
  const ownedNumbers = part2
    .trim()
    .split(/\s+/)
    .map((num) => parseFloat(num));

  const winners = intersect(winningNumbers, ownedNumbers);

  return { name, index: parseFloat(index), winners, points: winners.length ? Math.pow(2, winners.length - 1) : 0 };
};

run(
  (input, example) => {
    const cards = input.split('\n').map((line) => parse(line));
    const points = cards.map((card) => card.points);

    ask('How many points are they worth in total?');
    answer(sum(points));

    ask('how many total scratchcards do you end up with?');
    const counter = Array(cards.length).fill(1);
    cards.forEach((card, index) => {
      const count = card.winners.length;
      const inc = counter[index];
      for (let i = index + 1; i <= index + count; i++) {
        counter[i] = counter[i] + inc;
      }
    });

    answer(sum(counter));
    
  },
  'input.txt',
  'example.txt'
);
