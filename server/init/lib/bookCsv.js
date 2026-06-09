const { calculateBookPricing } = require("../../utils/categoryPricing.js");
const { normalizeCategory } = require("./text");

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
  const category = normalizeCategory(row.category);
  const pricing = calculateBookPricing({
    basePrice: normalizedPrice,
    category,
  });

  return {
    title: row.name || row.title || "Untitled",
    author: row.author || "Unknown",
    description:
      row.description ||
      `Format: ${row.format || "N/A"}. ISBN: ${row.isbn || "N/A"}. Rating: ${row.book_depository_stars || "N/A"}`,
    rentPrice: pricing.rentPrice,
    pricePerDay: pricing.pricePerDay,
    depositAmount: pricing.depositAmount,
    replacementCost: pricing.replacementCost,
    image: row.image || "",
    isAvailable: true,
    unavailabilityReason: "none",
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

    if (doc.image) {
      docs.push(doc);
    }
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

function removeSeedOnlyBookFields(book) {
  const { _sourceRating, ...document } = book;
  return document;
}

module.exports = {
  parseCsvToBooks,
  removeSeedOnlyBookFields,
  selectBalancedPopularBooks,
};
