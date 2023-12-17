import { run, ask, answer } from '../lib/utils.js';
import { multiply } from '../lib/array.js';

const calc = (time, distance) => {
  let min = 0;
  let max = time;

  for (let i = 1; i < time; i++) {
    const d = (time - i) * i;
    if (d > distance) {
      min = i;
      break;
    }
  }

  for (let i = time; i > 0; i--) {
    const d = (time - i) * i;
    if (d > distance) {
      max = i + 1;
      break;
    }
  }

  return max - min;
};

const parse = (input) => {
  const [, time] = /time:\s+(.*)$/gim.exec(input);
  const [, distance] = /distance:\s+(.*)$/gim.exec(input);
  return { time, distance };
};

run(
  (input, example) => {
    const { time, distance } = parse(input);

    const times = time.split(/\s+/).map((num) => parseFloat(num));
    const distances = distance.split(/\s+/).map((num) => parseFloat(num));

    const races = times.map((time, i) => ({
      time,
      distance: distances[i],
    }));

    ask('What do you get if you multiply these numbers together?');

    const numbers = races.map((race) => calc(race.time, race.distance));
    answer(multiply(numbers));

    ask('How many ways can you beat the record in this one much longer race?');
    answer(calc(parseFloat(time.replace(/\s*/g, '')), parseFloat(distance.replace(/\s*/g, ''))));
  },
  'input.txt',
  'example.txt'
);
