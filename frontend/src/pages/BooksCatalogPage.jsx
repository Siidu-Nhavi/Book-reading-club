import { useDeferredValue, useEffect, useMemo, useState } from "react";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import BookCard from "../components/books/BookCard";
import FilterSidebar from "../components/books/FilterSidebar";
import EmptyState from "../components/common/EmptyState";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";
import usePageTitle from "../hooks/usePageTitle";
import { booksApi } from "../lib/api";
import { buildCategorySummaries, fetchAllBooks } from "../utils/bookCatalog";
import {
  getBookPopularityScore,
  getBookRating,
  getPriceBounds,
  getWishlistIds,
  toggleWishlistBook,
} from "../utils/books";
import {
  PUBLIC_BUTTON_GHOST_SX,
  PUBLIC_SURFACE_SX,
  PUBLIC_UI,
} from "../utils/publicUi";

const PAGE_SIZE = 12;

const sortOptions = [
  { value: "latest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "popular", label: "Most Popular" },
  { value: "title_asc", label: "A-Z" },
];

function compareBooks(left, right, sortBy) {
  switch (sortBy) {
    case "price_asc":
      return (left.price || 0) - (right.price || 0);
    case "popular":
      return getBookPopularityScore(right) - getBookPopularityScore(left);
    case "title_asc":
      return (left.title || "").localeCompare(right.title || "");
    case "latest":
    default:
      return new Date(right.createdAt || 0) - new Date(left.createdAt || 0);
  }
}

export default function BooksCatalogPage() {
  usePageTitle("Books - BookNest");

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [allBooks, setAllBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("category") ? searchParams.get("category").split(",").filter(Boolean) : [],
  );
  const [availability, setAvailability] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 10]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    setWishlistIds(getWishlistIds());
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCatalog = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [books, categoriesData] = await Promise.all([
          fetchAllBooks({ sortBy: "latest" }),
          booksApi.categories(),
        ]);

        if (!isMounted) {
          return;
        }

        const bounds = getPriceBounds(books);

        setAllBooks(books);
        setCategories(categoriesData.categories || []);
        setPriceRange([bounds.min, bounds.max]);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(loadError.message || "Unable to load the book catalogue.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (deferredSearchTerm.trim()) {
      params.set("search", deferredSearchTerm.trim());
    }

    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    }

    setSearchParams(params, { replace: true });
  }, [deferredSearchTerm, selectedCategories, setSearchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearchTerm, selectedCategories, availability, minRating, priceRange, sortBy]);

  const categorySummaries = useMemo(
    () => buildCategorySummaries(categories, allBooks),
    [categories, allBooks],
  );

  const priceBounds = useMemo(() => getPriceBounds(allBooks), [allBooks]);

  const filteredBooks = useMemo(() => {
    const normalizedQuery = deferredSearchTerm.trim().toLowerCase();

    return [...allBooks]
      .filter((book) => {
        if (!normalizedQuery) {
          return true;
        }

        const haystack = `${book.title} ${book.author} ${book.category}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .filter((book) =>
        selectedCategories.length > 0 ? selectedCategories.includes(book.category) : true,
      )
      .filter((book) => (availability === "available" ? Boolean(book.isAvailable) : true))
      .filter((book) => book.price >= priceRange[0] && book.price <= priceRange[1])
      .filter((book) => getBookRating(book) >= minRating)
      .sort((left, right) => compareBooks(left, right, sortBy));
  }, [allBooks, availability, deferredSearchTerm, minRating, priceRange, selectedCategories, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const quickCategoryValue = selectedCategories.length === 1 ? selectedCategories[0] : "";

  const activeFilters = [
    ...(deferredSearchTerm.trim()
      ? [
          {
            key: "search",
            label: `Search: ${deferredSearchTerm.trim()}`,
            onDelete: () => setSearchTerm(""),
          },
        ]
      : []),
    ...selectedCategories.map((category) => ({
      key: `category-${category}`,
      label: category,
      onDelete: () => {
        setSelectedCategories((current) => current.filter((item) => item !== category));
      },
    })),
    ...(availability === "available"
      ? [
          {
            key: "availability",
            label: "Available Now",
            onDelete: () => setAvailability("all"),
          },
        ]
      : []),
    ...(minRating > 0
      ? [
          {
            key: "rating",
            label: `${minRating}+ stars`,
            onDelete: () => setMinRating(0),
          },
        ]
      : []),
  ];

  const handleToggleWishlist = (book) => {
    const nextIds = toggleWishlistBook(book._id);
    setWishlistIds(nextIds);
  };

  const handleToggleCategory = (category) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setAvailability("all");
    setMinRating(0);
    setSortBy("latest");
    setPriceRange([priceBounds.min, priceBounds.max]);
  };

  const filterPanel = (
    <FilterSidebar
      categorySummaries={categorySummaries}
      selectedCategories={selectedCategories}
      onToggleCategory={handleToggleCategory}
      availability={availability}
      onAvailabilityChange={setAvailability}
      minRating={minRating}
      onRatingChange={setMinRating}
      priceRange={priceRange}
      priceBounds={priceBounds}
      onPriceRangeChange={setPriceRange}
      onClearFilters={handleClearFilters}
    />
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={4}>
        <Paper
          elevation={0}
          sx={{
            ...PUBLIC_SURFACE_SX,
            p: { xs: 2.4, md: 3 },
          }}
        >
          <Stack spacing={3}>
            <PageHeader
              eyebrow="All Books"
              title="A modular rental catalogue that feels like a real product shelf"
              subtitle="Search, filter, sort, and save books without changing the existing backend or API contract."
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "minmax(0, 1.6fr) repeat(2, minmax(180px, 220px))",
                },
                gap: 1.5,
                alignItems: "center",
              }}
            >
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by title, author, or category"
              />

              <FormControl size="medium" fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  value={quickCategoryValue}
                  onChange={(event) =>
                    setSelectedCategories(event.target.value ? [event.target.value] : [])
                  }
                  sx={{ borderRadius: 3, bgcolor: "#fff" }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categorySummaries.map((category) => (
                    <MenuItem key={category.name} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="medium" fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  label="Sort By"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  sx={{ borderRadius: 3, bgcolor: "#fff" }}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1.5}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", md: "center" }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography sx={{ color: PUBLIC_UI.muted }}>
                  Showing {filteredBooks.length} books
                </Typography>
                <Button
                  startIcon={<FilterListRoundedIcon />}
                  variant="outlined"
                  onClick={() => setIsMobileFiltersOpen(true)}
                  sx={{
                    ...PUBLIC_BUTTON_GHOST_SX,
                    display: { xs: "inline-flex", lg: "none" },
                    minHeight: 48,
                  }}
                >
                  Filters
                </Button>
              </Stack>

              {activeFilters.length > 0 ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {activeFilters.map((filter) => (
                    <Chip
                      key={filter.key}
                      label={filter.label}
                      onDelete={filter.onDelete}
                      sx={{
                        bgcolor: PUBLIC_UI.primarySoft,
                        color: PUBLIC_UI.primary,
                        fontWeight: 700,
                        borderRadius: 999,
                      }}
                    />
                  ))}
                </Stack>
              ) : null}
            </Stack>
          </Stack>
        </Paper>

        {error ? (
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            {error}
          </Alert>
        ) : null}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "320px minmax(0, 1fr)" },
            gap: 3,
            alignItems: "start",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              ...PUBLIC_SURFACE_SX,
              display: { xs: "none", lg: "block" },
              p: 2.5,
              position: "sticky",
              top: 112,
            }}
          >
            {filterPanel}
          </Paper>

          <Box>
            {isLoading ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: 2.2,
                }}
              >
                <LoadingSkeleton count={6} />
              </Box>
            ) : paginatedBooks.length > 0 ? (
              <Stack spacing={3}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: 2.2,
                  }}
                >
                  {paginatedBooks.map((book) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      wishlistActive={wishlistIds.includes(book._id)}
                      onWishlistToggle={handleToggleWishlist}
                      onRent={() => navigate(`/books/${book._id}`)}
                    />
                  ))}
                </Box>

                {totalPages > 1 ? (
                  <Stack alignItems="center">
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(_, page) => setCurrentPage(page)}
                      color="standard"
                      shape="rounded"
                      sx={{
                        "& .MuiPaginationItem-root.Mui-selected": {
                          bgcolor: PUBLIC_UI.primary,
                          color: "#fff",
                        },
                      }}
                    />
                  </Stack>
                ) : null}
              </Stack>
            ) : (
              <EmptyState
                title="No books found"
                description="Try adjusting your filters or clear the search to explore more titles in the catalogue."
                actionLabel="Clear Filters"
                actionTo="/books"
              />
            )}
          </Box>
        </Box>
      </Stack>

      <Drawer
        anchor="right"
        open={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        PaperProps={{
          sx: {
            width: "min(92vw, 360px)",
            p: 2.2,
            bgcolor: PUBLIC_UI.pageBackground,
          },
        }}
      >
        {filterPanel}
      </Drawer>
    </Container>
  );
}
