import { useEffect, useMemo, useState } from "react";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
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
import { paymentsApi, rentalsApi, reviewsApi } from "../api";
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
  getTotalRentPrice,
  getRentalTotal,
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
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [rentalType, setRentalType] = useState("daily");
  const [rentalDuration, setRentalDuration] = useState(7);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isRenting, setIsRenting] = useState(false);
  const [rentError, setRentError] = useState("");
  const [rentMessage, setRentMessage] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useState("");
  const [paymentMethodsError, setPaymentMethodsError] = useState("");
  const [isPaymentMethodsLoading, setIsPaymentMethodsLoading] = useState(false);

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

  useEffect(() => {
    let active = true;

    const loadPreview = async () => {
      if (!book || !isAuthenticated) {
        return;
      }

      try {
        const pricingPreview = await rentalsApi.previewRental(book._id, rentalType, rentalDuration);

        if (!active) {
          return;
        }

        setPreview(pricingPreview.pricing || null);
        setRentError(pricingPreview.allowed ? "" : pricingPreview.message || "");
        setRentMessage("");
        setPaymentStatus("");
      } catch (requestError) {
        if (active) {
          setRentError(requestError.message || "Unable to preview rental");
        }
      }
    };

    loadPreview();
    return () => {
      active = false;
    };
  }, [book, isAuthenticated, rentalDuration, rentalType]);

  useEffect(() => {
    if (!isRentModalOpen || !isAuthenticated) {
      return;
    }

    let active = true;

    const loadPaymentMethods = async () => {
      try {
        setIsPaymentMethodsLoading(true);
        setPaymentMethodsError("");
        const response = await paymentsApi.getPaymentMethods();

        if (!active) {
          return;
        }

        setPaymentMethods(response?.methods || []);
        setDefaultPaymentMethodId(response?.defaultPaymentMethodId || "");
      } catch (requestError) {
        if (active) {
          setPaymentMethodsError(requestError.message || "Unable to load payment methods");
          setPaymentMethods([]);
          setDefaultPaymentMethodId("");
        }
      } finally {
        if (active) {
          setIsPaymentMethodsLoading(false);
        }
      }
    };

    loadPaymentMethods();

    return () => {
      active = false;
    };
  }, [isRentModalOpen, isAuthenticated]);

  const rating = useMemo(() => (book ? getBookRating(book) : 0), [book]);
  const reviewCount = useMemo(() => (book ? getBookReviewCount(book) : 0), [book]);
  const depositAmount = useMemo(() => (book ? getBookDepositAmount(book) : 0), [book]);
  // const baseRentPrice = useMemo(() => Number(book?.rentPrice || 0), [book]);
  const dailyPrice = useMemo(() => (book ? getBookDailyPrice(book) : 0), [book]);
  // const weeklyPrice = useMemo(() => (book ? getBookWeeklyPrice(book) : 0), [book]);
  // const monthlyPrice = useMemo(() => (book ? getBookMonthlyPrice(book) : 0), [book]);
  // const replacementCost = useMemo(() => (book ? getBookReplacementCost(book) : 0), [book]);
  const totalRentPrice = useMemo(() => (book ? getTotalRentPrice(book, rentalType, rentalDuration) : 0), [book, rentalDuration, rentalType]);
  const totalCost = useMemo(() => (book ? getRentalTotal(book, rentalType, rentalDuration) : 0), [book, rentalDuration, rentalType]);
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

  const handleRentConfirm = async () => {
    if (!book) {
      return;
    }

    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/books/${book._id}`)}`);
      return;
    }

    if (!defaultPaymentMethodId) {
      navigate(`/dashboard/profile/payment?return=${encodeURIComponent(`/books/${book._id}`)}`);
      return;
    }

    try {
      setIsRenting(true);
      setRentError("");
      setRentMessage("");
      setPaymentStatus("");
      const response = await rentalsApi.rentBook(book._id, rentalType, rentalDuration);
      const status = response?.payment?.status || "processing";
      const nextMessage = status === "succeeded"
        ? "Payment captured. Finalizing your rental now."
        : "Payment is processing. We will finalize your rental shortly.";
      setPaymentStatus(nextMessage);
      setRentMessage("");

      setTimeout(() => {
        setIsRentModalOpen(false);
        navigate("/dashboard/rentals");
      }, 1400);
    } catch (requestError) {
      if (requestError?.code === "payment_method_required" || requestError?.code === "authentication_required") {
        navigate(`/dashboard/profile/payment?return=${encodeURIComponent(`/books/${book._id}`)}`);
        return;
      }
      setRentError(requestError.message || "Unable to rent this book right now.");
    } finally {
      setIsRenting(false);
    }
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
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate(`/login?redirect=${encodeURIComponent(`/books/${book._id}`)}`);
                      return;
                    }

                    setIsRentModalOpen(true);
                  }}
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

      <Dialog
        open={isRentModalOpen}
        onClose={() => setIsRentModalOpen(false)}
        maxWidth="xs"
        scroll="paper"
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.58)",
          },
        }}
        PaperProps={{
          sx: {
            width: "min(100%, 420px)",
            maxWidth: "calc(100vw - 24px)",
            maxHeight: "calc(100vh - 24px)",
            m: { xs: 1.5, sm: 2 },
            borderRadius: 4,
            p: 0.5,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 700,
            pb: 1,
          }}
        >
          Rent {book.title}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.2} sx={{ pt: 1 }}>
            <Paper
              elevation={0}
              sx={{
                overflow: "hidden",
                borderRadius: 3,
                border: `1px solid ${PUBLIC_UI.border}`,
              }}
            >
              <Box
                component="img"
                src={book.image}
                alt={book.title}
                sx={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Paper>

            <Stack spacing={0.4} sx={{ textAlign: "center" }}>
              <Typography sx={{ fontWeight: 700, color: PUBLIC_UI.text }}>
                {book.title}
              </Typography>
              <Typography variant="body2" sx={{ color: PUBLIC_UI.muted }}>
                by {book.author}
              </Typography>
            </Stack>

            <RentalDurationSelector
              rentalType={rentalType}
              rentalDuration={rentalDuration}
              onTypeChange={(nextType) => {
                setRentalType(nextType);
                setRentalDuration(nextType === "daily" ? 7 : 1);
              }}
              onDurationChange={setRentalDuration}
            />

            <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, bgcolor: PUBLIC_UI.surfaceSoft }}>
              <Stack spacing={1}>
                <Typography sx={{ fontWeight: 700, color: PUBLIC_UI.text }}>Price breakdown</Typography>
                <Typography variant="body2" sx={{ color: PUBLIC_UI.muted }}>
                  Total rent: {formatBookPrice(preview?.totalRentPrice ?? totalRentPrice)}
                </Typography>
                <Typography variant="body2" sx={{ color: PUBLIC_UI.muted }}>
                  Security deposit: {formatBookPrice(preview?.depositAmount ?? depositAmount)}
                </Typography>
                <Divider />
                <Typography sx={{ fontWeight: 700, color: PUBLIC_UI.text }}>
                  Total due now: {formatBookPrice(preview?.total ?? totalCost)}
                </Typography>
              </Stack>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, border: `1px solid ${PUBLIC_UI.border}` }}>
              <Stack spacing={1}>
                <Typography sx={{ fontWeight: 700, color: PUBLIC_UI.text }}>Saved payment methods</Typography>
                {isPaymentMethodsLoading ? (
                  <Typography variant="body2" sx={{ color: PUBLIC_UI.muted }}>
                    Loading saved payment methods...
                  </Typography>
                ) : paymentMethodsError ? (
                  <Typography variant="body2" sx={{ color: PUBLIC_UI.muted }}>
                    {paymentMethodsError}
                  </Typography>
                ) : paymentMethods.length > 0 ? (
                  <Stack spacing={0.6}>
                    {paymentMethods.map((method) => (
                      <Box
                        key={method.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          bgcolor: PUBLIC_UI.surface,
                          borderRadius: 2,
                          px: 1.2,
                          py: 0.8,
                        }}
                      >
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                          <Typography variant="body2" sx={{ color: PUBLIC_UI.text, fontWeight: 600 }}>
                            {method.brand ? method.brand.toUpperCase() : "Card"} •••• {method.last4}
                          </Typography>
                          {method.id === defaultPaymentMethodId ? (
                            <Typography
                              variant="caption"
                              sx={{
                                px: 0.8,
                                py: 0.2,
                                borderRadius: 999,
                                bgcolor: PUBLIC_UI.accentSoft,
                                color: PUBLIC_UI.accent,
                                fontWeight: 700,
                              }}
                            >
                              Default
                            </Typography>
                          ) : null}
                        </Stack>
                        <Typography variant="caption" sx={{ color: PUBLIC_UI.muted }}>
                          exp {method.expMonth}/{String(method.expYear).slice(-2)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ color: PUBLIC_UI.muted }}>
                    No saved cards found. Add one in your payment settings to continue.
                  </Typography>
                )}
              </Stack>
            </Paper>

            {rentError ? (
              <Alert severity="warning" sx={{ borderRadius: 2.5 }}>
                {rentError}
              </Alert>
            ) : null}
            {rentMessage ? (
              <Alert severity="info" sx={{ borderRadius: 2.5 }}>
                {rentMessage}
              </Alert>
            ) : null}
            {paymentStatus ? (
              <Alert severity="success" sx={{ borderRadius: 2.5 }}>
                {paymentStatus}
              </Alert>
            ) : null}

            <Button
              variant="contained"
              onClick={handleRentConfirm}
              disabled={isRenting || Boolean(rentError)}
              sx={{ ...PUBLIC_BUTTON_PRIMARY_SX, borderRadius: 999, py: 1.1 }}
            >
              {isRenting ? "Processing..." : "Confirm Rental"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
