const RENT_FILTER_MIN = 49;
const RENT_FILTER_MAX = 2500;

export function formatBookPrice(price) {
  if (!Number.isFinite(price)) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getBookDailyPrice(book = {}) {
  return Number.isFinite(book?.pricePerDay) ? Number(book.pricePerDay) : 0;
}

export function getBookWeeklyPrice(book = {}) {
  const daily = getBookDailyPrice(book);
  return daily * 7;
}

export function getBookMonthlyPrice(book = {}) {
  const daily = getBookDailyPrice(book);
  return daily * 30;
}

export function getBookDepositAmount(book = {}) {
  return Number.isFinite(book?.depositAmount) ? Number(book.depositAmount) : 0;
}

export function getBookReplacementCost(book = {}) {
  return Number.isFinite(book?.replacementCost) ? Number(book.replacementCost) : 0;
}

export function getWeeklyRentFilterValue(bookOrPrice) {
  if (typeof bookOrPrice === "object" && bookOrPrice !== null) {
    return getBookWeeklyPrice(bookOrPrice);
  }

  if (!Number.isFinite(bookOrPrice)) {
    return RENT_FILTER_MIN;
  }

  return Math.min(RENT_FILTER_MAX, Math.max(RENT_FILTER_MIN, Math.round(bookOrPrice)));
}

export function getTotalRentPrice(book = {}, rentalType = "daily", rentalDuration = 1) {
  if (!Number.isFinite(rentalDuration) || rentalDuration < 1) {
    return 0;
  }

  const dailyPrice = getBookDailyPrice(book);
  const days = rentalType === "weekly" ? rentalDuration * 7 : rentalType === "monthly" ? rentalDuration * 30 : rentalDuration;
  return dailyPrice * days;
}

export function getRentalTotal(book = {}, rentalType = "daily", rentalDuration = 1) {
  return getTotalRentPrice(book, rentalType, rentalDuration) + getBookDepositAmount(book);
}

export function formatCategoryLabel(category = "") {
  if (!category) {
    return "Uncategorized";
  }

  return category
    .split("-")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" / ");
}

export function truncateText(value = "", maxLength = 110) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trim()}...`;
}

const BOOK_GRADIENTS = [
  "linear-gradient(135deg, #7C4F1E 0%, #C89A4F 100%)",
  "linear-gradient(135deg, #4B5D3B 0%, #8DA05D 100%)",
  "linear-gradient(135deg, #5D3E6A 0%, #A27AB5 100%)",
  "linear-gradient(135deg, #365B73 0%, #7FB8D6 100%)",
  "linear-gradient(135deg, #9A5733 0%, #E3B26B 100%)",
  "linear-gradient(135deg, #7B3F4C 0%, #D98B96 100%)",
];

const REVIEWER_NAMES = [
  "Aarav Mehta",
  "Diya Sharma",
  "Rohan Kulkarni",
  "Meera Joseph",
  "Ishaan Kapoor",
  "Naina Verma",
];

const REVIEW_TEMPLATES = [
  "A really satisfying read with a smooth pace and strong characters.",
  "Perfect for readers who want something immersive and easy to get lost in.",
  "The writing feels polished, and the overall reading experience is worth the rental.",
  "A dependable pick for anyone exploring this category for the first time.",
  "Well-balanced, memorable, and easy to recommend to fellow BookNest readers.",
  "The narrative stays engaging from start to finish and feels great for a weekend read.",
];

const WISHLIST_STORAGE_KEY = "booknest-wishlist";

function createSeed(value = "") {
  return Array.from(String(value)).reduce(
    (total, character, index) => total + character.charCodeAt(0) * (index + 1),
    0,
  );
}

function getBookSeed(book = {}) {
  return createSeed(book?._id || `${book?.title || ""}-${book?.author || ""}`);
}

export function getBookInitials(title = "") {
  const words = title
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  return (
    words
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() || "")
      .join("") || "BK"
  );
}

export function getBookGradient(seedValue = "") {
  return BOOK_GRADIENTS[createSeed(seedValue) % BOOK_GRADIENTS.length];
}

export function getBookRating(book = {}) {
  if (Number.isFinite(book?.averageRating)) {
    return Number(book.averageRating);
  }

  const seed = getBookSeed(book);
  return Number((4 + (seed % 9) / 10).toFixed(1));
}

export function getBookReviewCount(book = {}) {
  if (Number.isFinite(book?.totalReviews)) {
    return Number(book.totalReviews);
  }

  const seed = getBookSeed(book);
  return 48 + (seed % 420);
}

export function getBookPopularityScore(book = {}) {
  return getBookRating(book) * 100 + getBookReviewCount(book);
}

export function getBookAuthorBlurb(book = {}) {
  const category = formatCategoryLabel(book?.category || "general fiction").toLowerCase();

  return `${book?.author || "This author"} is featured on BookNest for readers who enjoy ${category} stories with immersive storytelling and accessible pacing. This profile is a curated frontend summary based on the current catalog entry.`;
}

export function getBookReviews(book = {}) {
  const seed = getBookSeed(book);

  return Array.from({ length: 3 }, (_, index) => {
    const reviewerIndex = (seed + index) % REVIEWER_NAMES.length;
    const templateIndex = (seed + index * 3) % REVIEW_TEMPLATES.length;
    const daysAgo = 4 + ((seed + index * 17) % 120);
    const reviewDate = new Date();

    reviewDate.setDate(reviewDate.getDate() - daysAgo);

    return {
      id: `${book?._id || "book"}-review-${index + 1}`,
      name: REVIEWER_NAMES[reviewerIndex],
      rating: Math.max(4, Math.min(5, Math.round(getBookRating(book)))),
      quote: `${REVIEW_TEMPLATES[templateIndex]} ${
        book?.title ? `"${truncateText(book.title, 40)}" makes it especially easy to recommend.` : ""
      }`.trim(),
      date: new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(reviewDate),
    };
  });
}

export function getPriceBounds(books = []) {
  if (!Array.isArray(books) || books.length === 0) {
    return {
      min: RENT_FILTER_MIN,
      max: 999,
    };
  }

  const weeklyPrices = books.map((book) => getWeeklyRentFilterValue(book)).filter(Number.isFinite);

  return {
    min: Math.min(...weeklyPrices, RENT_FILTER_MIN),
    max: Math.max(...weeklyPrices, 999),
  };
}

export function getBookCategoryCount(books = [], category = "") {
  return books.filter((book) => book?.category === category).length;
}

function readWishlistIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(WISHLIST_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeWishlistIds(ids) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
}

export function getWishlistIds() {
  return readWishlistIds();
}

export function isBookWishlisted(bookId) {
  return readWishlistIds().includes(bookId);
}

export function toggleWishlistBook(bookId) {
  const ids = readWishlistIds();
  const nextIds = ids.includes(bookId) ? ids.filter((id) => id !== bookId) : [...ids, bookId];

  writeWishlistIds(nextIds);
  return nextIds;
}
