import { Container } from "@mui/material";
import LoadingSkeleton from "../common/LoadingSkeleton";

export default function RouteFallback() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <LoadingSkeleton variant="page" />
    </Container>
  );
}
