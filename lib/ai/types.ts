export type PropertyDescriptionInput = {
  title: string;
  property_type: string;
  deal_type: "rent" | "sale";
  category: string;
  price: number | string;
  location?: string;
  address?: string;
  bedrooms?: number | string | null;
  bathrooms?: number | string | null;
  area_sqft?: number | string | null;
  furnishing?: string;
  floor?: string;
  balcony?: string;
  parking?: string;
  amenities?: string[];
  bullets?: string;
};

export type PosterTaglines = {
  /** Locality / area name (large headline) */
  headline: string;
  /** Short tagline under headline */
  tagline?: string;
  bullets: string[];
  locationLine: string;
  priceLine: string;
};

export type PosterRenderMeta = {
  dealType?: "rent" | "sale";
  propertyType?: string;
  title?: string;
  location?: string | null;
  priceDisplay?: string;
  floor?: string | null;
  furnishing?: string | null;
  parking?: string | null;
  balcony?: string | null;
  bedrooms?: number | null;
  contactPhone?: string | null;
};
