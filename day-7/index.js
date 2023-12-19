import { run, ask, answer } from '../lib/utils.js';
import { multiply, sum } from '../lib/array.js';

// A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, or 2

// Five of a kind, where all five cards have the same label: AAAAA
// Four of a kind, where four cards have the same label and one card has a different label: AA8AA
// Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
// Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
// Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
// One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
// High card, where all cards' labels are distinct: 23456

const values1 = 'AKQJT98765432';
const values2 = 'AKQT98765432J';

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const isMatch = (a, matches = []) => matches.some((v) => isEqual(v, a));

const getRank = (hand, joker = '-') => {
  const pairs = Object.values(hand.cards).sort((a, b) => b - a);
  const jokers = hand.cards?.[joker] ?? 0;

  const checkJokers = (b, j) => isEqual(pairs, b) && (j || b).includes(jokers);

  // Five of a kind
  if (isEqual(pairs, [5]) || checkJokers([4, 1]) || checkJokers([3, 2])) {
    return 6;
  }

  // Four of a kind
  if (isEqual(pairs, [4, 1]) || checkJokers([3, 1, 1]) || checkJokers([2, 2, 1], [2])) {
    return 5;
  }

  // Full house
  if (isEqual(pairs, [3, 2]) || checkJokers([2, 2, 1], [1])) {
    return 4;
  }

  // Three of a kind
  if (isEqual(pairs, [3, 1, 1]) || checkJokers([2, 1, 1, 1], [2, 1])) {
    return 3;
  }

  // Two pair
  if (isEqual(pairs, [2, 2, 1])) {
    return 2;
  }

  // One pair
  if (isEqual(pairs, [2, 1, 1, 1]) || jokers === 1) {
    return 1;
  }

  return 0;
};

const parseHand = (data) => {
  const [hand, bidString] = data.split(/\s+/);

  const cards = hand.split('').reduce((res, card) => {
    const current = res?.[card] ?? 0;
    return { ...res, [card]: current + 1 };
  }, {});

  return { hand, bid: parseFloat(bidString), cards };
};

const sortHands = (cards, values, joker = '-') =>
  cards.sort((a, b) => {
    const rankA = getRank(a, joker);
    const rankB = getRank(b, joker);
    if (rankA === rankB) {
      for (let i = 0; i < a.hand.length; i++) {
        if (a.hand[i] === b.hand[i]) {
          continue;
        }
        return values.indexOf(a.hand[i]) - values.indexOf(b.hand[i]);
      }
    }

    return rankB - rankA;
  });

run(
  (input, example) => {
    const hands = input.split('\n').map((data) => parseHand(data));

    const sorted1 = sortHands(hands, values1);

    ask('Find the rank of every hand in your set. What are the total winnings?');
    const points1 = sorted1.map((hand, index) => hand.bid * (hands.length - index));
    answer(sum(points1));

    ask('Using the new joker rule, find the rank of every hand in your set. What are the new total winnings?');
    const sorted2 = sortHands(hands, values2, 'J');
    const points2 = sorted2.map((hand, index) => hand.bid * (hands.length - index));
    answer(sum(points2));
  },
  'input.txt',
  'example.txt'
);
