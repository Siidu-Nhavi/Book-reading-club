import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, Button, Chip, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  formatBookPrice,
  getBookDepositAmount,
  getBookMonthlyPrice,
  getBookWeeklyPrice,
  formatCategoryLabel,
  truncateText,
} from "../../utils/books";
import {
  PUBLIC_BUTTON_PRIMARY_SX,
  PUBLIC_CARD_SX,
  PUBLIC_UI,
} from "../../utils/publicUi";
import AvailabilityBadge from "../common/AvailabilityBadge";
import BookMedia from "./BookMedia";

export default function BookCard({
  book,
  variant = "catalog",
  wishlistActive = false,
  onWishlistToggle,
  onRent,
  showWishlist = true,
  showRentButton = true,
  rentDisabledReason = "",
}) {
  const navigate = useNavigate();
  const featuredVariant = variant === "featured";
  const similarVariant = variant === "similar";
  const fixedWidthVariant = featuredVariant;
  const weeklyRent = getBookWeeklyPrice(book);
  const dailyRent = Number(book?.pricePerDay || 0);
  const monthlyRent = getBookMonthlyPrice(book);
  const depositAmount = getBookDepositAmount(book);
  const isRentDisabled = !book?.isAvailable || Boolean(rentDisabledReason);

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
              fontWeight: 500,
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
              fontWeight: 600,
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
        </Stack>

        {showRentButton ? (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              borderTop: `1px solid ${PUBLIC_UI.border}`,
              p: 2,
              pt: 1.5,
              mt: "auto",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack spacing={0.4}>
              <Typography sx={{ color: PUBLIC_UI.text, fontWeight: 600 }}>
                {formatBookPrice(dailyRent)} / day
              </Typography>
              <Typography variant="caption" sx={{ color: PUBLIC_UI.muted }}>
                {formatBookPrice(weeklyRent)} / week • {formatBookPrice(monthlyRent)} / month
              </Typography>
              <Typography variant="caption" sx={{ color: PUBLIC_UI.muted }}>
                Deposit: {formatBookPrice(depositAmount)}
              </Typography>
            </Stack>

            <Button
              variant="contained"
              disabled={isRentDisabled}
              endIcon={!isRentDisabled ? <ArrowForwardRoundedIcon /> : null}
              onClick={(event) => {
                event.stopPropagation();
                onRent?.(book);
              }}
              sx={{
                ...PUBLIC_BUTTON_PRIMARY_SX,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 500,
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
              {book?.isAvailable ? (rentDisabledReason ? "Unavailable" : "Rent Now") : "Rented"}
            </Button>
          </Stack>
        ) : null}
        {rentDisabledReason ? (
          <Typography sx={{ px: 2, pb: 2, color: PUBLIC_UI.muted, fontSize: "0.8rem" }}>
            {rentDisabledReason}
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  );
}
