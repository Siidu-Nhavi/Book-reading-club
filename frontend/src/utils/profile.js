export const BOOKNEST_COLORS = {
  primaryBrown: "#7C4F1E",
  secondaryBrown: "#8B5E2E",
  cream: "#F5F0E8",
  card: "#FFFFFF",
  gold: "#C89A4F",
  text: "#2F2418",
  muted: "#776551",
  border: "rgba(124, 79, 30, 0.14)",
  soft: "#FBF6EF",
  danger: "#C55353",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getUserInitials(name = "", email = "") {
  const source = (name || email || "Book Nest").replace(/[@._-]/g, " ").trim();
  const parts = source.split(/\s+/).filter(Boolean);

  return (
    parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "BN"
  );
}

export function isValidAvatarUrl(value = "") {
  if (!value) {
    return true;
  }

  return /^https?:\/\/\S+$/i.test(value);
}

export function isValidEmail(value = "") {
  return emailPattern.test(value.trim());
}

export function getMobileDigits(value = "") {
  return value.replace(/\D/g, "");
}

export function isValidMobileNumber(value = "") {
  if (!value.trim()) {
    return false;
  }

  const digits = getMobileDigits(value);
  return digits.length === 10 || (digits.length === 12 && digits.startsWith("91"));
}

export function isValidAddress(value = "") {
  return value.trim().length >= 10;
}

export function getProfileCompletion(user = {}) {
  const checks = [
    {
      key: "name",
      label: "Full Name",
      weight: 20,
      complete: Boolean(user?.name?.trim()),
    },
    {
      key: "email",
      label: "Email",
      weight: 20,
      complete: isValidEmail(user?.email || ""),
    },
    {
      key: "mobileNumber",
      label: "Mobile Number",
      weight: 15,
      complete: isValidMobileNumber(user?.mobileNumber || ""),
    },
    {
      key: "address",
      label: "Address",
      weight: 15,
      complete: isValidAddress(user?.address || ""),
    },
    {
      key: "avatarUrl",
      label: "Avatar / Profile Photo",
      weight: 15,
      complete: Boolean(user?.avatarUrl?.trim()),
    },
    {
      key: "bio",
      label: "Bio",
      weight: 15,
      complete: Boolean(user?.bio?.trim()),
    },
  ];

  const percentage = checks.reduce(
    (total, field) => total + (field.complete ? field.weight : 0),
    0,
  );

  return {
    percentage,
    fields: checks,
    completedFields: checks.filter((field) => field.complete),
    missingFields: checks.filter((field) => !field.complete),
  };
}

export function formatUpdatedAt(value) {
  if (!value) {
    return "Not saved yet";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Not saved yet";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

