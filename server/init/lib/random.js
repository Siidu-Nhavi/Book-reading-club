function createRng(seed) {
  let current = seed >>> 0;

  return function rng() {
    current += 0x6d2b79f5;
    let t = current;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pickOne(rng, values) {
  return values[randomInt(rng, 0, values.length - 1)];
}

module.exports = {
  createRng,
  pickOne,
  randomInt,
};
