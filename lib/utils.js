import { readFile } from 'fs/promises';
import { fileURLToPath } from 'node:url';
import callsite from 'callsite';
import { dirname, relative } from 'path';
import pico from 'picocolors';

export async function run(callback = () => true, ...files) {
  const stack = callsite();
  const [, tmp] = stack || [];
  if (files.length === 0) {
    files = ['input.txt'];
  }

  if (!tmp) {
    throw new Error('Could not be called directly');
  }

  try {
    const root = dirname(fileURLToPath(tmp.getFileName()));

    const inputs = await Promise.all(files.map((file) => readFile(root + `/${file}`, 'utf-8')));
    await callback(...inputs);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

export function ask(str) {
  return console.log(pico.cyan(`\n${str}`));
}
export function answer(str) {
  return console.log(pico.green(pico.bold(str)));
}
