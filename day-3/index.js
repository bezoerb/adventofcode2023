import { run, ask, answer } from '../lib/utils.js';
import { sum } from '../lib/array.js';

run(
  (input, example) => {
    const lines = input.split('\n');
    const fields = lines.map((line) => line.split(''));

    const getItem = (x = 0, y = 0) => fields?.[y]?.[x] ?? '.';

    const isSign = (char) => !['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(char);
    const isGear = (char) => char === '*';

    const checkPosition = (x, y, range = 1) => {
      const items = [];
      for (let i = -1; i <= range; i++) {
        for (let j = -1; j <= 1; j++) {
          items.push(getItem(x + i, y + j));
        }
      }

      return items.some((item) => isSign(item));
    };

    const getLineNumbers = (y) => {
      const numbers = [];
      lines?.[y]?.replace(/(\d+)/g, (_, num, x) => {
        numbers.push({ x, y, num: parseFloat(num), length: num.length });
      });
      return numbers;
    };

    const getRearRatio = (gearX, gearY) => {
      const numbers = [...getLineNumbers(gearY - 1), ...getLineNumbers(gearY), ...getLineNumbers(gearY + 1)].filter(
        ({ x, length }) => {
          return x <= gearX + 1 && x + length >= gearX;
        }
      );

      if (numbers.length === 2) {
        return numbers[0].num * numbers[1].num;
      }

      return 0;
    };

    ask(`What is the sum of all of the part numbers in the engine schematic?`);
    const partNumbers = [];
    for (let y = 0; y < lines.length; y++) {
      getLineNumbers(y).forEach(({ num, x, length }) => {
        if (checkPosition(x, y, length)) {
          partNumbers.push(num);
        }
      });
    }

    answer(sum(partNumbers));

    ask('What is the sum of all of the gear ratios in your engine schematic?');
    const gearRatios = [];
    for (let y = 0; y < lines.length; y++) {
      for (let x = 0; x < lines[y].length; x++) {
        if (isGear(getItem(x, y))) {
          const ratio = getRearRatio(x, y);
          if (ratio) {
            gearRatios.push(ratio);
          }
        }
      }
    }

    answer(sum(gearRatios));
  },
  'input.txt',
  'example.txt'
);
