import { useEffect, useMemo, useState } from "react";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Link as MuiLink,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import BookCard from "../components/books/BookCard";
import BookDetailColumns from "../components/books/BookDetailColumns";
import BookMedia from "../components/books/BookMedia";
import RentalDurationSelector from "../components/books/RentalDurationSelector";
import EmptyState from "../components/common/EmptyState";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import AvailabilityBadge from "../components/common/AvailabilityBadge";
import RatingStars from "../components/common/RatingStars";
import { useAuth } from "../context/useAuth";
import usePageTitle from "../hooks/usePageTitle";
import { rentalsApi, reviewsApi } from "../api";
import { booksApi } from "../lib/api";
import {
  formatBookPrice,
  formatCategoryLabel,
  getBookAuthorBlurb,
  getBookDepositAmount,
  getBookRating,
  getBookReviewCount,
  getBookReviews,
  getRentalTotal,
  getWeeklyRentFilterValue,
  getWishlistIds,
  toggleWishlistBook,
} from "../utils/books";
import { getUserInitials } from "../utils/profile";
import {
  PUBLIC_BUTTON_GHOST_SX,
  PUBLIC_BUTTON_PRIMARY_SX,
  PUBLIC_SURFACE_SX,
  PUBLIC_UI,
} from "../utils/publicUi";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState(7);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");
  const [isRenting, setIsRenting] = useState(false);
  const [rentError, setRentError] = useState("");

  usePageTitle(book ? `${book.title} - BookNest` : "Book Details - BookNest");

  useEffect(() => {
    const handleUpdate = () => {
      setWishlistIds(getWishlistIds());
    };

    handleUpdate();
    window.addEventListener("wishlist-updated", handleUpdate);
    return () => window.removeEventListener("wishlist-updated", handleUpdate);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadBook = async () => {
      setIsLoading(true);
      setError("");

      try {
        const bookResponse = await booksApi.getById(id);

        if (!isMounted) {
          return;
        }

        setBook(bookResponse.book || null);

        const similarResponse = await booksApi.list({
          category: bookResponse.book?.category,
          limit: 8,
          sortBy: "latest",
        });

        if (!isMounted) {
          return;
        }

        setSimilarBooks(
          (similarResponse.books || [])
            .filter((item) => item._id !== bookResponse.book?._id)
            .slice(0, 4),
        );
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(loadError.message || "Unable to load this book.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBook();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const rating = useMemo(() => (book ? getBookRating(book) : 0), [book]);
  const reviewCount = useMemo(() => (book ? getBookReviewCount(book) : 0), [book]);
  const depositAmount = useMemo(() => (book ? getBookDepositAmount(book) : 0), [book]);
  const weeklyRent = useMemo(() => (book ? getWeeklyRentFilterValue(book.price) : 0), [book]);
  const totalCost = useMemo(
    () => (book ? getRentalTotal(book.price, selectedDuration) : 0),
    [book, selectedDuration],
  );
  const fallbackReviews = useMemo(() => (book ? getBookReviews(book) : []), [book]);
  const displayedReviews = reviews.length > 0 ? reviews : fallbackReviews;
  const effectiveReviewCount = reviews.length > 0 ? reviews.length : reviewCount;
  const isWishlisted = book ? wishlistIds.includes(book._id) : false;
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      if (!id) {
        return;
      }

      setIsReviewsLoading(true);
      setReviewsError("");

      try {
        const response = await reviewsApi.getBookReviews(id, {
          page: 1,
          limit: 6,
          sortBy: "createdAt",
        });

        if (!isMounted) {
          return;
        }

        const normalized = (response?.reviews || []).map((review, index) => ({
          id: review?._id || review?.id || `review-${index + 1}`,
          name: review?.user?.name || "Reader",
          rating: Number(review?.rating || 0),
          quote: review?.reviewText || "",
          date: review?.createdAt
            ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(review.createdAt))
            : "Recently",
        }));

        setReviews(normalized);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setReviews([]);
        setReviewsError(requestError.message || "Unable to load live reviews right now.");
      } finally {
        if (isMounted) {
          setIsReviewsLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleToggleWishlist = () => {
    if (!book) {
      return;
    }

    const nextIds = toggleWishlistBook(book._id);
    setWishlistIds(nextIds);
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  const handleRent = async () => {
    if (!book) {
      return;
    }

    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/books/${book._id}`)}`);
      return;
    }

    setRentError("");
    setIsRenting(true);

    try {
      await rentalsApi.rentBook(book._id, selectedDuration);
      navigate("/dashboard", {
        state: {
          selectedBookId: book._id,
          rentalDays: selectedDuration,
          rentalSuccess: true,
        },
      });
    } catch (requestError) {
      setRentError(requestError.message || "Unable to rent this book right now.");
    } finally {
      setIsRenting(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3.5, md: 6 } }}>
      <Stack spacing={4}>
        {isLoading ? (
          <LoadingSkeleton variant="page" />
        ) : error ? (
          <EmptyState
            title="We could not load this book"
            description={error}
            actionLabel="Back to Catalogue"
            actionTo="/books"
          />
        ) : book ? (
          <Stack spacing={4}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1fr 1.5fr" },
                gap: { xs: 3, lg: 6 },
                alignItems: "start",
              }}
            >
              <Stack spacing={2.2} sx={{ position: { lg: "sticky" }, top: { lg: 100 } }}>
                <Paper elevation={0} sx={{ ...PUBLIC_SURFACE_SX, p: 1.8, borderRadius: 4 }}>
                  <BookMedia book={book} radius={3} titleMaxLength={44} />
                </Paper>

                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ alignItems: "center" }}>
                  <AvailabilityBadge available={Boolean(book.isAvailable)} />
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      ...PUBLIC_BUTTON_GHOST_SX,
                      borderRadius: 999,
                      py: 0.5,
                    }}
                  >
                    {formatCategoryLabel(book.category)}
                  </Button>
                </Stack>

                <Paper
                  elevation={0}
                  sx={{
                    ...PUBLIC_SURFACE_SX,
                    p: 2.2,
                    borderRadius: 3,
                  }}
                >
                  <Stack spacing={2}>
                    <Typography
                      sx={{
                        fontSize: "1.6rem",
                        fontWeight: 600,
                        color: PUBLIC_UI.text,
                        fontFamily: '"DM Sans", "Segoe UI", sans-serif',
                      }}
                    >
                      {formatBookPrice(weeklyRent)} / week
                    </Typography>
                    <Typography sx={{ color: PUBLIC_UI.muted }}>
                      Refundable deposit: {formatBookPrice(depositAmount)}
                    </Typography>

                    <RentalDurationSelector value={selectedDuration} onChange={setSelectedDuration} />

                    <Paper
                      elevation={0}
                      sx={{
                        ...PUBLIC_SURFACE_SX,
                        p: 1.8,
                        borderRadius: 2,
                        bgcolor: PUBLIC_UI.surfaceSoft,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: PUBLIC_UI.text }}>
                        Estimated total
                      </Typography>
                      <Typography sx={{ mt: 0.3, fontWeight: 600, color: PUBLIC_UI.primary, fontSize: "1.25rem" }}>
                        {formatBookPrice(totalCost)}
                      </Typography>
                    </Paper>

                    <Button
                      variant="contained"
                      disabled={!book.isAvailable || isRenting}
                      onClick={handleRent}
                      sx={{
                        ...PUBLIC_BUTTON_PRIMARY_SX,
                        borderRadius: 999,
                        py: 1.1,
                        bgcolor: PUBLIC_UI.primary,
                        "&:hover": { bgcolor: PUBLIC_UI.primaryDark },
                      }}
                    >
                      {isRenting ? "Processing..." : "Rent This Book"}
                    </Button>

                    {rentError ? (
                      <Alert severity="error" sx={{ borderRadius: 2.5 }}>
                        {rentError}
                      </Alert>
                    ) : null}

                    <Button
                      variant="outlined"
                      onClick={() => {
                        if (!isAuthenticated) {
                          navigate(`/login?redirect=${encodeURIComponent(`/books/${book._id}`)}`);
                          return;
                        }
                        handleToggleWishlist();
                      }}
                      startIcon={
                        isWishlisted ? (
                          <FavoriteRoundedIcon sx={{ color: PUBLIC_UI.danger }} />
                        ) : (
                          <FavoriteBorderRoundedIcon />
                        )
                      }
                      sx={{
                        ...PUBLIC_BUTTON_GHOST_SX,
                        borderRadius: 999,
                        py: 1.05,
                      }}
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
                  <RatingStars rating={rating} count={effectiveReviewCount} size="medium" />
                  <MuiLink
                    href="#reviews"
                    underline="hover"
                    sx={{ color: PUBLIC_UI.primary, fontWeight: 500, fontSize: "0.9rem" }}
                  >
                    ({effectiveReviewCount} reviews)
                  </MuiLink>
                </Stack>

                <Divider />

                <Box>
                  <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 600, mb: 1.1 }}>About This Book</Typography>
                  <Typography
                    sx={{
                      color: PUBLIC_UI.muted,
                      lineHeight: 1.85,
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitLineClamp: showFullDescription ? "unset" : 4,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {book.description}
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => setShowFullDescription((current) => !current)}
                    sx={{ mt: 0.8, px: 0, textTransform: "none", fontWeight: 500 }}
                  >
                    {showFullDescription ? "Read less" : "Read more"}
                  </Button>
                </Box>

                <Divider />

                <Box>
                  <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 600, mb: 1.1 }}>Book Details</Typography>
                  <BookDetailColumns book={book} />
                </Box>

                <Divider />

                <Box id="reviews">
                  <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 600 }}>Reviews</Typography>
                  <Typography sx={{ color: PUBLIC_UI.muted, mt: 0.4 }}>
                    Reader feedback for this title.
                  </Typography>

                  {reviewsError ? (
                    <Alert severity="info" sx={{ mt: 1.5, borderRadius: 2.5 }}>
                      {reviewsError} Showing curated reader highlights instead.
                    </Alert>
                  ) : null}

                  <Stack spacing={1.4} sx={{ mt: 1.8 }}>
                    {isReviewsLoading ? (
                      <Typography variant="body2" sx={{ color: PUBLIC_UI.muted }}>
                        Loading reviews...
                      </Typography>
                    ) : null}

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
                          <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
                            <Avatar
                              sx={{
                                bgcolor: PUBLIC_UI.primarySoft,
                                color: PUBLIC_UI.primary,
                                fontWeight: 600,
                              }}
                            >
                              {getUserInitials(review.name)}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 600, color: PUBLIC_UI.text }}>{review.name}</Typography>
                              <Typography variant="caption" sx={{ color: PUBLIC_UI.muted }}>
                                {review.date}
                              </Typography>
                            </Box>
                          </Stack>
                          <RatingStars rating={review.rating} />
                          <Typography sx={{ color: PUBLIC_UI.muted, lineHeight: 1.75 }}>{review.quote}</Typography>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>

                  <Button
                    variant="text"
                    sx={{ mt: 1.2, textTransform: "none", px: 0, fontWeight: 500, color: PUBLIC_UI.primary }}
                  >
                    View all reviews
                  </Button>
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

              {similarBooks.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2.2,
                    overflowX: "auto",
                    pb: 0.7,
                    scrollSnapType: "x proximity",
                    "& > *": {
                      minWidth: { xs: 280, sm: 300, lg: 280 },
                      maxWidth: { xs: 320, sm: 320, lg: 300 },
                      scrollSnapAlign: "start",
                    },
                  }}
                >
                  {similarBooks.map((item) => (
                    <BookCard
                      key={item._id}
                      book={item}
                      variant="similar"
                      wishlistActive={wishlistIds.includes(item._id)}
                      onWishlistToggle={(selectedBook) => {
                        const nextIds = toggleWishlistBook(selectedBook._id);
                        setWishlistIds(nextIds);
                      }}
                      onRent={() => navigate(`/books/${item._id}`)}
                    />
                  ))}
                </Box>
              ) : (
                <Alert severity="info" sx={{ borderRadius: 3 }}>
                  More books in this category will appear here as the catalogue grows.
                </Alert>
              )}
            </Box>
          </Stack>
        ) : (
          <EmptyState
            title="Book not found"
            description="This title may have been removed or the link is incorrect."
            actionLabel="Back to Catalogue"
            actionTo="/books"
          />
        )}
      </Stack>
    </Container>
  );
}
