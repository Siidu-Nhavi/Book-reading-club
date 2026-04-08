import { booksApi } from "../lib/api";
import { getBookCategoryCount } from "./books";

export async function fetchAllBooks(params = {}) {
  const allBooks = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const data = await booksApi.list({
      ...params,
      page,
      limit: 50,
    });

    allBooks.push(...(data.books || []));
    hasNextPage = Boolean(data.pagination?.hasNextPage);
    page += 1;
  }

  return allBooks;
}

export function buildCategorySummaries(categories = [], books = []) {
  return categories.map((category) => ({
    name: category,
    count: getBookCategoryCount(books, category),
  }));
}
