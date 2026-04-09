import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { getBookGradient, getBookInitials, truncateText } from "../../utils/books";
import { PUBLIC_UI } from "../../utils/publicUi";

export default function BookMedia({
  book,
  aspectRatio = "3 / 4",
  radius = 4,
  titleMaxLength = 40,
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const showImage = Boolean(book?.image) && !hasImageError;

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: radius,
        overflow: "hidden",
        aspectRatio,
        bgcolor: showImage ? PUBLIC_UI.surfaceMuted : undefined,
        background: showImage ? undefined : getBookGradient(book?._id || book?.title),
      }}
    >
      {showImage ? (
        <Box
          component="img"
          src={book.image}
          alt={book?.title || "Book cover"}
          loading="lazy"
          onError={() => setHasImageError(true)}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            imageRendering: "auto",
            transform: "scale(1.01)",
          }}
        />
      ) : (
        <Stack
          spacing={1.1}
          sx={{
            height: "100%",
            p: 2,
            color: "#fff",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            sx={{
              width: 58,
              height: 58,
              bgcolor: "rgba(255,255,255,0.22)",
              color: "#fff",
              fontWeight: 800,
            }}
          >
            {getBookInitials(book?.title)}
          </Avatar>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, maxWidth: 180 }}>
            {truncateText(book?.title || "Untitled Book", titleMaxLength)}
          </Typography>
          <MenuBookRoundedIcon />
        </Stack>
      )}
    </Box>
  );
}
