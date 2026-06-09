import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { listingsApi } from "../../api";
import DashboardBookRow from "../../components/dashboard/DashboardBookRow";
import usePageTitle from "../../hooks/usePageTitle";
import {
  formatBookPrice,
  formatCategoryLabel,
  getBookGradient,
  getBookInitials,
  getBookWeeklyPrice,
} from "../../utils/books";
import { BOOKNEST_COLORS } from "../../utils/profile";

const INITIAL_FORM = {
  title: "",
  author: "",
  description: "",
  category: "",
  image: "",
  rentPrice: "",
};

function normalizeFormFromListing(listing = {}) {
  return {
    title: listing.title || "",
    author: listing.author || "",
    description: listing.description || "",
    category: listing.category || "",
    image: listing.image || "",
    rentPrice: listing.rentPrice ? String(listing.rentPrice) : "",
  };
}

function toDashboardListing(listing = {}) {
  const weeklyRent = getBookWeeklyPrice(listing);
  const isActive = listing.isAvailable && listing.listingStatus !== "inactive";

  return {
    id: String(listing._id || ""),
    title: listing.title || "Untitled Book",
    author: listing.author || "Unknown Author",
    category: formatCategoryLabel(listing.category || "general"),
    weeklyRent,
    priceLabel: `${formatBookPrice(weeklyRent)} / week`,
    availability: isActive ? "active" : "paused",
    availabilityLabel: isActive ? "Available" : "Paused",
    cover: {
      image: listing.image || "",
      gradient: getBookGradient(listing._id || listing.title || "book"),
      initials: getBookInitials(listing.title || "Book"),
    },
    meta: listing.listedAt
      ? `Listed ${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(listing.listedAt))}`
      : "Listed by you",
    ctaLabel: "View book",
    ctaTo: `/books/${listing._id}`,
  };
}

function validateForm(form) {
  const requiredFields = ["title", "author", "description", "category", "image"];
  const missingField = requiredFields.find((field) => !form[field].trim());

  if (missingField) {
    return "Please fill in all listing details.";
  }

  const rentPrice = Number.parseFloat(form.rentPrice);

  if (!Number.isFinite(rentPrice) || rentPrice <= 0) {
    return "Rent price must be a positive number.";
  }

  return "";
}

function buildPayload(form) {
  return {
    title: form.title.trim(),
    author: form.author.trim(),
    description: form.description.trim(),
    category: form.category.trim(),
    image: form.image.trim(),
    rentPrice: Number.parseFloat(form.rentPrice),
  };
}

export default function MyListingsPage() {
  usePageTitle("My Listings - BookNest");

  const [form, setForm] = useState(INITIAL_FORM);
  const [listings, setListings] = useState([]);
  const [editingListing, setEditingListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isEditing = Boolean(editingListing?._id);

  const loadListings = async () => {
    const response = await listingsApi.getMyListings();
    setListings(Array.isArray(response?.listings) ? response.listings : []);
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await listingsApi.getMyListings();

        if (active) {
          setListings(Array.isArray(response?.listings) ? response.listings : []);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || "Unable to load your listings.");
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
  }, []);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setError("");
    setMessage("");
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingListing(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");

      if (isEditing) {
        await listingsApi.updateListing(editingListing._id, buildPayload(form));
        setMessage("Listing updated successfully.");
      } else {
        await listingsApi.createListing(buildPayload(form));
        setMessage("Listing created successfully.");
      }

      resetForm();
      await loadListings();
    } catch (requestError) {
      setError(requestError.message || "Unable to save listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setForm(normalizeFormFromListing(listing));
    setError("");
    setMessage("");
  };

  const handleDelete = async (listing) => {
    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");
      await listingsApi.deleteListing(listing._id);
      setMessage("Listing removed successfully.");

      if (editingListing?._id === listing._id) {
        resetForm();
      }

      await loadListings();
    } catch (requestError) {
      setError(requestError.message || "Unable to remove listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 3, border: `1px solid ${BOOKNEST_COLORS.border}` }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: { md: "center" } }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
              My Listings
            </Typography>
            <Typography sx={{ color: BOOKNEST_COLORS.muted }}>
              Add books you own to the rental catalog and manage them from your dashboard.
            </Typography>
          </Box>
          <Chip
            label={`${listings.length} listed`}
            sx={{
              alignSelf: { xs: "flex-start", md: "center" },
              borderRadius: 999,
              bgcolor: "rgba(124, 79, 30, 0.08)",
              color: BOOKNEST_COLORS.primaryBrown,
              fontWeight: 700,
            }}
          />
        </Stack>
      </Paper>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {message ? <Alert severity="success">{message}</Alert> : null}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "0.9fr 1.1fr" }, gap: 2.5 }}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={0}
          sx={{
            p: { xs: 2, md: 2.5 },
            borderRadius: 3,
            border: `1px solid ${BOOKNEST_COLORS.border}`,
            bgcolor: BOOKNEST_COLORS.card,
          }}
        >
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ color: BOOKNEST_COLORS.text, fontWeight: 700, fontSize: "1.05rem" }}>
                {isEditing ? "Edit Listing" : "Create Listing"}
              </Typography>
              <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                These details are published into the book rental catalog.
              </Typography>
            </Box>

            <TextField label="Book title" value={form.title} onChange={handleChange("title")} fullWidth />
            <TextField label="Author" value={form.author} onChange={handleChange("author")} fullWidth />
            <TextField label="Category" value={form.category} onChange={handleChange("category")} fullWidth />
            <TextField
              label="Cover image URL"
              value={form.image}
              onChange={handleChange("image")}
              fullWidth
            />
            <TextField
              label="Replacement / rent base price"
              type="number"
              value={form.rentPrice}
              onChange={handleChange("rentPrice")}
              inputProps={{ min: 1, step: "0.01" }}
              fullWidth
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={handleChange("description")}
              multiline
              minRows={4}
              fullWidth
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={<AddRoundedIcon />}
                sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}
              >
                {isSubmitting ? "Saving..." : isEditing ? "Update Listing" : "Create Listing"}
              </Button>
              {isEditing ? (
                <Button
                  type="button"
                  variant="outlined"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  sx={{
                    borderRadius: 999,
                    textTransform: "none",
                    color: BOOKNEST_COLORS.primaryBrown,
                    borderColor: BOOKNEST_COLORS.border,
                  }}
                >
                  Cancel Edit
                </Button>
              ) : null}
            </Stack>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 2.5 },
            borderRadius: 3,
            border: `1px solid ${BOOKNEST_COLORS.border}`,
            bgcolor: BOOKNEST_COLORS.card,
          }}
        >
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ color: BOOKNEST_COLORS.text, fontWeight: 700, fontSize: "1.05rem" }}>
                Your Listed Books
              </Typography>
              <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                Edit catalog details or remove listings you no longer want to rent out.
              </Typography>
            </Box>

            {isLoading ? (
              <Typography sx={{ color: BOOKNEST_COLORS.muted }}>Loading listings...</Typography>
            ) : listings.length === 0 ? (
              <Alert severity="info">No listings yet. Add your first book with the form.</Alert>
            ) : (
              <Stack spacing={1.5}>
                {listings.map((listing) => (
                  <Box key={listing._id}>
                    <DashboardBookRow book={toDashboardListing(listing)} />
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      sx={{ justifyContent: "flex-end", mt: 1 }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditRoundedIcon />}
                        onClick={() => handleEdit(listing)}
                        disabled={isSubmitting}
                        sx={{
                          borderRadius: 999,
                          textTransform: "none",
                          color: BOOKNEST_COLORS.primaryBrown,
                          borderColor: BOOKNEST_COLORS.border,
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DeleteOutlineRoundedIcon />}
                        onClick={() => handleDelete(listing)}
                        disabled={isSubmitting}
                        sx={{
                          borderRadius: 999,
                          textTransform: "none",
                          color: "#b42318",
                          borderColor: "rgba(180, 35, 24, 0.25)",
                        }}
                      >
                        Remove
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
