import { run, ask, answer } from '../lib/utils.js';
import { sum } from '../lib/array.js';

const extractNums = (lines, cb = (v) => v) =>
  lines.map((lineraw) => {
    const line = cb(lineraw);
    const [, num1] = line.match(/^\D*(\d)/) || [, 0];
    const [, num2] = line.match(/(\d)\D*$/) || [, 0];
    return parseFloat(`${num1}${num2}`);
  });

const split = (text) => text.split('\n');

run(
  (input, example1, example2) => {
    ask('1: What is the sum of all of the calibration values?');
    answer(sum(extractNums(split(input))));

    ask('2: What is the sum of all of the calibration values?');

    const mapping = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
    };

    const nums = Object.keys(mapping).join('|');

    const regexp = new RegExp(`(${nums})`, 'ig');

    // need to match things like "eighthree" to 83 or "sevenine" to 79
    const replace = (string) => {
      while (regexp.test(string || '')) {
        string = string.replace(regexp, (_, key) => mapping[key] + key.slice(-1));
      }

      return string;
    };
    
    answer(sum(extractNums(split(input), replace)));
  },
  'input.txt',
  'example1.txt',
  'example2.txt'
);
