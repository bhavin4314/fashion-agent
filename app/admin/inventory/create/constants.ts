export const CATEGORY_OPTIONS = [
  { label: "Apparel", value: "apparel" },
  { label: "Footwear", value: "footwear" },
  { label: "Accessories", value: "accessories" },
] as const;

export const GENDER_OPTIONS = ["Men", "Women", "Unisex"] as const;

export const SEASON_OPTIONS = ["Summer", "Autumn", "Winter", "Spring"] as const;

export const APPAREL_SIZES_PRESET = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export const FOOTWEAR_SIZES_PRESET = ["7", "8", "9", "10", "11"] as const;

export const MATERIALS_PRESET = [
  "Cashmere",
  "Suede",
  "Silk",
  "Leather",
  "Cotton",
  "Wool",
  "Linen",
] as const;

export const AESTHETICS_PRESET = [
  "Quiet Luxury",
  "Minimalist",
  "Old Money",
  "Casual",
  "Vintage",
  "Avant-Garde",
] as const;

export const OCCASIONS_PRESET = [
  "Evening Lounge",
  "Gala Night",
  "Resort Casual",
  "Everyday",
  "Office",
  "Travel",
] as const;

export const FIT_PRESETS = ["Slim", "Regular", "Relaxed", "Oversized"] as const;
