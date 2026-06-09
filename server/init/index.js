require("dotenv").config();

const path = require("path");
const connectDB = require("../config/db");
const Book = require("../models/Book");
const Rental = require("../models/Rental");
const Review = require("../models/Review");
const User = require("../models/User");
const {
  parseCsvToBooks,
  removeSeedOnlyBookFields,
  selectBalancedPopularBooks,
} = require("./lib/bookCsv");
const { demoPasswordEnvKey, paths, rngSeed, targets } = require("./lib/config");
const { readTextFile } = require("./lib/fileLoader");
const { createRng } = require("./lib/random");
const { syncDerivedFields } = require("./seeders/derivedFields");
const { buildRentals } = require("./seeders/rentals");
const { buildReviews } = require("./seeders/reviews");
const { buildAdminUser, buildDemoUsers } = require("./seeders/users");

async function clearExistingSeedData() {
  console.log(
    "Fresh-seed mode active. Clearing existing data for reviews, rentals, users, and books.",
  );

  await Review.deleteMany({});
  await Rental.deleteMany({});
  await User.deleteMany({});
  await Book.deleteMany({});
}

function loadBooks() {
  const csvData = readTextFile(paths.booksCsv);
  const parsedBooks = parseCsvToBooks(csvData);

  return selectBalancedPopularBooks(parsedBooks, targets.books).map(removeSeedOnlyBookFields);
}

async function seedDatabase() {
  const rng = createRng(rngSeed);
  const books = loadBooks();

  if (books.length === 0) {
    console.log("No valid rows found to insert.");
    return null;
  }

  await clearExistingSeedData();

  const insertedBooks = await Book.insertMany(books, { ordered: false });
  const demoUsersPayload = await buildDemoUsers(targets.users, rng);
  const insertedDemoUsers = await User.insertMany(demoUsersPayload, { ordered: true });
  await User.create(await buildAdminUser());
  const rentalsPayload = buildRentals(insertedDemoUsers, insertedBooks, targets.rentals, rng);
  const insertedRentals = await Rental.insertMany(rentalsPayload, { ordered: true });
  const reviewsPayload = buildReviews(insertedRentals, targets.reviews, rng);
  const insertedReviews = await Review.insertMany(reviewsPayload, { ordered: true });

  await syncDerivedFields();

  return {
    books: insertedBooks.length,
    users: insertedDemoUsers.length + 1,
    rentals: insertedRentals.length,
    reviews: insertedReviews.length,
  };
}

function logSeedSummary(summary) {
  if (!summary) {
    return;
  }

  console.log("Initialization complete.");
  console.log(`Books inserted: ${summary.books}`);
  console.log(`Users inserted: ${summary.users} (includes 1 admin user)`);
  console.log("Admin credentials: email=admin@gmail.com, password=default@1234");
  console.log(`Rentals inserted: ${summary.rentals}`);
  console.log(`Reviews inserted: ${summary.reviews}`);
  console.log(`Demo password source: ${demoPasswordEnvKey}`);
}

async function initialize() {
  try {
    await connectDB();

    console.log("Database connection established.");
    console.log(`Using CSV file: ${path.basename(paths.booksCsv)}`);

    const summary = await seedDatabase();
    logSeedSummary(summary);
  } catch (error) {
    console.error("Initialization failed:", error);
    process.exit(1);
  }
}

initialize();
