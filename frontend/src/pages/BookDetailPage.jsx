import { useEffect, useMemo, useState } from "react";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import BookCard from "../components/books/BookCard";
import BookDetailColumns from "../components/books/BookDetailColumns";
import BookMedia from "../components/books/BookMedia";
import EmptyState from "../components/common/EmptyState";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import AvailabilityBadge from "../components/common/AvailabilityBadge";
import RatingStars from "../components/common/RatingStars";
import { reviewsApi } from "../api";
import { booksApi } from "../lib/api";
import { useAuth } from "../context/useAuth";
import usePageTitle from "../hooks/usePageTitle";
import {
  formatBookPrice,
  formatCategoryLabel,
  getBookAuthorBlurb,
  getBookDailyPrice,
  getBookDepositAmount,
  // getBookMonthlyPrice,
  getBookRating,
  // getBookReplacementCost,
  getBookReviewCount,
  getBookReviews,
  // getBookWeeklyPrice,
  getWishlistIds,
  toggleWishlistBook,
} from "../utils/books";
import {
  PUBLIC_BUTTON_GHOST_SX,
  PUBLIC_BUTTON_PRIMARY_SX,
  PUBLIC_SURFACE_SX,
  PUBLIC_UI,
} from "../utils/publicUi";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const pageNotice = searchParams.get("error") === "unavailable"
    ? "This book is currently unavailable for checkout."
    : "";

  usePageTitle(book ? `${book.title} - BookNest` : "Book Details - BookNest");

  useEffect(() => {
    const handleUpdate = () => setWishlistIds(getWishlistIds());
    handleUpdate();
    window.addEventListener("wishlist-updated", handleUpdate);
    return () => window.removeEventListener("wishlist-updated", handleUpdate);
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const bookResponse = await booksApi.getById(id);
        const currentBook = bookResponse.book || null;

        if (!active) {
          return;
        }

        console.log("Loaded book details:", currentBook);

        setBook(currentBook);

        const [similarResponse, reviewResponse] = await Promise.all([
          booksApi.list({
            category: currentBook?.category,
            limit: 8,
            sortBy: "newest",
          }),
          reviewsApi.getBookReviews(id, { page: 1, limit: 6, sortBy: "createdAt" }).catch(() => ({ reviews: [] })),
        ]);

        if (!active) {
          return;
        }

        setSimilarBooks((similarResponse.books || []).filter((item) => item._id !== currentBook?._id).slice(0, 4));
        setReviews(reviewResponse.reviews || []);
      } catch (requestError) {
        if (active) {
          setError(requestError.message || "Unable to load this book.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [id]);

  const rating = useMemo(() => (book ? getBookRating(book) : 0), [book]);
  const reviewCount = useMemo(() => (book ? getBookReviewCount(book) : 0), [book]);
  const depositAmount = useMemo(() => (book ? getBookDepositAmount(book) : 0), [book]);
  // const baseRentPrice = useMemo(() => Number(book?.rentPrice || 0), [book]);
  const dailyPrice = useMemo(() => (book ? getBookDailyPrice(book) : 0), [book]);
  // const weeklyPrice = useMemo(() => (book ? getBookWeeklyPrice(book) : 0), [book]);
  // const monthlyPrice = useMemo(() => (book ? getBookMonthlyPrice(book) : 0), [book]);
  // const replacementCost = useMemo(() => (book ? getBookReplacementCost(book) : 0), [book]);
  const isWishlisted = book ? wishlistIds.includes(book._id) : false;
  const displayedReviews = reviews.length > 0
    ? reviews.map((review, index) => ({
        id: review?._id || `review-${index + 1}`,
        name: review?.user?.name || "Reader",
        rating: Number(review?.rating || 0),
        quote: review?.reviewText || "",
        date: review?.createdAt
          ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(review.createdAt))
          : "Recently",
      }))
    : getBookReviews(book || {});

  const handleRentNow = () => {
    if (!book) {
      return;
    }

    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/books/${book._id}`)}`);
      return;
    }

    navigate(`/books/${book._id}/checkout?rentalType=daily&rentalDuration=7`);
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 3.5, md: 6 } }}>
        <LoadingSkeleton variant="page" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 3.5, md: 6 } }}>
        <EmptyState
          title="We could not load this book"
          description={error}
          actionLabel="Back to Catalogue"
          actionTo="/books"
        />
      </Container>
    );
  }

  if (!book) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 3.5, md: 6 } }}>
        <EmptyState
          title="Book not found"
          description="This title may have been removed or the link is incorrect."
          actionLabel="Back to Catalogue"
          actionTo="/books"
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3.5, md: 6 } }}>
      <Stack spacing={4}>
        {pageNotice ? <Alert severity="warning">{pageNotice}</Alert> : null}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1.4fr" },
            gap: { xs: 3, lg: 6 },
            alignItems: "start",
          }}
        >
          <Stack spacing={2.2}>
            <Paper
              elevation={0}
              sx={{
                ...PUBLIC_SURFACE_SX,
                p: 1.4,
                borderRadius: 4,
                width: "100%",
                maxWidth: { xs: "100%", lg: 380 },
                mx: { xs: 0, lg: "auto" },
              }}
            >
              <BookMedia book={book} radius={3} titleMaxLength={44} />
            </Paper>

            <Paper elevation={0} sx={{ ...PUBLIC_SURFACE_SX, p: 2.2, borderRadius: 3 }}>
              <Stack spacing={1.4}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <AvailabilityBadge available={Boolean(book.isAvailable)} />
                  {/* <Typography sx={{ color: PUBLIC_UI.muted, fontWeight: 600 }}>
                    Rent price: {formatBookPrice(baseRentPrice)}
                  </Typography> */}
                  <Typography sx={{ color: PUBLIC_UI.muted, fontWeight: 600 }}>
                    Deposit: {formatBookPrice(depositAmount)}
                  </Typography>
                </Stack>

                <Typography sx={{ fontSize: "1.6rem", fontWeight: 700, color: PUBLIC_UI.text }}>
                  {formatBookPrice(dailyPrice)} / day
                </Typography>
                {/* <Typography sx={{ color: PUBLIC_UI.muted }}>
                  {formatBookPrice(weeklyPrice)} / week • {formatBookPrice(monthlyPrice)} / month
                </Typography> */}
                {/* <Typography sx={{ color: PUBLIC_UI.muted }}>
                  Replacement cost: {formatBookPrice(replacementCost)}
                </Typography> */}
                <Button
                  variant="contained"
                  disabled={!book.isAvailable}
                  onClick={handleRentNow}
                  sx={{
                    ...PUBLIC_BUTTON_PRIMARY_SX,
                    borderRadius: 999,
                    py: 1.1,
                    bgcolor: PUBLIC_UI.primary,
                    "&:hover": { bgcolor: PUBLIC_UI.primaryDark },
                  }}
                >
                  Rent Now
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate(`/login?redirect=${encodeURIComponent(`/books/${book._id}`)}`);
                      return;
                    }
                    const nextIds = toggleWishlistBook(book._id);
                    setWishlistIds(nextIds);
                    window.dispatchEvent(new Event("wishlist-updated"));
                  }}
                  startIcon={isWishlisted ? <FavoriteRoundedIcon sx={{ color: PUBLIC_UI.danger }} /> : <FavoriteBorderRoundedIcon />}
                  sx={{ ...PUBLIC_BUTTON_GHOST_SX, borderRadius: 999, py: 1.05 }}
                >
                  {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
                </Button>
              </Stack>
            </Paper>
          </Stack>

          <Stack spacing={2.2}>
            <Typography
              sx={{
                display: "inline-flex",
                width: "fit-content",
                px: 1.2,
                py: 0.45,
                borderRadius: 999,
                bgcolor: PUBLIC_UI.accentSoft,
                color: PUBLIC_UI.accent,
                fontWeight: 700,
                fontSize: "0.8rem",
              }}
            >
              {formatCategoryLabel(book.category)}
            </Typography>

            <Typography
              variant="h2"
              sx={{
                color: PUBLIC_UI.text,
                fontWeight: 700,
                fontSize: { xs: "2.1rem", md: "3rem" },
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                fontFamily: '"Playfair Display", serif',
              }}
            >
              {book.title}
            </Typography>

            <Typography variant="h6" sx={{ color: PUBLIC_UI.muted, fontWeight: 600 }}>
              by {book.author}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <RatingStars rating={rating} count={reviewCount} size="medium" />
            </Stack>

            <Divider />

            <Box>
              <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 600, mb: 1.1 }}>About This Book</Typography>
              <Typography sx={{ color: PUBLIC_UI.muted, lineHeight: 1.85 }}>
                {book.description}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 600, mb: 1.1 }}>Book Details</Typography>
              <BookDetailColumns book={book} />
            </Box>

            <Divider />

            <Box>
              <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 600 }}>Reviews</Typography>
              <Stack spacing={1.4} sx={{ mt: 1.8 }}>
                {displayedReviews.map((review) => (
                  <Paper
                    key={review.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: PUBLIC_UI.surface,
                      border: `1px solid ${PUBLIC_UI.border}`,
                    }}
                  >
                    <Stack spacing={1.1}>
                      <Typography sx={{ fontWeight: 600, color: PUBLIC_UI.text }}>{review.name}</Typography>
                      <RatingStars rating={review.rating} />
                      <Typography sx={{ color: PUBLIC_UI.muted, lineHeight: 1.75 }}>{review.quote}</Typography>
                      <Typography variant="caption" sx={{ color: PUBLIC_UI.muted }}>{review.date}</Typography>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Paper elevation={0} sx={{ ...PUBLIC_SURFACE_SX, p: 2.2, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: PUBLIC_UI.text, mb: 1.2 }}>
            About the Author
          </Typography>
          <Typography sx={{ color: PUBLIC_UI.muted, lineHeight: 1.8 }}>
            {getBookAuthorBlurb(book)}
          </Typography>
        </Paper>

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: PUBLIC_UI.text, mb: 2.2 }}>
            You Might Also Like
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2.2,
              overflowX: "auto",
              pb: 0.7,
            }}
          >
            {similarBooks.map((item) => (
              <Box key={item._id} sx={{ minWidth: { xs: 280, sm: 300, lg: 280 }, maxWidth: 320 }}>
                <BookCard
                  book={item}
                  variant="similar"
                  wishlistActive={wishlistIds.includes(item._id)}
                  onWishlistToggle={(selectedBook) => {
                    const nextIds = toggleWishlistBook(selectedBook._id);
                    setWishlistIds(nextIds);
                  }}
                  onRent={() => navigate(`/books/${item._id}`)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Stack>
    </Container>
  );
}
