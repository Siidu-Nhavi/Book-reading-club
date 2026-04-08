import { useEffect, useMemo, useState } from "react";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import BookCard from "../components/books/BookCard";
import CategoryCard from "../components/books/CategoryCard";
import EmptyState from "../components/common/EmptyState";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import PageHeader from "../components/common/PageHeader";
import usePageTitle from "../hooks/usePageTitle";
import { booksApi } from "../lib/api";
import { buildCategorySummaries, fetchAllBooks } from "../utils/bookCatalog";
import { getWishlistIds, toggleWishlistBook } from "../utils/books";
import { getUserInitials } from "../utils/profile";
import {
  PUBLIC_BUTTON_GHOST_SX,
  PUBLIC_BUTTON_PRIMARY_SX,
  PUBLIC_SURFACE_SX,
  PUBLIC_UI,
} from "../utils/publicUi";

const heroCategories = [
  { label: "Fiction", accent: "#7A69F6" },
  { label: "Mystery", accent: "#FF9E57" },
  { label: "Romance", accent: "#F26C9F" },
  { label: "Biography", accent: "#4E8CCF" },
  { label: "Sci-Fi", accent: "#5E5CE6" },
];

const stats = [
  { icon: AutoStoriesRoundedIcon, value: "10,000+", label: "Books" },
  { icon: GroupsRoundedIcon, value: "50,000+", label: "Readers" },
  { icon: CategoryRoundedIcon, value: "500+", label: "Categories" },
  { icon: CurrencyRupeeRoundedIcon, value: "49/week", label: "Rentals" },
];

const testimonials = [
  {
    name: "Anika Rao",
    rating: 5,
    quote: "BookNest makes it easy to find something new every week without buying every title.",
  },
  {
    name: "Karan Sethi",
    rating: 5,
    quote: "The catalogue feels polished, and the rental flow is simple enough for busy readers.",
  },
  {
    name: "Maya Fernandes",
    rating: 4,
    quote: "I love that I can explore categories quickly and still manage everything from one dashboard.",
  },
];

const steps = [
  {
    number: "01",
    title: "Browse & Pick",
    description: "Explore curated categories, trending titles, and detailed book pages before you rent.",
    icon: MenuBookRoundedIcon,
  },
  {
    number: "02",
    title: "Pay & Rent",
    description: "Choose a rental duration, confirm pricing, and move into your BookNest experience.",
    icon: PaymentsRoundedIcon,
  },
  {
    number: "03",
    title: "Read & Return",
    description: "Track your activity from the dashboard and stay ready for your next read.",
    icon: ReplayRoundedIcon,
  },
];

export default function HomePage() {
  usePageTitle("BookNest - Discover Your Next Favorite Book");

  const navigate = useNavigate();
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [categorySummaries, setCategorySummaries] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setWishlistIds(getWishlistIds());
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [featuredResponse, categoriesResponse, allBooks] = await Promise.all([
          booksApi.list({ limit: 8, sortBy: "latest" }),
          booksApi.categories(),
          fetchAllBooks({ sortBy: "latest" }),
        ]);

        if (!isMounted) {
          return;
        }

        setTrendingBooks(featuredResponse.books || []);
        setCategorySummaries(
          buildCategorySummaries(categoriesResponse.categories || [], allBooks).slice(0, 6),
        );
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(loadError.message || "Unable to load BookNest highlights right now.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleWishlist = (book) => {
    const nextIds = toggleWishlistBook(book._id);
    setWishlistIds(nextIds);
  };

  const heroCardOffsets = useMemo(
    () => [
      { transform: "translateY(22px)" },
      { transform: "translateY(-10px)" },
      { transform: "translateY(16px)" },
      { transform: "translateY(-18px)" },
      { transform: "translateY(10px)" },
    ],
    [],
  );

  return (
    <Box sx={{ pb: { xs: 3, md: 4 } }}>
      <Container maxWidth="xl" sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 3, md: 5 } }}>
        <Paper
          elevation={0}
          sx={{
            ...PUBLIC_SURFACE_SX,
            p: { xs: 2, md: 3 },
            overflow: "hidden",
          }}
        >
          <Grid container spacing={{ xs: 4, md: 4 }} alignItems="stretch">
            <Grid item xs={12} md={6.4}>
              <Box
                sx={{
                  height: "100%",
                  p: { xs: 2.4, md: 3.2 },
                  borderRadius: 5,
                  background: "linear-gradient(180deg, #F5F3FF 0%, #EEF1FF 100%)",
                }}
              >
                <Stack spacing={3} justifyContent="center" sx={{ height: "100%" }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      width: "fit-content",
                      px: 1.5,
                      py: 0.8,
                      borderRadius: 999,
                      bgcolor: PUBLIC_UI.primarySoft,
                      color: PUBLIC_UI.primary,
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontSize: "0.78rem",
                    }}
                  >
                    Curated rentals for modern readers
                  </Box>

                  <Typography
                    variant="h1"
                    sx={{
                      color: PUBLIC_UI.text,
                      fontWeight: 900,
                      fontSize: { xs: "2.8rem", md: "4.5rem" },
                      lineHeight: 0.98,
                      letterSpacing: "-0.06em",
                      maxWidth: 660,
                    }}
                  >
                    Discover Your Next Favorite Book
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: PUBLIC_UI.muted,
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      lineHeight: 1.8,
                      maxWidth: 560,
                    }}
                  >
                    Browse a polished online rental catalog, find your perfect title, and manage your
                    reading life from one beautifully organized BookNest experience.
                  </Typography>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Button
                      component={RouterLink}
                      to="/books"
                      variant="contained"
                      sx={{
                        ...PUBLIC_BUTTON_PRIMARY_SX,
                        minHeight: 54,
                        minWidth: { xs: "100%", sm: 172 },
                        borderRadius: 3,
                        px: 3.4,
                        py: 1.4,
                      }}
                    >
                      Browse Books
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/#how-it-works"
                      variant="outlined"
                      sx={{
                        ...PUBLIC_BUTTON_GHOST_SX,
                        minHeight: 54,
                        minWidth: { xs: "100%", sm: 172 },
                        borderRadius: 3,
                        px: 3.4,
                        py: 1.4,
                      }}
                    >
                      How It Works
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={5.6}>
              <Box
                sx={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                  gap: 1.4,
                  p: { xs: 1, md: 0.6 },
                  "@keyframes heroFloat": {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                  },
                }}
              >
                {heroCategories.map((category, index) => (
                  <Paper
                    key={category.label}
                    elevation={0}
                    sx={{
                      gridColumn: "span 3",
                      minHeight: 172,
                      p: 2.2,
                      borderRadius: 4,
                      color: "#fff",
                      background: `linear-gradient(145deg, ${category.accent} 0%, ${PUBLIC_UI.primaryDark} 100%)`,
                      boxShadow: PUBLIC_UI.shadow,
                      animation: `heroFloat ${5.5 + index * 0.4}s ease-in-out infinite`,
                      ...heroCardOffsets[index],
                    }}
                  >
                    <Stack justifyContent="space-between" sx={{ height: "100%" }}>
                      <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 48, height: 48 }}>
                        <MenuBookRoundedIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.78, letterSpacing: "0.06em" }}>
                          Popular category
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                          {category.label}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Container maxWidth="xl" sx={{ pb: { xs: 2, md: 4 } }}>
        <Grid container spacing={2}>
          {stats.map((item) => {
            const IconComponent = item.icon;
            return (
              <Grid item xs={6} md={3} key={item.label}>
                <Paper
                  elevation={0}
                  sx={{
                    ...PUBLIC_SURFACE_SX,
                    p: 2,
                    borderRadius: 4,
                    height: "100%",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ bgcolor: PUBLIC_UI.primarySoft, color: PUBLIC_UI.primary }}>
                      <IconComponent />
                    </Avatar>
                    <Box>
                      <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 800 }}>{item.value}</Typography>
                      <Typography sx={{ color: PUBLIC_UI.muted, fontSize: "0.92rem" }}>
                        {item.label}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={7}>
          <Box id="books">
            <PageHeader
              eyebrow="Trending This Week"
              title="Reader-loved books you can rent right now"
              subtitle="Fresh arrivals and popular titles pulled from your live BookNest catalogue."
              ctaLabel="View All Books"
              ctaTo="/books"
            />

            {error ? (
              <Alert severity="error" sx={{ mt: 3, borderRadius: 3 }}>
                {error}
              </Alert>
            ) : null}

            <Box
              sx={{
                mt: 3.5,
                display: "flex",
                gap: 2,
                overflowX: "auto",
                pb: 1,
                scrollSnapType: "x proximity",
              }}
            >
              {isLoading ? (
                <LoadingSkeleton variant="featured" count={4} />
              ) : trendingBooks.length > 0 ? (
                trendingBooks.map((book) => (
                  <Box key={book._id} sx={{ flex: "0 0 auto", scrollSnapAlign: "start" }}>
                    <BookCard
                      book={book}
                      variant="featured"
                      wishlistActive={wishlistIds.includes(book._id)}
                      onWishlistToggle={handleToggleWishlist}
                      onRent={() => navigate(`/books/${book._id}`)}
                    />
                  </Box>
                ))
              ) : (
                <Box sx={{ width: "100%" }}>
                  <EmptyState
                    title="No featured books available yet"
                    description="Once books are added to the catalogue, they will appear here automatically."
                    actionLabel="Browse All Books"
                    actionTo="/books"
                  />
                </Box>
              )}
            </Box>
          </Box>

          <Box id="categories">
            <PageHeader
              eyebrow="Categories"
              title="Browse the catalogue by the kind of story you want today"
              subtitle="Category cards are generated from the live API, while counts are computed directly from the current catalog."
            />

            <Grid container spacing={2.2} sx={{ mt: 0.5 }}>
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={`category-skeleton-${index + 1}`}>
                      <LoadingSkeleton count={1} />
                    </Grid>
                  ))
                : categorySummaries.map((category) => (
                    <Grid item xs={12} sm={6} md={4} key={category.name}>
                      <CategoryCard
                        category={category.name}
                        count={category.count}
                        onClick={() =>
                          navigate(`/books?category=${encodeURIComponent(category.name)}`)
                        }
                      />
                    </Grid>
                  ))}
            </Grid>
          </Box>

          <Box id="how-it-works">
            <PageHeader
              eyebrow="How It Works"
              title="A rental flow that feels familiar, clear, and fast"
              subtitle="Everything from discovery to profile management is organized like a polished consumer app."
            />

            <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
              {steps.map((step) => {
                const IconComponent = step.icon;
                return (
                  <Grid item xs={12} md={4} key={step.number}>
                    <Paper
                      elevation={0}
                      sx={{
                        ...PUBLIC_SURFACE_SX,
                        p: 3,
                        height: "100%",
                        borderRadius: 5,
                      }}
                    >
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="h4" sx={{ fontWeight: 900, color: PUBLIC_UI.primary }}>
                            {step.number}
                          </Typography>
                          <Avatar sx={{ bgcolor: PUBLIC_UI.primarySoft, color: PUBLIC_UI.primary }}>
                            <IconComponent />
                          </Avatar>
                        </Stack>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: PUBLIC_UI.text }}>
                          {step.title}
                        </Typography>
                        <Typography sx={{ color: PUBLIC_UI.muted, lineHeight: 1.75 }}>
                          {step.description}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          <Box>
            <PageHeader
              eyebrow="Reader Stories"
              title="What readers say about the BookNest experience"
              subtitle="Static social proof cards for the marketing layer, styled to feel trustworthy and grounded."
            />

            <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
              {testimonials.map((testimonial) => (
                <Grid item xs={12} md={4} key={testimonial.name}>
                  <Paper
                    elevation={0}
                    sx={{
                      ...PUBLIC_SURFACE_SX,
                      p: 3,
                      height: "100%",
                      borderRadius: 5,
                    }}
                  >
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: PUBLIC_UI.primarySoft,
                            color: PUBLIC_UI.primary,
                            fontWeight: 800,
                          }}
                        >
                          {getUserInitials(testimonial.name)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 800, color: PUBLIC_UI.text }}>
                            {testimonial.name}
                          </Typography>
                          <Stack direction="row" spacing={0.3}>
                            {Array.from({ length: testimonial.rating }).map((_, index) => (
                              <StarRoundedIcon
                                key={`${testimonial.name}-star-${index + 1}`}
                                sx={{ fontSize: 18, color: PUBLIC_UI.accent }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      </Stack>
                      <Typography sx={{ color: PUBLIC_UI.muted, lineHeight: 1.75 }}>
                        {testimonial.quote}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4.5 },
              borderRadius: 6,
              background: `linear-gradient(135deg, ${PUBLIC_UI.primary} 0%, ${PUBLIC_UI.pageTopDark} 100%)`,
              color: "#fff",
              boxShadow: PUBLIC_UI.heroShadow,
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
            >
              <Box sx={{ maxWidth: 620 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: "-0.04em" }}>
                  Start building your next reading streak with BookNest
                </Typography>
                <Typography sx={{ mt: 1.2, color: "rgba(255,255,255,0.78)", lineHeight: 1.75 }}>
                  Explore the catalogue, save books you love, and manage everything from a
                  production-ready reader dashboard.
                </Typography>
              </Box>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems="center"
                sx={{
                  "& > *": {
                    minHeight: 56,
                    minWidth: { xs: "100%", sm: 176 },
                  },
                }}
              >
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  sx={{
                    ...PUBLIC_BUTTON_GHOST_SX,
                    bgcolor: "#FFFFFF",
                    color: PUBLIC_UI.primary,
                    borderRadius: 3,
                    fontWeight: 800,
                    justifyContent: "center",
                  }}
                >
                  Get Started
                </Button>
                <Button
                  component={RouterLink}
                  to="/books"
                  variant="outlined"
                  sx={{
                    ...PUBLIC_BUTTON_PRIMARY_SX,
                    borderRadius: 3,
                    color: "#fff",
                    borderColor: "transparent",
                    justifyContent: "center",
                  }}
                >
                  Browse Books
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
