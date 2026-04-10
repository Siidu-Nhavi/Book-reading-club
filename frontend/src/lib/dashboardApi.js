import { booksApi } from "./api";
import { rentalsApi } from "../api";
import {
  formatBookPrice,
  formatCategoryLabel,
  getBookGradient,
  getBookInitials,
  getWeeklyRentFilterValue,
  getWishlistIds,
} from "../utils/books";
import { getProfileCompletion, getUserInitials } from "../utils/profile";

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function safeString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function formatDateLabel(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function createBookCover(book) {
  return {
    image: safeString(book?.image || book?.coverImage || book?.thumbnail || book?.coverUrl, ""),
    gradient: getBookGradient(book?._id || book?.title || book?.author || "book"),
    initials: getBookInitials(book?.title || "Book"),
  };
}

function normalizeDashboardBook(book = {}, overrides = {}) {
  const weeklyRent = getWeeklyRentFilterValue(Number(book?.price));
  const availability = book?.available === false ? "paused" : "active";

  return {
    id: String(book?._id || overrides.id || Math.random()),
    title: safeString(book?.title, "Untitled Book"),
    author: safeString(book?.author, "Unknown Author"),
    category: formatCategoryLabel(book?.category || "general"),
    weeklyRent,
    priceLabel: `${formatBookPrice(weeklyRent)} / week`,
    availability,
    availabilityLabel: availability === "active" ? "Available" : "Paused",
    cover: createBookCover(book),
    meta: overrides.meta || "",
    ctaLabel: overrides.ctaLabel || "",
    ctaTo: overrides.ctaTo || "",
  };
}

function normalizeUserSummary(user = {}) {
  const now = new Date();

  return {
    name: safeString(user?.name, "Reader"),
    email: safeString(user?.email, ""),
    initials: getUserInitials(user?.name, user?.email),
    greeting:
      now.getHours() < 12
        ? "Good morning"
        : now.getHours() < 18
          ? "Good afternoon"
          : "Good evening",
    dateLabel: new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      month: "short",
      day: "numeric",
    }).format(now),
    avatarUrl: safeString(user?.avatarUrl, ""),
    completion: getProfileCompletion(user),
    membership: "Reader Dashboard",
  };
}

function buildFallbackActivity(userSummary, listedBooks) {
  const name = userSummary.name || "You";

  return [
    {
      id: "activity-1",
      title: "Profile synced",
      description: `${name}'s dashboard layout is ready for rental activity and profile management.`,
      timeLabel: "Just now",
      tone: "primary",
    },
    {
      id: "activity-2",
      title: "Wishlist updated",
      description: listedBooks[0]
        ? `${listedBooks[0].title} is pinned as a recommended catalog pick for your dashboard.`
        : "Add books to your wishlist to surface personalized recommendations here.",
      timeLabel: "Today",
      tone: "accent",
    },
    {
      id: "activity-3",
      title: "Profile progress tracked",
      description: `Your profile is ${userSummary.completion.percentage}% complete. Fill in the remaining details to unlock a polished reader identity.`,
      timeLabel: "Today",
      tone: "muted",
    },
  ];
}

function buildFallbackRentals(catalogBooks) {
  return safeArray(catalogBooks)
    .slice(0, 3)
    .map((book, index) => {
      const dueDate = new Date();

      dueDate.setDate(dueDate.getDate() + 2 + index * 3);

      return normalizeDashboardBook(book, {
        meta: `Due ${formatDateLabel(dueDate)}`,
        ctaLabel: "Open book",
        ctaTo: `/books/${book?._id}`,
      });
    });
}

function buildFallbackListedBooks(catalogBooks) {
  return safeArray(catalogBooks)
    .slice(3, 6)
    .map((book) =>
      normalizeDashboardBook(book, {
        meta: "Live in catalog",
        ctaLabel: "View details",
        ctaTo: `/books/${book?._id}`,
      }),
    );
}

function buildFallbackWishlist(catalogBooks) {
  const wishlistIds = new Set(getWishlistIds());
  const wishlistedBooks = safeArray(catalogBooks).filter((book) => wishlistIds.has(book?._id));
  const sourceBooks = wishlistedBooks.length > 0 ? wishlistedBooks : safeArray(catalogBooks).slice(6, 9);

  return sourceBooks.map((book) =>
    normalizeDashboardBook(book, {
      meta: book?.available === false ? "Unavailable right now" : "Available to rent",
      ctaLabel: "Browse",
      ctaTo: `/books/${book?._id}`,
    }),
  );
}

function getRentalStatusLabel(status = "") {
  const normalized = String(status).toLowerCase();

  if (normalized === "active") {
    return "Active";
  }

  if (normalized === "returned") {
    return "Returned";
  }

  if (normalized === "overdue") {
    return "Overdue";
  }

  if (normalized === "penalised") {
    return "Penalised";
  }

  return "Unknown";
}

function buildLiveRentals(rentals = []) {
  return safeArray(rentals).map((rental, index) => {
    const title = safeString(rental?.book?.title, "Rented Book");
    const author = safeString(rental?.book?.author, "Unknown Author");
    const status = String(rental?.status || "active").toLowerCase();
    const dueDate = rental?.dueDate ? new Date(rental.dueDate) : null;
    const returnedDate = rental?.returnedDate ? new Date(rental.returnedDate) : null;
    const hasPenalty = Number(rental?.penaltyAmount || 0) > 0;
    const bookId = rental?.book?._id;

    let meta = "Rental in progress";

    if (status === "active" && dueDate) {
      meta = `Due ${formatDateLabel(dueDate)}`;
    } else if ((status === "returned" || status === "penalised") && returnedDate) {
      meta = `Returned ${formatDateLabel(returnedDate)}`;
    } else if (status === "overdue" && dueDate) {
      meta = `Overdue since ${formatDateLabel(dueDate)}`;
    }

    if (hasPenalty) {
      meta = `${meta} • Penalty ${formatBookPrice(Number(rental.penaltyAmount))}`;
    }

    return {
      id: String(rental?._id || `rental-${index + 1}`),
      title,
      author,
      category: "Rental",
      weeklyRent: 0,
      priceLabel: getRentalStatusLabel(status),
      availability: status === "active" ? "active" : "paused",
      availabilityLabel: getRentalStatusLabel(status),
      cover: {
        image: "",
        gradient: getBookGradient(title),
        initials: getBookInitials(title),
      },
      meta,
      ctaLabel: bookId ? "Open book" : "Browse",
      ctaTo: bookId ? `/books/${bookId}` : "/books",
    };
  });
}

function buildStats(userSummary, rentals, listedBooks, wishlist) {
  return [
    {
      id: "completion",
      label: "Profile Completion",
      value: `${userSummary.completion.percentage}%`,
      helper:
        userSummary.completion.missingFields.length > 0
          ? `${userSummary.completion.missingFields.length} details remaining`
          : "All core details saved",
      tone: "primary",
    },
    {
      id: "rentals",
      label: "Active Rentals",
      value: `${rentals.length}`,
      helper: rentals.length > 0 ? `${rentals[0].title} due next` : "No active rentals yet",
      tone: "accent",
    },
    {
      id: "listed",
      label: "Listed Books",
      value: `${listedBooks.length}`,
      helper: listedBooks.length > 0 ? "Catalog picks ready" : "Add books to start listing",
      tone: "muted",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      value: `${wishlist.length}`,
      helper: wishlist.length > 0 ? "Saved for later rentals" : "Save books you love",
      tone: "primary",
    },
  ];
}

export function normalizeDashboardOverview(raw = {}, user = {}) {
  const userSummary = normalizeUserSummary(user);
  const catalogBooks = safeArray(raw?.books);
  const rentals = buildFallbackRentals(catalogBooks);
  const listedBooks = buildFallbackListedBooks(catalogBooks);
  const wishlist = buildFallbackWishlist(catalogBooks);
  const activity = buildFallbackActivity(userSummary, listedBooks);

  return {
    userSummary,
    stats: buildStats(userSummary, rentals, listedBooks, wishlist),
    rentals,
    listedBooks,
    wishlist,
    activity,
  };
}

export async function getDashboardOverview(user, options = {}) {
  const useRealRentals = Boolean(options?.useRealRentals);

  try {
    const response = await booksApi.list({ limit: 12, sortBy: "newest" });
    const normalized = normalizeDashboardOverview({ books: response?.books || [] }, user);

    if (!useRealRentals) {
      return normalized;
    }

    try {
      const rentalsResponse = await rentalsApi.getMyRentals({ page: 1, limit: 6 });
      const liveRentals = buildLiveRentals(rentalsResponse?.rentals || []);
      const rentals = liveRentals.length > 0 ? liveRentals : normalized.rentals;

      return {
        ...normalized,
        rentals,
        stats: buildStats(normalized.userSummary, rentals, normalized.listedBooks, normalized.wishlist),
      };
    } catch {
      return normalized;
    }
  } catch {
    return normalizeDashboardOverview({ books: [] }, user);
  }
}
