import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Chip, Container, Drawer, Paper, Stack, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import BookCard from "../components/books/BookCard";
import BookCardSkeleton from "../components/books/BookCardSkeleton";
import FilterSidebar from "../components/books/FilterSidebar";
import BooksPagination from "../components/books/Pagination";
import ResultsBar from "../components/books/ResultsBar";
import EmptyState from "../components/common/EmptyState";
import { categoryLinks } from "../data/navLinks";
import { useAuth } from "../context/useAuth";
import usePageTitle from "../hooks/usePageTitle";
import { fetchAllBooks } from "../utils/bookCatalog";
import {
  getBookPopularityScore,
  getBookRating,
  getPriceBounds,
  getWishlistIds,
  toggleWishlistBook,
} from "../utils/books";
import { PUBLIC_SURFACE_SX, PUBLIC_UI } from "../utils/publicUi";

const PAGE_SIZE = 12;

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "top_rated", label: "Top Rated" },
];

function normalizeCategory(value = "") {
  return value.trim().toLowerCase();
}

function getCategoryValueFromLink(to = "") {
  const [, query = ""] = to.split("?");
  const params = new URLSearchParams(query);
  return normalizeCategory(params.get("category") || "");
}

function parseCategoryParams(searchParams) {
  return searchParams
    .getAll("category")
    .flatMap((value) => String(value).split(","))
    .map(normalizeCategory)
    .filter(Boolean);
}

function getRelevanceScore(book, query) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return 0;
  }

  const title = String(book.title || "").toLowerCase();
  const author = String(book.author || "").toLowerCase();
  const category = String(book.category || "").toLowerCase();
  const description = String(book.description || "").toLowerCase();

  let score = 0;

  if (title.includes(normalized)) score += 8;
  if (author.includes(normalized)) score += 4;
  if (category.includes(normalized)) score += 3;
  if (description.includes(normalized)) score += 1;

  return score;
}

function compareBooks(left, right, sortBy, searchTerm) {
  switch (sortBy) {
    case "price_asc":
      return (left.price || 0) - (right.price || 0);
    case "price_desc":
      return (right.price || 0) - (left.price || 0);
    case "popular":
      return getBookPopularityScore(right) - getBookPopularityScore(left);
    case "top_rated":
      return getBookRating(right) - getBookRating(left);
    case "newest":
      return new Date(right.createdAt || 0) - new Date(left.createdAt || 0);
    case "relevance":
    default: {
      const relevanceDiff = getRelevanceScore(right, searchTerm) - getRelevanceScore(left, searchTerm);
      if (relevanceDiff !== 0) {
        return relevanceDiff;
      }

      return new Date(right.createdAt || 0) - new Date(left.createdAt || 0);
    }
  }
}

export default function BooksCatalogPage() {
  usePageTitle("Books - BookNest");

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [allBooks, setAllBooks] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const catalogRef = useRef(null);

  const searchTerm = (searchParams.get("search") || "").trim();
  const selectedCategories = parseCategoryParams(searchParams);
  const availability = searchParams.get("availability") || "all";
  const minRating = Number(searchParams.get("rating") || 0);
  const sortBy = searchParams.get("sort") || "relevance";
  const currentPage = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10));

  useEffect(() => {
    setWishlistIds(getWishlistIds());
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCatalog = async () => {
      setIsLoading(true);
      setError("");

      try {
        const books = await fetchAllBooks({ sortBy: "newest" });

        if (!isMounted) {
          return;
        }

        setAllBooks(books);
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

  const categoryOptions = useMemo(() => {
    const counts = allBooks.reduce((acc, book) => {
      const key = normalizeCategory(book.category || "");
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return categoryLinks
      .map((category) => {
        const value = getCategoryValueFromLink(category.to);

        return {
          label: category.label,
          value,
          count: counts[value] || 0,
        };
      })
      .filter((category) => Boolean(category.value));
  }, [allBooks]);

  const categoryLabelMap = useMemo(
    () =>
      categoryOptions.reduce((acc, category) => {
        acc[category.value] = category.label;
        return acc;
      }, {}),
    [categoryOptions],
  );

  const priceBounds = useMemo(() => getPriceBounds(allBooks), [allBooks]);

  const minPriceParam = Number(searchParams.get("minPrice"));
  const maxPriceParam = Number(searchParams.get("maxPrice"));

  const priceRange = useMemo(() => {
    const min = Number.isFinite(minPriceParam) ? Math.max(priceBounds.min, minPriceParam) : priceBounds.min;
    const max = Number.isFinite(maxPriceParam) ? Math.min(priceBounds.max, maxPriceParam) : priceBounds.max;

    if (min <= max) {
      return [min, max];
    }

    return [priceBounds.min, priceBounds.max];
  }, [maxPriceParam, minPriceParam, priceBounds.max, priceBounds.min]);

  const filteredBooks = useMemo(() => {
    const normalizedQuery = searchTerm.toLowerCase();

    return [...allBooks]
      .filter((book) => {
        if (!normalizedQuery) {
          return true;
        }

        const haystack = `${book.title} ${book.author} ${book.category} ${book.description || ""}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .filter((book) =>
        selectedCategories.length > 0
          ? selectedCategories.includes(normalizeCategory(book.category))
          : true,
      )
      .filter((book) => {
        if (availability === "available") {
          return Boolean(book.isAvailable);
        }

        if (availability === "coming_soon") {
          return !book.isAvailable;
        }

        return true;
      })
      .filter((book) => book.price >= priceRange[0] && book.price <= priceRange[1])
      .filter((book) => getBookRating(book) >= minRating)
      .sort((left, right) => compareBooks(left, right, sortBy, searchTerm));
  }, [allBooks, availability, minRating, priceRange, searchTerm, selectedCategories, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedBooks = filteredBooks.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalPages) {
      const next = new URLSearchParams(searchParams);
      next.set("page", String(totalPages));
      setSearchParams(next, { replace: true });
    }
  }, [currentPage, searchParams, setSearchParams, totalPages]);

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedCategories.length > 0 ||
    availability !== "all" ||
    minRating > 0 ||
    sortBy !== "relevance" ||
    searchParams.has("minPrice") ||
    searchParams.has("maxPrice");

  const updateParams = (updater, { resetPage = true } = {}) => {
    const next = new URLSearchParams(searchParams);
    updater(next);

    if (resetPage) {
      next.set("page", "1");
    }

    setSearchParams(next);
  };

  const setCategoryValues = (values) => {
    updateParams((next) => {
      next.delete("category");
      values.forEach((value) => next.append("category", value));
    });
  };

  const handleToggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setCategoryValues(selectedCategories.filter((item) => item !== category));
      return;
    }

    setCategoryValues([...selectedCategories, category]);
  };

  const handleAvailabilityChange = (value) => {
    updateParams((next) => {
      if (value === "all") {
        next.delete("availability");
        return;
      }
      next.set("availability", value);
    });
  };

  const handleRatingChange = (value) => {
    updateParams((next) => {
      if (!value) {
        next.delete("rating");
        return;
      }
      next.set("rating", String(value));
    });
  };

  const handlePriceRangeChange = (value) => {
    if (!Array.isArray(value)) {
      return;
    }

    updateParams((next) => {
      if (value[0] <= priceBounds.min) {
        next.delete("minPrice");
      } else {
        next.set("minPrice", String(Math.round(value[0])));
      }

      if (value[1] >= priceBounds.max) {
        next.delete("maxPrice");
      } else {
        next.set("maxPrice", String(Math.round(value[1])));
      }
    });
  };

  const handleSortChange = (value) => {
    updateParams((next) => {
      if (!value || value === "relevance") {
        next.delete("sort");
        return;
      }

      next.set("sort", value);
    });
  };

  const handlePageChange = (page) => {
    updateParams(
      (next) => {
        if (page <= 1) {
          next.delete("page");
        } else {
          next.set("page", String(page));
        }
      },
      { resetPage: false },
    );

    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const activeFilters = [
    ...(searchTerm
      ? [
          {
            key: "search",
            label: `Search: ${searchTerm}`,
            onDelete: () => updateParams((next) => next.delete("search")),
          },
        ]
      : []),
    ...selectedCategories.map((category) => ({
      key: `category-${category}`,
      label: categoryLabelMap[category] || category,
      onDelete: () => setCategoryValues(selectedCategories.filter((item) => item !== category)),
    })),
    ...(availability !== "all"
      ? [
          {
            key: "availability",
            label: availability === "available" ? "Available Now" : "Coming Soon",
            onDelete: () => handleAvailabilityChange("all"),
          },
        ]
      : []),
    ...(minRating > 0
      ? [
          {
            key: "rating",
            label: `${minRating}+ stars`,
            onDelete: () => handleRatingChange(0),
          },
        ]
      : []),
  ];

  const handleToggleWishlist = (book) => {
    const nextIds = toggleWishlistBook(book._id);
    setWishlistIds(nextIds);
  };

  const filterPanel = (
    <FilterSidebar
      categoryOptions={categoryOptions}
      selectedCategories={selectedCategories}
      onToggleCategory={handleToggleCategory}
      availability={availability}
      onAvailabilityChange={handleAvailabilityChange}
      minRating={minRating}
      onRatingChange={handleRatingChange}
      priceRange={priceRange}
      priceBounds={priceBounds}
      onPriceRangeChange={handlePriceRangeChange}
      sortBy={sortBy}
      sortOptions={sortOptions}
      onSortChange={handleSortChange}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={handleClearFilters}
    />
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
      <Stack spacing={3} ref={catalogRef}>
        {error ? (
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            {error}
          </Alert>
        ) : null}

        <Paper
          elevation={0}
          sx={{
            ...PUBLIC_SURFACE_SX,
            p: { xs: 2.2, md: 2.8 },
          }}
        >
          <Stack spacing={2.4}>
            <ResultsBar
              totalCount={filteredBooks.length}
              page={safePage}
              pageSize={PAGE_SIZE}
              search={searchTerm}
              sortBy={sortBy}
              sortOptions={sortOptions}
              onSortChange={handleSortChange}
              onOpenFilters={() => setIsMobileFiltersOpen(true)}
            />

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

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "280px minmax(0, 1fr)" },
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
                  top: 80,
                  maxHeight: "calc(100vh - 80px)",
                  overflowY: "auto",
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
                    {Array.from({ length: 12 }).map((_, index) => (
                      <BookCardSkeleton key={`book-skeleton-${index + 1}`} />
                    ))}
                  </Box>
                ) : paginatedBooks.length > 0 ? (
                  <Stack spacing={3}>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, minmax(0, 1fr))",
                          lg: "repeat(3, minmax(0, 1fr))",
                        },
                        gap: 2.2,
                      }}
                    >
                      {paginatedBooks.map((book) => (
                        <BookCard
                          key={book._id}
                          book={book}
                          wishlistActive={wishlistIds.includes(book._id)}
                          onWishlistToggle={handleToggleWishlist}
                          onRent={() => {
                            if (!isAuthenticated) {
                              navigate("/login");
                              return;
                            }
                            navigate(`/books/${book._id}`);
                          }}
                        />
                      ))}
                    </Box>

                    <BooksPagination page={safePage} totalPages={totalPages} onChange={handlePageChange} />
                  </Stack>
                ) : (
                  <EmptyState
                    title="No books found"
                    description="Try adjusting your filters or search term"
                    actionLabel="Clear All Filters"
                    actionTo="/books"
                  />
                )}
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Stack>

      <Drawer
        anchor="left"
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
        <Stack spacing={2.2}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: PUBLIC_UI.text }}>
            Refine Results
          </Typography>
          {filterPanel}
        </Stack>
      </Drawer>
    </Container>
  );
}
