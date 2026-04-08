import { useEffect, useMemo, useRef, useState } from "react";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../context/useAuth";
import {
  BOOKNEST_COLORS,
  formatUpdatedAt,
  getUserInitials,
  isValidAddress,
  isValidAvatarUrl,
  isValidMobileNumber,
  readImageFileAsDataUrl,
} from "../utils/profile";

function validateProfile(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  } else if (values.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (values.bio.trim().length > 280) {
    errors.bio = "Bio must be 280 characters or fewer.";
  }

  if (values.mobileNumber.trim() && !isValidMobileNumber(values.mobileNumber)) {
    errors.mobileNumber = "Mobile number must contain a valid 10-digit number.";
  }

  if (values.address.trim() && !isValidAddress(values.address)) {
    errors.address = "Address must be at least 10 characters.";
  }

  if (!isValidAvatarUrl(values.avatarUrl.trim())) {
    errors.avatarUrl = "Use an image http(s) URL or upload a local image.";
  }

  return errors;
}

export default function UpdateProfile() {
  const { updateProfile, user } = useAuth();
  const fileInputRef = useRef(null);

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    bio: "",
    mobileNumber: "",
    address: "",
    avatarUrl: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    setFormValues({
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      mobileNumber: user?.mobileNumber || "",
      address: user?.address || "",
      avatarUrl: user?.avatarUrl || "",
    });
  }, [user]);

  const initials = useMemo(
    () => getUserInitials(formValues.name, formValues.email),
    [formValues.email, formValues.name],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSubmitError("");
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setIsUploading(true);
      setSubmitError("");
      const dataUrl = await readImageFileAsDataUrl(file);

      setFormValues((current) => ({
        ...current,
        avatarUrl: dataUrl,
      }));
      setErrors((current) => ({ ...current, avatarUrl: "" }));
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      event.target.value = "";
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setFormValues((current) => ({
      ...current,
      avatarUrl: "",
    }));
    setErrors((current) => ({ ...current, avatarUrl: "" }));
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextValues = {
      name: formValues.name.trim(),
      email: formValues.email.trim().toLowerCase(),
      bio: formValues.bio.trim(),
      mobileNumber: formValues.mobileNumber.trim(),
      address: formValues.address.trim(),
      avatarUrl: formValues.avatarUrl.trim(),
    };
    const nextErrors = validateProfile(nextValues);

    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setIsSaving(true);
      await updateProfile(nextValues);
      setShowSuccessToast(true);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Snackbar
        open={showSuccessToast}
        autoHideDuration={2500}
        onClose={() => setShowSuccessToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setShowSuccessToast(false)}
          severity="success"
          variant="filled"
          sx={{
            borderRadius: 2,
            bgcolor: BOOKNEST_COLORS.primaryBrown,
            color: "#fff",
          }}
        >
          Profile updated successfully ✓
        </Alert>
      </Snackbar>

      <Box>
        <Typography variant="overline" sx={{ color: BOOKNEST_COLORS.secondaryBrown, fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: BOOKNEST_COLORS.text }}>
          Update Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Edit your reader details, choose a profile image, and keep the dashboard navbar in sync.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "320px 1fr" },
          gap: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${BOOKNEST_COLORS.border}`,
            backgroundColor: BOOKNEST_COLORS.card,
            alignSelf: "start",
          }}
        >
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Avatar
              src={formValues.avatarUrl.trim()}
              sx={{
                width: 112,
                height: 112,
                bgcolor: BOOKNEST_COLORS.gold,
                color: BOOKNEST_COLORS.text,
                fontSize: 38,
                boxShadow: "0 12px 30px rgba(92, 61, 30, 0.16)",
              }}
            >
              {!formValues.avatarUrl.trim() && initials}
            </Avatar>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {formValues.name || "BookNest Reader"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formValues.email || "Add your email"}
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ color: BOOKNEST_COLORS.muted }}>
              Last Updated: {formatUpdatedAt(user?.updatedAt)}
            </Typography>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarUpload}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
              <Button
                variant="outlined"
                startIcon={<CloudUploadRoundedIcon />}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                sx={{
                  minHeight: 40,
                  borderRadius: 2,
                  textTransform: "none",
                  borderColor: BOOKNEST_COLORS.border,
                  color: BOOKNEST_COLORS.primaryBrown,
                  "&:hover": {
                    borderColor: BOOKNEST_COLORS.primaryBrown,
                    backgroundColor: BOOKNEST_COLORS.soft,
                  },
                }}
              >
                {isUploading ? "Uploading..." : "Upload Image"}
              </Button>

              {formValues.avatarUrl.trim() ? (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineRoundedIcon />}
                  onClick={handleRemoveAvatar}
                  sx={{
                    minHeight: 40,
                    borderRadius: 2,
                    textTransform: "none",
                    borderColor: "rgba(197, 83, 83, 0.35)",
                    color: BOOKNEST_COLORS.danger,
                    "&:hover": {
                      borderColor: BOOKNEST_COLORS.danger,
                      backgroundColor: "rgba(197, 83, 83, 0.06)",
                    },
                  }}
                >
                  Remove Avatar
                </Button>
              ) : null}
            </Stack>

            <Typography variant="caption" color="text.secondary">
              Upload a local image or paste a hosted image URL in the form.
            </Typography>
          </Stack>
        </Paper>

        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: `1px solid ${BOOKNEST_COLORS.border}`,
            backgroundColor: BOOKNEST_COLORS.card,
          }}
        >
          <Stack spacing={2.5}>
            {submitError ? <Alert severity="error">{submitError}</Alert> : null}

            <TextField
              label="Full Name"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name || "This name is shown across your dashboard."}
              fullWidth
            />

            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email || "This email remains tied to your login."}
              fullWidth
            />

            <TextField
              label="Avatar URL"
              name="avatarUrl"
              value={formValues.avatarUrl}
              onChange={handleChange}
              error={Boolean(errors.avatarUrl)}
              helperText={errors.avatarUrl || "Accepts http(s) image URLs and uploaded data URLs."}
              fullWidth
            />

            <TextField
              label="Bio"
              name="bio"
              value={formValues.bio}
              onChange={handleChange}
              error={Boolean(errors.bio)}
              helperText={errors.bio || `${formValues.bio.trim().length}/280 characters`}
              multiline
              minRows={4}
              fullWidth
            />

            <TextField
              label="Mobile Number"
              name="mobileNumber"
              placeholder="+91 XXXXX XXXXX"
              value={formValues.mobileNumber}
              onChange={handleChange}
              error={Boolean(errors.mobileNumber)}
              helperText={
                errors.mobileNumber ||
                "Used for rental notifications and OTP verification."
              }
              fullWidth
            />

            <TextField
              label="Address"
              name="address"
              placeholder="House no., Street, City, State, PIN"
              value={formValues.address}
              onChange={handleChange}
              error={Boolean(errors.address)}
              helperText={
                errors.address ||
                "Your pickup/delivery address for book rentals."
              }
              multiline
              minRows={3}
              fullWidth
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSaving}
                sx={{
                  minWidth: 154,
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                  bgcolor: BOOKNEST_COLORS.primaryBrown,
                  "&:hover": { bgcolor: BOOKNEST_COLORS.secondaryBrown },
                }}
              >
                {isSaving ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={16} color="inherit" />
                    <span>Saving...</span>
                  </Stack>
                ) : (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <SaveRoundedIcon fontSize="small" />
                    <span>Save Profile</span>
                  </Stack>
                )}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
