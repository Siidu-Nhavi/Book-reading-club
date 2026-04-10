require("dotenv").config();
const connectDB = require("../config/db");
const fs = require("fs");
const path = require("path");
const Book = require("../models/Book");
const User = require("../models/User");
const Rental = require("../models/Rental");
const Review = require("../models/Review");
const { generateSalt, hashPassword } = require("../utils/security.js");

const csvFilePath = path.join(__dirname, "updated_main.csv");
const sampleUsersPath = path.join(__dirname, "sampleUsers.json");
const sampleReviewsPath = path.join(__dirname, "sampleReviews.json");

const TARGET_BOOKS = 200;
const TARGET_USERS = 80;
const TARGET_RENTALS = 400;
const TARGET_REVIEWS = 320;
const DEMO_PASSWORD_ENV_KEY = "SEED_DEMO_PASSWORD";
const RNG_SEED = 20260410;

const ACTIVE_STATUSES = new Set(["active", "overdue"]);
const REVIEWABLE_STATUSES = new Set(["returned", "penalised"]);

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

function normalizeCategory(value) {
  const trimmed = String(value || "").trim();
  return trimmed || "Uncategorized";
}

function parseRating(value) {
  const parsed = Number.parseFloat(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(5, parsed));
}

function splitCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result.map((value) => value.trim());
}

function toBookDocument(row) {
  const parsedPrice = Number.parseFloat(row.price);
  const normalizedPrice = Number.isFinite(parsedPrice) ? parsedPrice : 0;
  const rentPrice = Number(normalizedPrice.toFixed(2));
  const category = normalizeCategory(row.category);
  const penaltyPerDay = Math.max(10, Math.round(rentPrice * 0.15));
  const depositRequired = Math.round(rentPrice * 2);

  return {
    title: row.name || row.title || "Untitled",
    author: row.author || "Unknown",
    description:
      row.description ||
      `Format: ${row.format || "N/A"}. ISBN: ${row.isbn || "N/A"}. Rating: ${row.book_depository_stars || "N/A"}`,
    rentPrice,
    depositRequired,
    penaltyPerDay,
    image: row.image || "",
    isAvailable: true,
    category,
    averageRating: 0,
    totalReviews: 0,
    _sourceRating: parseRating(row.book_depository_stars),
  };
}

function parseCsvToBooks(csvData) {
  const lines = csvData
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return [];
  }

  const headers = splitCsvLine(lines[0]);
  const docs = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvLine(lines[i]);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    const doc = toBookDocument(row);

    if (!doc.image) {
      continue;
    }

    docs.push(doc);
  }

  return docs;
}

function bookSortComparator(left, right) {
  if (right._sourceRating !== left._sourceRating) {
    return right._sourceRating - left._sourceRating;
  }

  const leftTitle = left.title.toLowerCase();
  const rightTitle = right.title.toLowerCase();

  if (leftTitle !== rightTitle) {
    return leftTitle.localeCompare(rightTitle);
  }

  return left.author.toLowerCase().localeCompare(right.author.toLowerCase());
}

function selectBalancedPopularBooks(allBooks, targetCount) {
  if (allBooks.length <= targetCount) {
    return allBooks;
  }

  const grouped = new Map();

  allBooks.forEach((book) => {
    const category = normalizeCategory(book.category);

    if (!grouped.has(category)) {
      grouped.set(category, []);
    }

    grouped.get(category).push(book);
  });

  const categoryNames = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b));

  categoryNames.forEach((category) => {
    grouped.get(category).sort(bookSortComparator);
  });

  const selected = [];
  const selectedKeys = new Set();
  const categoryIndices = new Map(categoryNames.map((name) => [name, 0]));

  while (selected.length < targetCount) {
    let addedInRound = false;

    for (const category of categoryNames) {
      if (selected.length >= targetCount) {
        break;
      }

      const books = grouped.get(category);
      const currentIndex = categoryIndices.get(category) || 0;

      if (currentIndex >= books.length) {
        continue;
      }

      const candidate = books[currentIndex];
      categoryIndices.set(category, currentIndex + 1);

      const key = `${candidate.title}|${candidate.author}|${candidate.image}`;

      if (selectedKeys.has(key)) {
        continue;
      }

      selected.push(candidate);
      selectedKeys.add(key);
      addedInRound = true;
    }

    if (!addedInRound) {
      break;
    }
  }

  if (selected.length < targetCount) {
    const leftovers = allBooks
      .filter((book) => !selectedKeys.has(`${book.title}|${book.author}|${book.image}`))
      .sort(bookSortComparator);

    for (const book of leftovers) {
      if (selected.length >= targetCount) {
        break;
      }

      selected.push(book);
    }
  }

  return selected.slice(0, targetCount);
}

function loadJsonFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

function normalizeSlug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function buildUsers(count, rng) {
  const password = process.env[DEMO_PASSWORD_ENV_KEY];

  if (!password) {
    throw new Error(`Missing required env var: ${DEMO_PASSWORD_ENV_KEY}`);
  }

  const profileData = loadJsonFile(sampleUsersPath);
  const firstNames = profileData.firstNames || ["Reader"];
  const lastNames = profileData.lastNames || ["User"];
  const cities = profileData.cities || ["Mumbai"];
  const bios = profileData.bios || ["Avid reader"];
  const streets = profileData.streets || ["Main Road"];

  const users = [];

  for (let index = 0; index < count; index++) {
    const firstName = pickOne(rng, firstNames);
    const lastName = pickOne(rng, lastNames);
    const city = pickOne(rng, cities);
    const bio = pickOne(rng, bios);
    const street = pickOne(rng, streets);
    const suffix = String(index + 1).padStart(3, "0");

    const salt = await generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    const role = index === 0 ? "admin" : "user";
    const hasPaidDeposit = index % 4 !== 0;

    users.push({
      name: `${firstName} ${lastName}`,
      email: `${normalizeSlug(firstName)}.${normalizeSlug(lastName)}.${suffix}@demo.local`,
      password: hashedPassword,
      salt,
      role,
      depositAmount: hasPaidDeposit ? randomInt(rng, 200, 1200) : 0,
      depositStatus: hasPaidDeposit ? "paid" : "pending",
      activeRentalsCount: 0,
      maxRentalsAllowed: randomInt(rng, 4, 8),
      isSuspended: index !== 0 && index % 23 === 0,
      profile: {
        avatarUrl: "",
        bio,
        mobileNumber: `9${String(randomInt(rng, 100000000, 999999999))}`,
        address: `${street}, ${city}`,
      },
    });
  }

  return users;
}

function chooseRentalStatus(rng) {
  const value = rng();

  if (value < 0.28) {
    return "active";
  }

  if (value < 0.73) {
    return "returned";
  }

  return "penalised";
}

function buildRentals(users, books, count, rng) {
  const now = Date.now();
  const rentals = [];
  const activeCountByUser = new Map(users.map((user) => [String(user._id), 0]));

  let guard = 0;

  while (rentals.length < count) {
    guard += 1;

    if (guard > count * 100) {
      throw new Error("Unable to generate rental set with current constraints");
    }

    const user = pickOne(rng, users);
    const userId = String(user._id);
    const status = chooseRentalStatus(rng);
    const currentActive = activeCountByUser.get(userId) || 0;

    if (status === "active" && (currentActive >= user.maxRentalsAllowed || user.isSuspended)) {
      continue;
    }

    const book = pickOne(rng, books);
    const startDate = new Date(now - randomInt(rng, 1, 160) * 24 * 60 * 60 * 1000);
    const dueDate = new Date(startDate.getTime() + randomInt(rng, 7, 21) * 24 * 60 * 60 * 1000);

    let returnedDate = null;
    let overdueDays = 0;
    let penaltyAmount = 0;
    let penaltyPaid = false;
    let depositRefunded = false;

    if (status === "returned") {
      returnedDate = new Date(
        startDate.getTime() + randomInt(rng, 4, 18) * 24 * 60 * 60 * 1000,
      );
      overdueDays = Math.max(0, Math.ceil((returnedDate - dueDate) / (24 * 60 * 60 * 1000)));
      penaltyAmount = overdueDays * book.penaltyPerDay;
      penaltyPaid = penaltyAmount === 0 || rng() > 0.2;
      depositRefunded = penaltyAmount === 0 || penaltyPaid;
    }

    if (status === "penalised") {
      const overdue = randomInt(rng, 1, 12);
      overdueDays = overdue;
      returnedDate = new Date(dueDate.getTime() + overdue * 24 * 60 * 60 * 1000);
      penaltyAmount = overdueDays * book.penaltyPerDay;
      penaltyPaid = rng() > 0.4;
      depositRefunded = penaltyPaid && rng() > 0.35;
    }

    rentals.push({
      user: user._id,
      book: book._id,
      status,
      startDate,
      dueDate,
      returnedDate,
      overdueDays,
      penaltyAmount,
      penaltyPaid,
      depositRefunded,
    });

    if (ACTIVE_STATUSES.has(status)) {
      activeCountByUser.set(userId, currentActive + 1);
    }
  }

  return rentals;
}

function buildReviews(users, rentals, count, rng) {
  const reviewTemplates = loadJsonFile(sampleReviewsPath).reviews || ["Great read."];

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

  return candidates.slice(0, count).map((rental, index) => {
    const baseRating = rental.status === "penalised" ? randomInt(rng, 2, 4) : randomInt(rng, 3, 5);
    const rating = Math.min(5, Math.max(1, baseRating));
    const reviewText = pickOne(rng, reviewTemplates);

    return {
      user: rental.user,
      book: rental.book,
      rental: rental._id,
      rating,
      reviewText,
      isVerified: true,
      createdAt: new Date(Date.now() - randomInt(rng, 1, 140) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
  });
}

async function syncDerivedFields() {
  const [reviewStats, activeRentalStats] = await Promise.all([
    Review.aggregate([
      {
        $group: {
          _id: "$book",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]),
    Rental.aggregate([
      {
        $match: {
          status: { $in: ["active", "overdue"] },
        },
      },
      {
        $group: {
          _id: "$user",
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  await Promise.all([
    Book.updateMany({}, { $set: { averageRating: 0, totalReviews: 0, isAvailable: true } }),
    User.updateMany({}, { $set: { activeRentalsCount: 0 } }),
  ]);

  if (reviewStats.length > 0) {
    await Book.bulkWrite(
      reviewStats.map((stat) => ({
        updateOne: {
          filter: { _id: stat._id },
          update: {
            $set: {
              averageRating: Number(stat.averageRating.toFixed(2)),
              totalReviews: stat.totalReviews,
            },
          },
        },
      })),
    );
  }

  if (activeRentalStats.length > 0) {
    await User.bulkWrite(
      activeRentalStats.map((stat) => ({
        updateOne: {
          filter: { _id: stat._id },
          update: { $set: { activeRentalsCount: stat.count } },
        },
      })),
    );

    const activeBookIds = await Rental.distinct("book", {
      status: { $in: ["active", "overdue"] },
    });

    if (activeBookIds.length > 0) {
      await Book.updateMany(
        { _id: { $in: activeBookIds } },
        { $set: { isAvailable: false } },
      );
    }
  }
}

async function initialize() {
  try {
    await connectDB();
    const rng = createRng(RNG_SEED);

    console.log("Database connection established.");
    console.log(`Using CSV file: ${path.basename(csvFilePath)}`);

    const csvData = fs.readFileSync(csvFilePath, "utf-8");
    const parsedBooks = parseCsvToBooks(csvData);
    const books = selectBalancedPopularBooks(parsedBooks, TARGET_BOOKS).map((book) => {
      const { _sourceRating, ...rest } = book;
      return rest;
    });

    if (books.length === 0) {
      console.log("No valid rows found to insert.");
      return;
    }

    console.log(
      `Fresh-seed mode active. Clearing existing data for reviews, rentals, users, and books.`,
    );

    await Review.deleteMany({});
    await Rental.deleteMany({});
    await User.deleteMany({});
    await Book.deleteMany({});

    const insertedBooks = await Book.insertMany(books, { ordered: false });
    const usersPayload = await buildUsers(TARGET_USERS, rng);
    const insertedUsers = await User.insertMany(usersPayload, { ordered: true });

    const rentalsPayload = buildRentals(insertedUsers, insertedBooks, TARGET_RENTALS, rng);
    const insertedRentals = await Rental.insertMany(rentalsPayload, { ordered: true });

    const reviewsPayload = buildReviews(insertedUsers, insertedRentals, TARGET_REVIEWS, rng);
    const insertedReviews = await Review.insertMany(reviewsPayload, { ordered: true });

    await syncDerivedFields();

    console.log("Initialization complete.");
    console.log(`Books inserted: ${insertedBooks.length}`);
    console.log(`Users inserted: ${insertedUsers.length}`);
    console.log(`Rentals inserted: ${insertedRentals.length}`);
    console.log(`Reviews inserted: ${insertedReviews.length}`);
    console.log(`Demo password source: ${DEMO_PASSWORD_ENV_KEY}`);
  } catch (error) {
    console.error("Initialization failed:", error);
    process.exit(1);
  }
}

initialize();