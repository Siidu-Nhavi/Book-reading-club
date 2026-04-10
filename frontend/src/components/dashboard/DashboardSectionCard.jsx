import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { BOOKNEST_COLORS } from "../../utils/profile";

export default function DashboardSectionCard({
  title,
  description,
  actionLabel,
  onAction,
  children,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 3,
        border: `1px solid ${BOOKNEST_COLORS.border}`,
        backgroundColor: BOOKNEST_COLORS.card,
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}
        >
          <Box>
            <Typography sx={{ color: BOOKNEST_COLORS.text, fontWeight: 700, fontSize: "1.05rem" }}>
              {title}
            </Typography>
            {description ? (
              <Typography variant="body2" sx={{ color: BOOKNEST_COLORS.muted }}>
                {description}
              </Typography>
            ) : null}
          </Box>

          {actionLabel ? (
            <Button
              onClick={onAction}
              endIcon={<ChevronRightRoundedIcon fontSize="small" />}
              sx={{
                alignSelf: { xs: "flex-start", sm: "center" },
                textTransform: "none",
                fontWeight: 600,
                color: BOOKNEST_COLORS.primaryBrown,
                px: 0,
                minWidth: 0,
                "&:hover": { bgcolor: "transparent", color: BOOKNEST_COLORS.secondaryBrown },
              }}
            >
              {actionLabel}
            </Button>
          ) : null}
        </Stack>

        {children}
      </Stack>
    </Paper>
  );
}
