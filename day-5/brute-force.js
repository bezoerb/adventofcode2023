import { run, ask, answer } from '../lib/utils.js';
import { sum, intersect } from '../lib/array.js';

const line2numbers = (line) =>
  line
    .split(/\s+/)
    .map((num) => parseFloat(num))
    .filter((v) => !isNaN(v));

const convert = (maps) =>
  maps.map((part) => {
    const [, ...rawMapping] = part.split('\n');
    return rawMapping.map((line) => line2numbers(line));
  });

const map = (num, maps) => {
  for (const mapping of maps) {
    const [dr, sr, l] = mapping;
    if (num >= sr && num < sr + l) {
      return dr + num - sr;
    }
  }
  return num;
};

run(
  (input, example) => {
    ask('What is the lowest location number that corresponds to any of the initial seed numbers? (1)');

    const [seedPart, ...mapsPart] = input.split('\n\n');
    const [initial, ...maps] = convert(mapsPart);
    const seeds = line2numbers(seedPart);

    const process = (num) => {
      let result = map(num, initial);
      for (const mapping of maps) {
        result = map(result, mapping);
      }

      return result;
    };

    let result1 = Infinity;
    for (let i = 0; i < seeds.length; i++) {
      const tmp = process(seeds[i], maps);
      if (tmp < result1) {
        result1 = tmp;
      }
    }

    answer(result1);

    ask('What is the lowest location number that corresponds to any of the initial seed numbers? (2)');

    let result2 = Infinity;
    for (let i = 0; i < seeds.length; i += 2) {
      const [start, length] = seeds.slice(i, i + 2);
      console.log(`Computing seed range ${(i/2) + 1}/${seeds.length/2}`);
      for (let j = start; j < start + length; j++) {
        const tmp = process(j, maps);
        if (tmp < result2) {
          result2 = tmp;
        }
      }
    }

    answer(result2);
  },
  'input.txt',
  'example.txt'
);
