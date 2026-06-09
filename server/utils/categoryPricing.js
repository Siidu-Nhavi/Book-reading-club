function normalizeCategory(category = "") {
  return String(category || "").trim().toLowerCase();
}

function roundCurrency(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function calculateBookPricing({ basePrice, category }) {
  const normalizedBasePrice = Number.isFinite(Number(basePrice)) ? Number(basePrice) : 0;
  const pricePerDay = roundCurrency(normalizedBasePrice * 0.001) + 1;
  const depositAmount = roundCurrency(normalizedBasePrice);
  const replacementCost = roundCurrency(normalizedBasePrice);

  return {
    rentPrice: roundCurrency(normalizedBasePrice),
    pricePerDay,
    depositAmount,
    replacementCost,
  };
}

module.exports = {
  normalizeCategory,
  calculateBookPricing,
};
