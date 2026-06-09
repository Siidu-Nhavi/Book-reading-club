function normalizeCategory(value) {
  const trimmed = String(value || "").trim();
  return trimmed || "Uncategorized";
}

function normalizeSlug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

module.exports = {
  normalizeCategory,
  normalizeSlug,
};
