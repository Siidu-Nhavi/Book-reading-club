const path = require("path");

const DATA_DIR = path.resolve(__dirname, "..");

module.exports = {
  paths: {
    booksCsv: path.join(DATA_DIR, "updated_main.csv"),
    sampleUsers: path.join(DATA_DIR, "sampleUsers.json"),
    sampleReviews: path.join(DATA_DIR, "sampleReviews.json"),
  },
  targets: {
    books: 200,
    users: 80,
    rentals: 400,
    reviews: 280,
  },
  demoPasswordEnvKey: "SEED_DEMO_PASSWORD",
  rngSeed: 20260410,
};
