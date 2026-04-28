import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import usePageTitle from "../../hooks/usePageTitle";
import { Rating } from "@mui/material";
import { DeleteConfirmationModal } from "../../components/admin/index.js";

const adminApi = {
  getReviews: async (params) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`/api/admin/reviews?${query}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return response.json();
  },
  deleteReview: async (id) => {
    const response = await fetch(`/api/admin/reviews/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete review");
    return response.json();
  },
};

export default function AdminReviewsPage() {
  usePageTitle("Admin Reviews - BookNest");
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminApi.getReviews({
        page,
        limit: 10,
      });
      setReviews(data.reviews || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await adminApi.deleteReview(reviewToDelete._id);
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
      loadReviews();
    } catch (err) {
      setError(err.message);
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontSize: "28px",
            color: "#1565c0",
            mb: 1,
          }}
        >
          ⭐ Reviews Management
        </Typography>
        <Typography sx={{ color: "#666", fontSize: "14px" }}>
          Moderate user reviews, manage ratings, and maintain content quality.
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 1.5 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* Reviews Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#1565c0" }}>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px" }}>
                Reviewer
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px" }}>
                Book
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px" }} align="center">
                Rating
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px" }}>
                Review Text
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px" }}>
                Date
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#999" }}>
                  <Typography>No reviews found. 📭</Typography>
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review, index) => (
                <TableRow
                  key={review._id}
                  sx={{
                    bgcolor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                    "&:hover": { bgcolor: "#f0f0f0" },
                    transition: "background-color 0.2s ease",
                    verticalAlign: "top",
                  }}
                >
                  <TableCell sx={{ fontSize: "14px", fontWeight: 500 }}>
                    {review.user?.name || "Unknown"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "14px", color: "#666" }}>
                    {review.book?.title || "Unknown"}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "14px", py: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                      <Rating
                        value={review.rating}
                        readOnly
                        size="small"
                        sx={{
                          color: "#ffc107",
                        }}
                      />
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#1565c0",
                          fontSize: "14px",
                          ml: 0.5,
                        }}
                      >
                        {review.rating}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "13px",
                      color: "#555",
                      maxWidth: 300,
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {review.reviewText || "—"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "14px" }}>
                    {formatDate(review.createdAt)}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(review)}
                      sx={{
                        textTransform: "none",
                        fontSize: "12px",
                        borderColor: "#d32f2f",
                        color: "#d32f2f",
                        "&:hover": { bgcolor: "#ffebee", borderColor: "#b71c1c" },
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
          p: 2,
          bgcolor: "#fff",
          borderRadius: 1.5,
        }}
      >
        <Typography variant="body2" sx={{ color: "#666", fontWeight: 600 }}>
          Page {page} of {totalPages}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            sx={{ textTransform: "none" }}
          >
            ← Previous
          </Button>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            sx={{ textTransform: "none" }}
          >
            Next →
          </Button>
        </Stack>
      </Box>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        itemName={`Review by ${reviewToDelete?.user?.name} for "${reviewToDelete?.book?.title}"`}
        loading={deleting}
      />
    </Box>
  );
}
