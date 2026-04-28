function normalizeCategory(category = "") {
  return String(category || "").trim().toLowerCase();
}

const CATEGORY_PROFILES = [
  {
    matchers: ["medical", "technology-engineering", "business-finance-law", "reference"],
    dayDivisor: 24,
    weekMultiplier: 5.8,
    monthMultiplier: 18.5,
    depositMultiplier: 0.95,
    minDeposit: 90,
    replacementMultiplier: 1,
    minDaily: 8,
  },
  {
    matchers: ["science-fiction-fantasy-horror", "teen-young-adult", "travel-holiday-guides", "society-social-sciences"],
    dayDivisor: 27,
    weekMultiplier: 5.5,
    monthMultiplier: 18,
    depositMultiplier: 0.85,
    minDeposit: 70,
    replacementMultiplier: 1,
    minDaily: 7,
  },
  {
    matchers: ["religion", "mind-body-spirit", "personal-development", "teaching-resources-education", "natural-history"],
    dayDivisor: 28,
    weekMultiplier: 5.4,
    monthMultiplier: 17.5,
    depositMultiplier: 0.8,
    minDeposit: 65,
    replacementMultiplier: 1,
    minDaily: 6,
  },
  {
    matchers: ["childrens-books", "romance", "poetry-drama", "humour", "sport", "crafts-hobbies", "transport", "stationery"],
    dayDivisor: 32,
    weekMultiplier: 5.2,
    monthMultiplier: 16.5,
    depositMultiplier: 0.65,
    minDeposit: 50,
    replacementMultiplier: 0.95,
    minDaily: 5,
  },
];

const DEFAULT_PROFILE = {
  dayDivisor: 30,
  weekMultiplier: 5.4,
  monthMultiplier: 17,
  depositMultiplier: 0.75,
  minDeposit: 55,
  replacementMultiplier: 1,
  minDaily: 5,
};

function roundCurrency(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function getCategoryPricingProfile(category) {
  const normalized = normalizeCategory(category);

  for (const profile of CATEGORY_PROFILES) {
    if (profile.matchers.includes(normalized)) {
      return profile;
    }
  }

  return DEFAULT_PROFILE;
}

function calculateBookPricing({ basePrice, category }) {
  const normalizedBasePrice = Number.isFinite(Number(basePrice)) ? Number(basePrice) : 0;
  const profile = getCategoryPricingProfile(category);
  const pricePerDay = Math.max(
    profile.minDaily,
    roundCurrency(normalizedBasePrice / profile.dayDivisor),
  );
  const pricePerWeek = Math.max(
    roundCurrency(pricePerDay * 5),
    roundCurrency(pricePerDay * profile.weekMultiplier),
  );
  const pricePerMonth = Math.max(
    roundCurrency(pricePerWeek * 3),
    roundCurrency(pricePerDay * profile.monthMultiplier),
  );
  const depositAmount = Math.max(
    profile.minDeposit,
    Math.round(pricePerWeek * profile.depositMultiplier),
  );
  const replacementCost = Math.max(
    Math.round(normalizedBasePrice * profile.replacementMultiplier),
    depositAmount + Math.round(pricePerDay * 5),
  );

  return {
    rentPrice: roundCurrency(normalizedBasePrice),
    pricePerDay,
    pricePerWeek,
    pricePerMonth,
    depositAmount,
    replacementCost,
    pricingProfile: profile,
  };
}

module.exports = {
  normalizeCategory,
  getCategoryPricingProfile,
  calculateBookPricing,
};
