import { useEffect, useState } from "react";
import { booksApi } from "../lib/api";

export default function useBookById(bookId) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!bookId) {
      setBook(null);
      setLoading(false);
      setError("");
      return;
    }

    let isMounted = true;

    const loadBook = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await booksApi.getById(bookId);

        if (!isMounted) {
          return;
        }

        setBook(response.book || null);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(requestError.message || "Unable to load this book.");
        setBook(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBook();

    return () => {
      isMounted = false;
    };
  }, [bookId]);

  return { book, loading, error };
}
