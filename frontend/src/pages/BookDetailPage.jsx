import { useEffect, useMemo, useState } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import BookCard from "../components/books/BookCard";
import BookMedia from "../components/books/BookMedia";
import EmptyState from "../components/common/EmptyState";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import AvailabilityBadge from "../components/common/AvailabilityBadge";
import RatingStars from "../components/common/RatingStars";
import { useAuth } from "../context/useAuth";
import usePageTitle from "../hooks/usePageTitle";
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

const rentalDurations = [3, 7, 14, 30];

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

  usePageTitle(book ? `${book.title} - BookNest` : "Book Details - BookNest");

  useEffect(() => {
    setWishlistIds(getWishlistIds());
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
  const totalCost = useMemo(
    () => (book ? getRentalTotal(book.price, selectedDuration) : 0),
    [book, selectedDuration],
  );
  const reviews = useMemo(() => (book ? getBookReviews(book) : []), [book]);
  const isWishlisted = book ? wishlistIds.includes(book._id) : false;

  const handleToggleWishlist = () => {
    if (!book) {
      return;
    }

    const nextIds = toggleWishlistBook(book._id);
    setWishlistIds(nextIds);
  };

  const handleRent = () => {
    if (!book) {
      return;
    }

    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/books/${book._id}`)}`);
      return;
    }

    navigate("/dashboard", { state: { selectedBookId: book._id, rentalDays: selectedDuration } });
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={4}>
        <Button
          component={RouterLink}
          to="/books"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            width: "fit-content",
            color: PUBLIC_UI.primary,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Back to Books
        </Button>

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
            <Paper
              elevation={0}
              sx={{
                ...PUBLIC_SURFACE_SX,
                p: { xs: 2.4, md: 3 },
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "380px minmax(0, 1fr)" },
                  gap: 4,
                  alignItems: "start",
                }}
              >
                <Stack spacing={2}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 5,
                      bgcolor: PUBLIC_UI.surfaceSoft,
                    }}
                  >
                    <BookMedia book={book} radius={5} titleMaxLength={44} />
                  </Paper>

                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <AvailabilityBadge available={Boolean(book.isAvailable)} />
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        ...PUBLIC_BUTTON_GHOST_SX,
                        borderRadius: 999,
                        py: 0.6,
                      }}
                    >
                      {formatCategoryLabel(book.category)}
                    </Button>
                  </Stack>
                </Stack>

                <Stack spacing={2.2}>
                  <Typography
                    variant="h2"
                    sx={{
                      color: PUBLIC_UI.text,
                      fontWeight: 900,
                      fontSize: { xs: "2.2rem", md: "3.4rem" },
                      lineHeight: 1.02,
                      letterSpacing: "-0.05em",
                    }}
                  >
                    {book.title}
                  </Typography>

                  <Typography variant="h6" sx={{ color: PUBLIC_UI.muted, fontWeight: 600 }}>
                    by {book.author}
                  </Typography>

                  <RatingStars rating={rating} count={reviewCount} size="medium" />

                  <Typography sx={{ color: PUBLIC_UI.muted, lineHeight: 1.8 }}>
                    {book.description}
                  </Typography>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 5,
                      bgcolor: PUBLIC_UI.surfaceSoft,
                    }}
                  >
                    <Stack spacing={2.25}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                      >
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 900, color: PUBLIC_UI.primary }}>
                            {formatBookPrice(book.price)} / day
                          </Typography>
                          <Typography sx={{ color: PUBLIC_UI.muted }}>
                            Refundable deposit: {formatBookPrice(depositAmount)}
                          </Typography>
                        </Box>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                          <Button
                            variant="contained"
                            disabled={!book.isAvailable}
                            onClick={handleRent}
                            sx={{
                              ...PUBLIC_BUTTON_PRIMARY_SX,
                              borderRadius: 3,
                              px: 3,
                            }}
                          >
                            Rent This Book
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={handleToggleWishlist}
                            startIcon={
                              isWishlisted ? (
                                <FavoriteRoundedIcon sx={{ color: PUBLIC_UI.danger }} />
                              ) : (
                                <FavoriteBorderRoundedIcon />
                              )
                            }
                            sx={{
                              ...PUBLIC_BUTTON_GHOST_SX,
                              borderRadius: 3,
                              px: 2.4,
                            }}
                          >
                            Add to Wishlist
                          </Button>
                        </Stack>
                      </Stack>

                      <Divider />

                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: PUBLIC_UI.text }}>
                          Rental Duration
                        </Typography>
                        <ToggleButtonGroup
                          value={selectedDuration}
                          exclusive
                          onChange={(_, value) => {
                            if (value) {
                              setSelectedDuration(value);
                            }
                          }}
                          sx={{ mt: 1.25, flexWrap: "wrap", gap: 1 }}
                        >
                          {rentalDurations.map((duration) => (
                            <ToggleButton
                              key={duration}
                              value={duration}
                              sx={{
                                borderRadius: "12px !important",
                                border: `1px solid ${PUBLIC_UI.border} !important`,
                                px: 1.8,
                                textTransform: "none",
                                fontWeight: 700,
                                "&.Mui-selected": {
                                  bgcolor: PUBLIC_UI.primarySoft,
                                  color: PUBLIC_UI.primary,
                                },
                              }}
                            >
                              {duration} days
                            </ToggleButton>
                          ))}
                        </ToggleButtonGroup>
                      </Box>

                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 4,
                          bgcolor: "#FFFFFF",
                          border: `1px solid ${PUBLIC_UI.border}`,
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: PUBLIC_UI.text }}>
                          Estimated total for {selectedDuration} days
                        </Typography>
                        <Typography variant="h5" sx={{ mt: 0.6, fontWeight: 900, color: PUBLIC_UI.primary }}>
                          {formatBookPrice(totalCost)}
                        </Typography>
                      </Paper>
                    </Stack>
                  </Paper>
                </Stack>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                ...PUBLIC_SURFACE_SX,
                p: { xs: 2.5, md: 3 },
              }}
            >
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: PUBLIC_UI.text }}>
                    About the Author
                  </Typography>
                  <Typography sx={{ mt: 1.2, color: PUBLIC_UI.muted, lineHeight: 1.8 }}>
                    {getBookAuthorBlurb(book)}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: PUBLIC_UI.text }}>
                    Reviews & Ratings
                  </Typography>
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    {reviews.map((review) => (
                      <Paper
                        key={review.id}
                        elevation={0}
                        sx={{
                          p: 2.2,
                          borderRadius: 4,
                          bgcolor: PUBLIC_UI.surfaceSoft,
                          border: `1px solid ${PUBLIC_UI.border}`,
                        }}
                      >
                        <Stack spacing={1.1}>
                          <Stack direction="row" spacing={1.2} alignItems="center">
                            <Avatar
                              sx={{
                                bgcolor: PUBLIC_UI.primarySoft,
                                color: PUBLIC_UI.primary,
                                fontWeight: 800,
                              }}
                            >
                              {getUserInitials(review.name)}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 800, color: PUBLIC_UI.text }}>
                                {review.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: PUBLIC_UI.muted }}>
                                {review.date}
                              </Typography>
                            </Box>
                          </Stack>
                          <RatingStars rating={review.rating} />
                          <Typography sx={{ color: PUBLIC_UI.muted, lineHeight: 1.75 }}>
                            {review.quote}
                          </Typography>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Paper>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: PUBLIC_UI.text, mb: 2.2 }}>
                Similar Books
              </Typography>

              {similarBooks.length > 0 ? (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                      xl: "repeat(4, minmax(0, 1fr))",
                    },
                    gap: 2.2,
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
