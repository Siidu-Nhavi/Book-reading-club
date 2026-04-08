import { Paper, Skeleton, Stack } from "@mui/material";
import { PUBLIC_CARD_SX, PUBLIC_UI } from "../../utils/publicUi";

export default function LoadingSkeleton({ variant = "book", count = 1 }) {
  if (variant === "page") {
    return (
      <Stack spacing={3}>
        <Skeleton variant="rounded" height={72} />
        <Skeleton variant="rounded" height={360} />
        <Skeleton variant="rounded" height={220} />
      </Stack>
    );
  }

  return Array.from({ length: count }).map((_, index) => (
    <Paper
      key={`${variant}-skeleton-${index + 1}`}
      elevation={0}
      sx={{
        ...PUBLIC_CARD_SX,
        p: PUBLIC_UI.cardPadding,
        minWidth: variant === "featured" ? 280 : "auto",
      }}
    >
      <Stack spacing={1.5}>
        <Skeleton variant="rounded" sx={{ borderRadius: 4 }} height={290} />
        <Skeleton variant="text" width="72%" />
        <Skeleton variant="text" width="48%" />
        <Skeleton variant="text" width="36%" />
      </Stack>
    </Paper>
  ));
}
