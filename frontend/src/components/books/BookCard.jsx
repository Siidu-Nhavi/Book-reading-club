import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { Box, Button, Chip, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import {
  formatBookPrice,
  formatCategoryLabel,
  getBookRating,
  getBookReviewCount,
  truncateText,
} from "../../utils/books";
import {
  PUBLIC_BUTTON_PRIMARY_SX,
  PUBLIC_CARD_SX,
  PUBLIC_UI,
} from "../../utils/publicUi";
import AvailabilityBadge from "../common/AvailabilityBadge";
import RatingStars from "../common/RatingStars";
import BookMedia from "./BookMedia";

export default function BookCard({
  book,
  variant = "catalog",
  wishlistActive = false,
  onWishlistToggle,
  onRent,
  showWishlist = true,
  showRentButton = true,
}) {
  const rating = getBookRating(book);
  const reviewCount = getBookReviewCount(book);
  const featuredVariant = variant === "featured";
  const similarVariant = variant === "similar";
  const fixedWidthVariant = featuredVariant;

  return (
    <Paper
      elevation={0}
      sx={{
        ...PUBLIC_CARD_SX,
        p: 2,
        minWidth: fixedWidthVariant ? PUBLIC_UI.bookCardWidth : "auto",
        width: fixedWidthVariant ? PUBLIC_UI.bookCardWidth : "100%",
        height: "100%",
      }}
    >
      <Stack spacing={1.6} sx={{ height: "100%" }}>
        <Box sx={{ position: "relative" }}>
          <Box
            component={Link}
            to={`/books/${book._id}`}
            sx={{
              display: "block",
              position: "relative",
              textDecoration: "none",
              borderRadius: 4,
            }}
          >
            <BookMedia book={book} radius={4} titleMaxLength={36} />
          </Box>

          <Chip
            label={formatCategoryLabel(book?.category)}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              bgcolor: "rgba(255, 255, 255, 0.94)",
              color: PUBLIC_UI.primary,
              fontWeight: 700,
              borderRadius: 999,
            }}
          />

          {showWishlist ? (
            <IconButton
              size="small"
              aria-label={wishlistActive ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => onWishlistToggle?.(book)}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                bgcolor: "rgba(255,255,255,0.94)",
                "&:hover": {
                  bgcolor: "#fff",
                },
              }}
            >
              {wishlistActive ? (
                <FavoriteRoundedIcon sx={{ color: PUBLIC_UI.danger }} />
              ) : (
                <FavoriteBorderRoundedIcon sx={{ color: PUBLIC_UI.primary }} />
              )}
            </IconButton>
          ) : null}
        </Box>

        <Stack spacing={0.9} sx={{ flexGrow: 1 }}>
          <Typography
            component={Link}
            to={`/books/${book._id}`}
            variant="h6"
            sx={{
              textDecoration: "none",
              color: PUBLIC_UI.text,
              fontWeight: 800,
              fontSize: similarVariant ? "1rem" : "1.08rem",
              lineHeight: 1.25,
              minHeight: similarVariant ? 48 : 56,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {truncateText(book?.title || "Untitled Book", 52)}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: PUBLIC_UI.muted,
              minHeight: 22,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            by {book?.author || "Unknown Author"}
          </Typography>

          <RatingStars rating={rating} count={reviewCount} />

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography
              variant="body1"
              sx={{ color: PUBLIC_UI.primary, fontWeight: 800 }}
            >
              {formatBookPrice(book?.price)} / day
            </Typography>
            <AvailabilityBadge available={Boolean(book?.isAvailable)} />
          </Stack>
        </Stack>

        {showRentButton ? (
          <Button
            variant="contained"
            disabled={!book?.isAvailable}
            onClick={() => onRent?.(book)}
            sx={{
              ...PUBLIC_BUTTON_PRIMARY_SX,
              mt: "auto",
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
              "&.Mui-disabled": {
                bgcolor: "rgba(108, 92, 231, 0.12)",
                color: PUBLIC_UI.muted,
              },
            }}
          >
            {book?.isAvailable ? "Rent Now" : "Currently Rented"}
          </Button>
        ) : null}
      </Stack>
    </Paper>
  );
}
