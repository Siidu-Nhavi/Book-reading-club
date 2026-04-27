import { apiRequest, buildQueryString } from "./client";

const sortByMap = {
  newest: "createdAt",
  latest: "createdAt",
};

function normalizeImageUrl(value = "") {
  const image = String(value || "").trim();

  if (!image) {
    return "";
  }

  if (/^(https?:|data:|blob:)/i.test(image)) {
    return image;
  }

  if (image.startsWith("/")) {
    const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
    return base ? `${base}${image}` : image;
  }

  return image;
}

function normalizeBook(book = {}) {
  return {
    ...book,
    price: Number.isFinite(book?.pricePerWeek) ? book.pricePerWeek : book?.price,
    image: normalizeImageUrl(book?.image || book?.coverImage || book?.thumbnail || book?.coverUrl || ""),
  };
}

async function hydrateBooksWithDetails(books = []) {
  const missingImageIds = books
    .filter((book) => !book?.image && book?._id)
    .map((book) => book._id);

  if (missingImageIds.length === 0) {
    return books;
  }

  const details = await Promise.all(
    missingImageIds.map(async (id) => {
      try {
        const data = await apiRequest(`/api/books/${id}`);
        const book = data?.book ? data.book : data;
        return [id, normalizeBook(book)];
      } catch {
        return null;
      }
    }),
  );

  const detailMap = new Map(details.filter(Boolean));

  return books.map((book) => {
    const hydrated = detailMap.get(book?._id);

    if (!hydrated) {
      return book;
    }

    return {
      ...book,
      image: hydrated.image || book.image || "",
      depositAmount: hydrated.depositAmount ?? book.depositAmount,
      replacementCost: hydrated.replacementCost ?? book.replacementCost,
      pricePerDay: hydrated.pricePerDay ?? book.pricePerDay,
      pricePerWeek: hydrated.pricePerWeek ?? book.pricePerWeek,
      pricePerMonth: hydrated.pricePerMonth ?? book.pricePerMonth,
      totalReviews: hydrated.totalReviews ?? book.totalReviews,
    };
  });
}

function normalizeBookListResponse(data = {}) {
  const total = Number(data?.total || 0);
  const page = Number(data?.page || 1);
  const limit = Number(data?.limit || 12);
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));

  return {
    ...data,
    books: Array.isArray(data?.books) ? data.books.map(normalizeBook) : [],
    pagination: {
      page,
      limit,
      totalBooks: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

function normalizeParams(params = {}) {
  const normalized = { ...params };

  if (normalized.sortBy && sortByMap[normalized.sortBy]) {
    normalized.sortBy = sortByMap[normalized.sortBy];
  }

  if (normalized.availability === "available") {
    normalized.available = true;
    delete normalized.availability;
  } else if (normalized.availability === "coming_soon") {
    normalized.available = false;
    delete normalized.availability;
  }

  if (normalized.sortBy === "price_asc") {
    normalized.sortBy = "pricePerDay";
    normalized.order = "asc";
  } else if (normalized.sortBy === "price_desc") {
    normalized.sortBy = "pricePerDay";
    normalized.order = "desc";
  } else if (normalized.sortBy === "top_rated") {
    normalized.sortBy = "averageRating";
    normalized.order = "desc";
  }

  return normalized;
}

export const booksApi = {
  async getBooks(params = {}) {
    const query = buildQueryString(normalizeParams(params));
    const data = await apiRequest(`/api/books${query}`);
    const normalized = normalizeBookListResponse(data);
    const shouldHydrateImages =
      normalized.books.length > 0 &&
      normalized.books.length <= 20 &&
      normalized.books.some((book) => !book?.image && book?._id);

    if (!shouldHydrateImages) {
      return normalized;
    }

    const hydratedBooks = await hydrateBooksWithDetails(normalized.books);
    return { ...normalized, books: hydratedBooks };
  },
  getBookCategories() {
    return apiRequest("/api/books/categories");
  },
  async getBookById(id) {
    const data = await apiRequest(`/api/books/${id}`);
    const book = data?.book ? data.book : data;
    return { book: normalizeBook(book) };
  },
};
