import { useEffect, useMemo, useState } from "react";
import { booksApi } from "../lib/api";

export default function useBooks(queryParams = {}) {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalBooks: 0,
    limit: 12,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const requestKey = useMemo(() => {
    const params = new URLSearchParams();

    Object.entries(queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value
          .filter((item) => item !== undefined && item !== null && item !== "")
          .forEach((item) => params.append(key, String(item)));
        return;
      }

      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    });

    return params.toString();
  }, [queryParams]);

  useEffect(() => {
    let isMounted = true;

    const loadBooks = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await booksApi.list(queryParams);

        if (!isMounted) {
          return;
        }

        setBooks(response.books || []);
        setPagination({
          page: response.pagination?.page || 1,
          totalPages: response.pagination?.totalPages || 1,
          totalBooks: response.pagination?.totalBooks || 0,
          limit: response.pagination?.limit || 12,
          hasNextPage: Boolean(response.pagination?.hasNextPage),
          hasPreviousPage: Boolean(response.pagination?.hasPreviousPage),
        });
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(requestError.message || "Unable to load books.");
        setBooks([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBooks();

    return () => {
      isMounted = false;
    };
  }, [queryParams, requestKey]);

  return {
    books,
    loading,
    error,
    ...pagination,
  };
}
