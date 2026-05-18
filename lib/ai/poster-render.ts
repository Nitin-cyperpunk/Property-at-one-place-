import sharp from "sharp";

import type { PosterRenderMeta, PosterTaglines } from "@/lib/ai/types";

const WIDTH = 1080;
const HEIGHT = 1350;

const CREAM = "#F2EBE1";
const BROWN = "#3D2C24";
const BROWN_MID = "#5C4033";
const BEIGE = "#E8DDD0";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncate(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

async function fetchImage(url: string): Promise<Buffer> {
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "image/*" },
  });
  if (!res.ok) {
    throw new Error(`Image fetch failed (${res.status}) for ${url.slice(0, 80)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function roundedPhoto(
  buffer: Buffer,
  w: number,
  h: number,
  radius: number,
): Promise<Buffer> {
  const resized = await sharp(buffer)
    .resize(w, h, { fit: "cover", position: "centre" })
    .toBuffer();

  const mask = Buffer.from(
    `<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${radius}" ry="${radius}" fill="white"/></svg>`,
  );

  return sharp(resized)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

function buildFeatures(meta: PosterRenderMeta, bullets: string[]): string[] {
  const fromBullets = bullets.slice(0, 4).filter(Boolean);
  if (fromBullets.length >= 4) return fromBullets;

  const auto: string[] = [];
  if (meta.bedrooms != null) {
    auto.push(`${meta.bedrooms} Spacious Bedroom${meta.bedrooms > 1 ? "s" : ""}`);
  }
  if (meta.parking && meta.parking !== "no") {
    auto.push("Parking Included");
  }
  if (meta.balcony && meta.balcony !== "no") {
    auto.push("Balcony with View");
  }
  if (meta.floor) {
    auto.push(meta.floor.match(/floor/i) ? meta.floor : `${meta.floor} Floor`);
  }
  if (meta.furnishing) {
    const f = meta.furnishing.replace(/-/g, " ");
    auto.push(f.charAt(0).toUpperCase() + f.slice(1));
  }
  auto.push("Good for Family");

  const merged = [...fromBullets];
  for (const line of auto) {
    if (merged.length >= 4) break;
    if (!merged.some((m) => m.toLowerCase().includes(line.slice(0, 8).toLowerCase()))) {
      merged.push(line);
    }
  }
  return merged.slice(0, 4);
}

/** Simple line icons for feature list */
function featureRow(y: number, iconPath: string, text: string): string {
  const t = escapeXml(truncate(text, 32));
  return `
  <g transform="translate(56, ${y})">
    <circle cx="22" cy="22" r="22" fill="${BEIGE}" stroke="${BROWN_MID}" stroke-width="1.5"/>
    <g transform="translate(10, 10)" fill="none" stroke="${BROWN}" stroke-width="2" stroke-linecap="round">
      ${iconPath}
    </g>
    <text x="56" y="28" font-family="Segoe UI, system-ui, sans-serif" font-size="26" font-weight="600" fill="${BROWN}">${t}</text>
  </g>`;
}

const ICONS = {
  bed: '<rect x="1" y="8" width="18" height="8" rx="2"/><path d="M5 8V5a3 3 0 0 1 6 0v3"/>',
  car: '<path d="M3 14h16l-1-5H4L3 14z"/><circle cx="7" cy="15" r="1.5"/><circle cx="15" cy="15" r="1.5"/>',
  balcony:
    '<rect x="2" y="4" width="16" height="12" rx="1"/><path d="M6 16v2M14 16v2M2 10h16"/>',
  building: '<rect x="5" y="2" width="10" height="18" rx="1"/><path d="M8 6h1M12 6h1M8 10h1M12 10h1M8 14h1M12 14h1"/>',
  sofa: '<path d="M3 12h16v4H3z"/><path d="M5 12V8a2 2 0 0 1 12 0v4"/>',
};

function buildEditorialOverlay(
  taglines: PosterTaglines,
  meta: PosterRenderMeta,
  features: string[],
): string {
  const locality = escapeXml(
    truncate(
      meta.location?.toUpperCase() ||
        taglines.headline.toUpperCase() ||
        meta.title?.toUpperCase() ||
        "PRIME LOCATION",
      28,
    ),
  );
  const typeBadge = escapeXml(
    truncate((meta.propertyType ?? "FLAT").toUpperCase().replace(/\s+/g, " "), 14),
  );
  const tagline = escapeXml(
    truncate(
      taglines.tagline ?? "Comfort. Convenience. Perfect for Family.",
      48,
    ),
  );
  const price = escapeXml(truncate(meta.priceDisplay ?? taglines.priceLine, 24));
  const priceSuffix = meta.dealType === "sale" ? "" : " /month";
  const phone = escapeXml(truncate(meta.contactPhone ?? "Contact on RentSetGo", 18));
  const floorLabel = escapeXml(truncate(meta.floor ?? "—", 16));
  const locBar = escapeXml(truncate(meta.location ?? taglines.locationLine.replace(/^📍\s*/, ""), 20));
  const parkingLabel =
    meta.parking === "yes" || meta.parking === "street"
      ? "Available"
      : meta.parking === "no"
        ? "No"
        : "—";

  const iconKeys = ["bed", "car", "balcony", "building", "sofa"] as const;
  const featureRows = features
    .map((f, i) => featureRow(640 + i * 58, ICONS[iconKeys[i] ?? "sofa"], f))
    .join("");

  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="heroFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${CREAM}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${CREAM}" stop-opacity="1"/>
    </linearGradient>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#3D2C24" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- fade hero into cream (does not cover thumbnail slots at y=778+) -->
  <rect x="0" y="520" width="${WIDTH}" height="200" fill="url(#heroFade)"/>

  <!-- cream band for headline + features (stops above thumbnail row) -->
  <rect x="0" y="440" width="${WIDTH}" height="320" fill="${CREAM}" opacity="0.9"/>

  <!-- RentSetGo logo block top right -->
  <g transform="translate(780, 36)" filter="url(#softShadow)">
    <rect width="260" height="88" rx="16" fill="rgba(255,255,255,0.92)" stroke="${BROWN_MID}" stroke-width="1.5"/>
    <text x="24" y="38" font-family="Segoe UI, system-ui, sans-serif" font-size="26" font-weight="800" fill="${BROWN}">RentSetGo</text>
    <text x="24" y="62" font-family="Segoe UI, system-ui, sans-serif" font-size="14" font-weight="600" fill="${BROWN_MID}" letter-spacing="2">FIND | RENT | RELAX</text>
    <path d="M200 28 L228 52 L200 76 Z" fill="${BROWN_MID}" opacity="0.85"/>
    <rect x="208" y="40" width="14" height="18" rx="2" fill="${CREAM}"/>
  </g>

  <!-- type badge -->
  <rect x="48" y="468" width="200" height="48" rx="24" fill="${BROWN}" filter="url(#softShadow)"/>
  <text x="148" y="500" text-anchor="middle" font-family="Segoe UI, system-ui, sans-serif" font-size="22" font-weight="800" fill="#FFFFFF" letter-spacing="1">${typeBadge}</text>

  <!-- locality headline -->
  <text x="48" y="580" font-family="Georgia, 'Times New Roman', serif" font-size="72" font-weight="700" fill="#1a1a1a">${locality}</text>
  <text x="48" y="628" font-family="Segoe UI, system-ui, sans-serif" font-size="28" font-weight="500" fill="${BROWN_MID}">${tagline}</text>

  <!-- feature list -->
  ${featureRows}

  <!-- brown price panel (curved) -->
  <path d="M0 900 Q200 860 280 920 L280 1080 Q120 1120 0 1060 Z" fill="${BROWN}" filter="url(#softShadow)"/>
  <text x="36" y="980" font-family="Segoe UI, system-ui, sans-serif" font-size="22" font-weight="600" fill="#E8DDD0">Rent</text>
  <text x="36" y="1040" font-family="Segoe UI, system-ui, sans-serif" font-size="48" font-weight="800" fill="#FFFFFF">${price}</text>
  <text x="36" y="1072" font-family="Segoe UI, system-ui, sans-serif" font-size="20" font-weight="500" fill="#D4C4B8">${escapeXml(priceSuffix)}</text>
  <text x="36" y="1110" font-family="Segoe UI, system-ui, sans-serif" font-size="18" font-weight="600" fill="#C9B8A8">Ready to Move In</text>

  <!-- CTA button -->
  <rect x="36" y="1125" width="240" height="52" rx="26" fill="${BEIGE}" stroke="${BROWN}" stroke-width="2"/>
  <text x="120" y="1158" text-anchor="middle" font-family="Segoe UI, system-ui, sans-serif" font-size="17" font-weight="800" fill="${BROWN}">CONTACT OWNER</text>
  <text x="120" y="1176" text-anchor="middle" font-family="Segoe UI, system-ui, sans-serif" font-size="13" font-weight="600" fill="${BROWN_MID}">${phone}</text>

  <!-- photo frames (borders) -->
  <rect x="52" y="778" width="488" height="318" rx="28" fill="none" stroke="${BROWN_MID}" stroke-width="3" opacity="0.35"/>
  <rect x="540" y="778" width="488" height="318" rx="28" fill="none" stroke="${BROWN_MID}" stroke-width="3" opacity="0.35"/>

  <!-- bottom info bar -->
  <rect x="0" y="1220" width="${WIDTH}" height="130" fill="${BEIGE}"/>
  <line x1="0" y1="1220" x2="${WIDTH}" y2="1220" stroke="${BROWN_MID}" stroke-width="2" opacity="0.3"/>

  <text x="80" y="1270" font-family="Segoe UI, system-ui, sans-serif" font-size="14" font-weight="700" fill="${BROWN_MID}">Location</text>
  <text x="80" y="1300" font-family="Segoe UI, system-ui, sans-serif" font-size="20" font-weight="700" fill="${BROWN}">${locBar}</text>

  <text x="340" y="1270" font-family="Segoe UI, system-ui, sans-serif" font-size="14" font-weight="700" fill="${BROWN_MID}">Floor</text>
  <text x="340" y="1300" font-family="Segoe UI, system-ui, sans-serif" font-size="20" font-weight="700" fill="${BROWN}">${floorLabel}</text>

  <text x="580" y="1270" font-family="Segoe UI, system-ui, sans-serif" font-size="14" font-weight="700" fill="${BROWN_MID}">Type</text>
  <text x="580" y="1300" font-family="Segoe UI, system-ui, sans-serif" font-size="20" font-weight="700" fill="${BROWN}">${typeBadge}</text>

  <text x="820" y="1270" font-family="Segoe UI, system-ui, sans-serif" font-size="14" font-weight="700" fill="${BROWN_MID}">Parking</text>
  <text x="820" y="1300" font-family="Segoe UI, system-ui, sans-serif" font-size="20" font-weight="700" fill="${BROWN}">${escapeXml(parkingLabel)}</text>

  <!-- trust badge -->
  <rect x="860" y="1140" width="200" height="64" rx="12" fill="${BROWN}" opacity="0.92"/>
  <text x="960" y="1172" text-anchor="middle" font-family="Segoe UI, system-ui, sans-serif" font-size="13" font-weight="700" fill="#E8DDD0">Safe · Secure</text>
  <text x="960" y="1192" text-anchor="middle" font-family="Segoe UI, system-ui, sans-serif" font-size="12" font-weight="600" fill="#C9B8A8">Suitable for Family</text>
</svg>`;
}

export async function renderPropertyPoster(
  imageUrls: string[],
  taglines: PosterTaglines,
  meta?: PosterRenderMeta,
): Promise<Buffer> {
  const urls = [...imageUrls].filter(Boolean).slice(0, 3);
  if (!urls.length) {
    throw new Error("At least one property image is required");
  }
  while (urls.length < 3) {
    urls.push(urls[0]!);
  }

  const [heroBuf, leftBuf, rightBuf] = await Promise.all([
    fetchImage(urls[0]!),
    fetchImage(urls[1]!),
    fetchImage(urls[2]!),
  ]);

  const hero = await sharp(heroBuf)
    .resize(WIDTH, 700, { fit: "cover", position: "centre" })
    .modulate({ brightness: 1.03, saturation: 1.05 })
    .toBuffer();

  const thumbLeft = await roundedPhoto(leftBuf, 488, 318, 28);
  const thumbRight = await roundedPhoto(rightBuf, 488, 318, 28);

  const features = buildFeatures(meta ?? {}, taglines.bullets);
  const overlay = Buffer.from(buildEditorialOverlay(taglines, meta ?? {}, features));

  const overlayPng = await sharp(overlay).png().toBuffer();

  return sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 3,
      background: CREAM,
    },
  })
    .composite([
      { input: hero, top: 0, left: 0 },
      { input: thumbLeft, top: 778, left: 52 },
      { input: thumbRight, top: 778, left: 540 },
      { input: overlayPng, top: 0, left: 0 },
    ])
    .png({ compressionLevel: 8 })
    .toBuffer();
}

export function fallbackPosterTaglines(
  title: string,
  location: string | null,
  priceLine: string,
  furnishing?: string | null,
): PosterTaglines {
  const furnishLabel = furnishing
    ? furnishing.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Semi Furnished";

  return {
    headline: location ?? title,
    tagline: "Comfort. Convenience. Perfect for Family.",
    bullets: [
      "Spacious Bedroom",
      "Parking Included",
      "Balcony with View",
      furnishLabel,
    ],
    locationLine: location ? `📍 ${location}` : "📍 Nashik",
    priceLine,
  };
}
