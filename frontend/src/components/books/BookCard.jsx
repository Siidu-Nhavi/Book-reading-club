import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, Button, Chip, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
        p: 0,
        minWidth: fixedWidthVariant ? PUBLIC_UI.bookCardWidth : "auto",
        width: fixedWidthVariant ? PUBLIC_UI.bookCardWidth : "100%",
        height: "100%",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/books/${book._id}`)}
    >
      <Stack spacing={0} sx={{ height: "100%" }}>
        <Box sx={{ position: "relative" }}>
          <Box
            component={Link}
            to={`/books/${book._id}`}
            onClick={(event) => event.stopPropagation()}
            sx={{
              display: "block",
              position: "relative",
              textDecoration: "none",
            }}
          >
            <BookMedia book={book} radius={0} titleMaxLength={36} aspectRatio="16 / 10" />
          </Box>

          <Box sx={{ position: "absolute", top: 12, right: showWishlist ? 46 : 12 }}>
            <AvailabilityBadge available={Boolean(book?.isAvailable)} />
          </Box>

          {showWishlist ? (
            <IconButton
              size="small"
              aria-label={wishlistActive ? "Remove from wishlist" : "Add to wishlist"}
              onClick={(event) => {
                event.stopPropagation();
                onWishlistToggle?.(book);
              }}
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

        <Stack spacing={0.9} sx={{ flexGrow: 1, p: 2 }}>
          <Chip
            label={formatCategoryLabel(book?.category)}
            size="small"
            sx={{
              width: "fit-content",
              bgcolor: PUBLIC_UI.accentSoft,
              color: PUBLIC_UI.accent,
              fontWeight: 700,
              borderRadius: 999,
            }}
          />

          <Typography
            component={Link}
            to={`/books/${book._id}`}
            onClick={(event) => event.stopPropagation()}
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
              sx={{ color: PUBLIC_UI.accent, fontWeight: 800, fontFamily: '"Playfair Display", serif' }}
            >
              {formatBookPrice(book?.price)} / week
            </Typography>
            <RatingStars rating={rating} count={reviewCount} />
          </Stack>
        </Stack>

        {showRentButton ? (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            sx={{
              borderTop: `1px solid ${PUBLIC_UI.border}`,
              p: 2,
              pt: 1.5,
              mt: "auto",
            }}
          >
            <Typography sx={{ color: PUBLIC_UI.accent, fontWeight: 900, fontFamily: '"Playfair Display", serif' }}>
              {formatBookPrice(book?.price)} / week
            </Typography>

            <Button
              variant="contained"
              disabled={!book?.isAvailable}
              endIcon={book?.isAvailable ? <ArrowForwardRoundedIcon /> : null}
              onClick={(event) => {
                event.stopPropagation();
                onRent?.(book);
              }}
              sx={{
                ...PUBLIC_BUTTON_PRIMARY_SX,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 700,
                px: 1.7,
                py: 0.7,
                bgcolor: PUBLIC_UI.accent,
                "&:hover": {
                  bgcolor: "#f1883e",
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(255, 158, 87, 0.2)",
                  color: PUBLIC_UI.muted,
                },
              }}
            >
              {book?.isAvailable ? "Rent Now" : "Rented"}
            </Button>
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
}
