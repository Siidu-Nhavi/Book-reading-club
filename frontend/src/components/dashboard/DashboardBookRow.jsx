import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BOOKNEST_COLORS } from "../../utils/profile";

export default function DashboardBookRow({ book }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "72px 1fr auto" },
        gap: 1.5,
        alignItems: "center",
        border: `1px solid ${BOOKNEST_COLORS.border}`,
        borderRadius: 2.5,
        p: 1.5,
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 14px 26px rgba(47, 36, 24, 0.08)",
        },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: 72 },
          height: { xs: 180, sm: 100 },
          borderRadius: 2,
          overflow: "hidden",
          background: book.cover.gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 700,
          fontSize: "1.2rem",
        }}
      >
        {book.cover.image ? (
          <Box
            component="img"
            src={book.cover.image}
            alt={book.title}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Stack spacing={1} sx={{ alignItems: "center" }}>
            <MenuBookRoundedIcon />
            <span>{book.cover.initials}</span>
          </Stack>
        )}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, color: BOOKNEST_COLORS.text }}>
          {book.title}
        </Typography>
        <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
          {book.author}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1.2, flexWrap: "wrap" }}>
          <Chip
            label={book.category}
            size="small"
            sx={{
              borderRadius: 999,
              bgcolor: "rgba(124, 79, 30, 0.08)",
              color: BOOKNEST_COLORS.primaryBrown,
              fontWeight: 600,
            }}
          />
          <Chip
            label={book.availabilityLabel}
            size="small"
            sx={{
              borderRadius: 999,
              bgcolor:
                book.availability === "active" ? "rgba(77, 136, 88, 0.12)" : "rgba(119,101,81,0.12)",
              color: book.availability === "active" ? "#32653A" : BOOKNEST_COLORS.muted,
              fontWeight: 600,
            }}
          />
        </Stack>
        <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted, mt: 1 }}>
          {book.meta}
        </Typography>
      </Box>

      <Stack spacing={1.1} sx={{ alignItems: { xs: "flex-start", sm: "flex-end" } }}>
        <Typography sx={{ fontWeight: 700, color: BOOKNEST_COLORS.text }}>
          {book.priceLabel}
        </Typography>
        {book.ctaLabel ? (
          <Button
            onClick={() => navigate(book.ctaTo)}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 999,
              textTransform: "none",
              color: BOOKNEST_COLORS.primaryBrown,
              borderColor: BOOKNEST_COLORS.border,
              "&:hover": {
                borderColor: BOOKNEST_COLORS.primaryBrown,
                bgcolor: BOOKNEST_COLORS.soft,
              },
            }}
          >
            {book.ctaLabel}
          </Button>
        ) : null}
      </Stack>
    </Box>
  );
}
