const { paths } = require("../lib/config");
const { loadJsonFile } = require("../lib/fileLoader");
const { pickOne, randomInt } = require("../lib/random");

const REVIEWABLE_STATUSES = new Set(["returned", "flagged"]);

function buildReviews(rentals, count, rng) {
  const reviewTemplates = loadJsonFile(paths.sampleReviews).reviews || ["Great read."];
  const candidatePairs = new Map();

  rentals.forEach((rental) => {
    if (!REVIEWABLE_STATUSES.has(rental.status)) {
      return;
    }

    const key = `${String(rental.user)}|${String(rental.book)}`;

    if (!candidatePairs.has(key)) {
      candidatePairs.set(key, rental);
    }
  });

  const candidates = Array.from(candidatePairs.values());

  if (candidates.length < count) {
    throw new Error(
      `Not enough unique rental pairs for reviews. Needed ${count}, found ${candidates.length}`,
    );
  }

  for (let i = candidates.length - 1; i > 0; i--) {
    const j = randomInt(rng, 0, i);
    const temp = candidates[i];
    candidates[i] = candidates[j];
    candidates[j] = temp;
  }

  return candidates.slice(0, count).map((rental) => {
    const baseRating =
      rental.status === "flagged" ? randomInt(rng, 2, 4) : randomInt(rng, 3, 5);
    const rating = Math.min(5, Math.max(1, baseRating));

    return {
      user: rental.user,
      book: rental.book,
      rental: rental._id,
      rating,
      reviewText: pickOne(rng, reviewTemplates),
      isVerified: true,
      createdAt: new Date(Date.now() - randomInt(rng, 1, 140) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
  });
}

module.exports = {
  REVIEWABLE_STATUSES,
  buildReviews,
};
