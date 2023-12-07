import { run, ask, answer } from '../lib/utils.js';
import { stripIndents } from 'common-tags';
import { sum, multiply } from '../lib/array.js';

run(
  (input, example) => {
    const lines = input.split('\n');

    ask(stripIndents`
      Determine which games would have been possible if the bag had been loaded
      with only 12 red cubes, 13 green cubes, and 14 blue cubes. 
      What is the sum of the IDs of those games?
    `);

    const limits = { red: 12, green: 13, blue: 14 };

    const getId = (line) => {
      const [, id] = /Game (\d+)/.exec(line);
      return parseFloat(id);
    };
    const count = (line) => {
      const result = {};
      const regexp = new RegExp(`(\\\d+)\\\s+(${Object.keys(limits).join('|')})`, 'g');
      line.replaceAll(regexp, (_, value, color) => {
        const cnt = result?.[color] ?? 0;
        result[color] = cnt + parseFloat(value);
      });

      return result;
    };

    const check = (current, limits) =>
      !Object.entries(current).some(([color, cnt]) => !limits[color] || limits[color] < cnt);

    const filtered = lines.filter((line) => line.split(';').every((subset) => check(count(subset), limits)));
    const ids = filtered.map((line) => getId(line));

    answer(sum(ids));

    ask(stripIndents`
      For each game, find the minimum set of cubes that must have been present.
      What is the sum of the power of these sets?
    `);

    const getPower = (line) => {
      const [result, ...subsets] = line.split(';').map((subset) => count(subset));
      for (const subset of subsets) {
        for (const [color, cnt] of Object.entries(subset)) {
          if ((result[color] || 0) < cnt) {
            result[color] = cnt;
          }
        }
      }
      return multiply(Object.values(result));
    };

    const powers = lines.map((line) => getPower(line));

    answer(sum(powers));
  },
  'input.txt',
  'example.txt'
);
