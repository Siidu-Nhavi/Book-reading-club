import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import usePageTitle from "../../hooks/usePageTitle";
import { DeleteConfirmationModal } from "../../components/admin/index.js";

const adminApi = {
  getBooks: async (params) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`/api/admin/books?${query}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch books");
    return response.json();
  },
  addBook: async (bookData) => {
    const response = await fetch("/api/admin/books", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });
    if (!response.ok) throw new Error("Failed to add book");
    return response.json();
  },
  updateBook: async (id, bookData) => {
    const response = await fetch(`/api/admin/books/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });
    if (!response.ok) throw new Error("Failed to update book");
    return response.json();
  },
  deleteBook: async (id) => {
    const response = await fetch(`/api/admin/books/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete book");
    return response.json();
  },
};

const emptyBookForm = {
  title: "",
  author: "",
  description: "",
  category: "",
  image: "",
  rentPrice: "",
  totalCopies: "1",
  isbn: "",
  publisher: "",
  yearPublished: new Date().getFullYear(),
  condition: "Good",
};

function BookFormDialog({ open, onClose, book, onSave, loading }) {
  const [formData, setFormData] = useState(emptyBookForm);
  useEffect(() => {
    if (book) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(book);
    } else {
      setFormData(emptyBookForm);
    }
  }, [book, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.author || !formData.category || !formData.rentPrice) {
      alert("Please fill in required fields: title, author, category, book price");
      return;
    }
    await onSave(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "20px",
          fontWeight: 700,
          bgcolor: "#f5f5f5",
          borderBottom: "1px solid #e0e0e0",
          padding: "20px 24px",
        }}
      >
        {book?._id ? "✏️ Edit Book" : "➕ Add New Book"}
      </DialogTitle>
      <DialogContent
        sx={{
          mt: 3,
          mb: 2,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2.5,
          padding: "24px",
        }}
      >
        <TextField
          fullWidth
          label="Title *"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter book title"
          variant="outlined"
          size="medium"
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "14px",
              padding: "10px",
              borderRadius: "8px",
            },
            "& .MuiInputBase-input": {
              padding: "12px",
            },
          }}
        />
        <TextField
          fullWidth
          label="Author *"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Enter author name"
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "14px",
              padding: "10px",
              borderRadius: "8px",
            },
          }}
        />
        <TextField
          fullWidth
          label="Category *"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g., Fiction, Non-fiction"
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "14px",
              padding: "10px",
              borderRadius: "8px",
            },
          }}
        />
        <TextField
          fullWidth
          label="Publisher"
          name="publisher"
          value={formData.publisher}
          onChange={handleChange}
          placeholder="Enter publisher name"
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "14px",
              padding: "10px",
              borderRadius: "8px",
            },
          }}
        />
        <TextField
          fullWidth
          type="number"
          label="Book Price (₹) *"
          name="rentPrice"
          value={formData.rentPrice}
          onChange={handleChange}
          placeholder="0"
          required
          helperText="Deposit equals book price; rent per day is 1% of this price."
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "14px",
              padding: "10px",
              borderRadius: "8px",
            },
          }}
        />
        <TextField
          fullWidth
          type="string"
          label="Image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL"
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "14px",
              padding: "10px",
              borderRadius: "8px",
            },
          }}
        />
        <TextField
          fullWidth
          type="number"
          label="Total Copies"
          name="totalCopies"
          value={formData.totalCopies}
          onChange={handleChange}
          placeholder="1"
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "14px",
              padding: "10px",
              borderRadius: "8px",
            },
          }}
        />
        <TextField
          fullWidth
          label="ISBN"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          placeholder="Enter ISBN"
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "14px",
              padding: "10px",
              borderRadius: "8px",
            },
          }}
        />
        <TextField
          fullWidth
          type="number"
          label="Year Published"
          name="yearPublished"
          value={formData.yearPublished}
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "14px",
              padding: "10px",
              borderRadius: "8px",
            },
          }}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter book description"
          sx={{
            gridColumn: { xs: "1 / -1", sm: "1 / -1" },
            "& .MuiOutlinedInput-root": {
              fontSize: "14px",
              padding: "10px",
              borderRadius: "8px",
            },
          }}
        />
      </DialogContent>
      <DialogActions
        sx={{
          padding: "16px 24px",
          borderTop: "1px solid #e0e0e0",
          bgcolor: "#f9f9f9",
          gap: 1,
        }}
      >
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            padding: "8px 24px",
          }}
        >
          {loading ? "Saving..." : book?._id ? "Update Book" : "Add Book"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AdminBooksPage() {
  usePageTitle("Admin Books - BookNest");
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadBooks();
  }, [page, search]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminApi.getBooks({
        page,
        limit: 10,
        search,
      });
      setBooks(data.books || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setOpenDialog(true);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setOpenDialog(true);
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await adminApi.deleteBook(bookToDelete._id);
      setDeleteDialogOpen(false);
      setBookToDelete(null);
      loadBooks();
    } catch (err) {
      setError(err.message);
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveBook = async (formData) => {
    try {
      if (selectedBook?._id) {
        await adminApi.updateBook(selectedBook._id, formData);
      } else {
        await adminApi.addBook(formData);
      }
      setOpenDialog(false);
      loadBooks();
    } catch (err) {
      setError(err.message);
    }
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
          📚 Books Management
        </Typography>
        <Typography sx={{ color: "#666", fontSize: "14px" }}>
          Manage your book collection - Add, edit, or delete books from the library.
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

      {/* Toolbar - Search and Add Button */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          borderRadius: 2,
        }}
      >
        <TextField
          placeholder="🔍 Search by title, author, or category..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{
            flex: 1,
            minWidth: 250,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              fontSize: "14px",
            },
          }}
          variant="outlined"
          size="small"
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddBook}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            padding: "8px 20px",
            borderRadius: "8px",
            whiteSpace: "nowrap",
          }}
        >
          Add New Book
        </Button>
      </Paper>

      {/* Books Table */}
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
                Title
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px" }}>
                Author
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px" }}>
                Category
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px" }} align="right">
                Rent / Day
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "14px" }} align="right">
                Copies
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
            ) : books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#999" }}>
                  <Typography>No books found. Create your first book! 📕</Typography>
                </TableCell>
              </TableRow>
            ) : (
              books.map((book, index) => (
                <TableRow
                  key={book._id}
                  sx={{
                    bgcolor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                    "&:hover": { bgcolor: "#f0f0f0" },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <TableCell sx={{ fontSize: "14px", fontWeight: 500 }}>
                    {book.title}
                  </TableCell>
                  <TableCell sx={{ fontSize: "14px", color: "#666" }}>
                    {book.author}
                  </TableCell>
                  <TableCell sx={{ fontSize: "14px" }}>
                    <Box
                      sx={{
                        display: "inline-block",
                        bgcolor: "#e3f2fd",
                        color: "#1565c0",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {book.category}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "14px", fontWeight: 600 }}>
                    ₹{Number.isFinite(book.pricePerDay)
                      ? book.pricePerDay
                      : Number.isFinite(book.rentPrice)
                        ? Number(book.rentPrice) * 0.01
                        : 0}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "14px", fontWeight: 600 }}>
                    <Box
                      sx={{
                        display: "inline-block",
                        bgcolor: "#e8f5e9",
                        color: "#2e7d32",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      {book.availableCopies}/{book.totalCopies}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditBook(book)}
                        sx={{
                          textTransform: "none",
                          fontSize: "12px",
                          borderColor: "#1565c0",
                          color: "#1565c0",
                          "&:hover": { bgcolor: "#e3f2fd", borderColor: "#0d47a1" },
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(book)}
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
                    </Stack>
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

      {/* Book Form Dialog */}
      <BookFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        book={selectedBook}
        onSave={handleSaveBook}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Book"
        message="Are you sure you want to delete this book? This action cannot be undone."
        itemName={bookToDelete?.title}
        loading={deleting}
      />
    </Box>
  );
}

