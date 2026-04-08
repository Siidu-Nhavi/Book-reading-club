require("dotenv").config();
const connectDB = require("../config/db");
const fs = require("fs");
const path = require("path");
const Book = require("../models/Book");

const csvFilePath = path.join(__dirname, "updated_main.csv");

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

  return {
    title: row.name || row.title || "Untitled",
    author: row.author || "Unknown",
    description:
      row.description ||
      `Format: ${row.format || "N/A"}. ISBN: ${row.isbn || "N/A"}. Rating: ${row.book_depository_stars || "N/A"}`,
    price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
    image: row.image || "",
    isAvailable: true,
    category: row.category || "Uncategorized",
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

async function initialize() {
  try {
    await connectDB();
    console.log("Database connection established.");

    console.log(`Using CSV file: ${path.basename(csvFilePath)}`);

    const csvData = fs.readFileSync(csvFilePath, "utf-8");

    const books = parseCsvToBooks(csvData);
    if (!books.length) {
      console.log("No valid rows found to insert.");
      return;
    }

    const result = await Book.insertMany(books, { ordered: false });
    console.log(`Inserted ${result.length} books.`);

    console.log("Initialization complete.");
  } catch (error) {
    console.error("Initialization failed:", error);
    process.exit(1);
  }
}

initialize();