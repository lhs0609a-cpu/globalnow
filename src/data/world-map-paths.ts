// Simplified world map outline SVG path (Mercator-like projection)
// ViewBox: 0 0 1000 500

export const WORLD_OUTLINE =
  // North America
  "M 130 120 L 150 100 L 180 90 L 210 85 L 240 80 L 260 85 L 270 100 L 260 120 L 240 130 L 220 140 L 200 150 L 180 160 L 170 180 L 160 200 L 150 210 L 140 200 L 130 180 L 120 160 L 115 140 Z " +
  // South America
  "M 220 260 L 240 250 L 260 260 L 270 280 L 280 310 L 280 340 L 270 370 L 260 390 L 240 400 L 230 380 L 220 350 L 210 320 L 210 290 Z " +
  // Europe
  "M 440 90 L 460 80 L 480 85 L 500 90 L 520 95 L 530 110 L 520 120 L 500 130 L 480 135 L 460 130 L 450 120 L 440 110 Z " +
  // Africa
  "M 450 180 L 470 170 L 500 175 L 520 185 L 530 210 L 540 240 L 530 270 L 520 300 L 500 320 L 480 330 L 460 320 L 450 300 L 440 270 L 440 240 L 440 210 Z " +
  // Asia
  "M 540 80 L 580 70 L 630 65 L 680 70 L 720 80 L 760 90 L 780 100 L 790 120 L 780 140 L 760 155 L 730 165 L 700 170 L 670 165 L 640 160 L 610 150 L 580 140 L 560 130 L 540 120 L 535 100 Z " +
  // Middle East
  "M 540 140 L 570 135 L 590 150 L 580 170 L 560 180 L 540 175 L 530 160 Z " +
  // India
  "M 620 170 L 650 165 L 660 185 L 650 210 L 630 225 L 610 215 L 610 195 Z " +
  // Southeast Asia
  "M 700 175 L 730 170 L 750 180 L 760 200 L 740 210 L 720 205 L 700 195 Z " +
  // Australia
  "M 750 310 L 790 300 L 830 305 L 850 320 L 840 350 L 820 360 L 790 365 L 760 355 L 750 340 Z";

// Country coordinates on the map (x, y in viewBox 0 0 1000 500)
export interface CountryCoord {
  code: string;
  x: number;
  y: number;
  label: string;
}

export const COUNTRY_COORDS: CountryCoord[] = [
  { code: "kr", x: 760, y: 130, label: "KR" },
  { code: "jp", x: 790, y: 120, label: "JP" },
  { code: "cn", x: 710, y: 120, label: "CN" },
  { code: "in", x: 635, y: 195, label: "IN" },
  { code: "ae", x: 570, y: 175, label: "AE" },
  { code: "sa", x: 550, y: 170, label: "SA" },
  { code: "il", x: 535, y: 150, label: "IL" },
  { code: "gb", x: 450, y: 95, label: "GB" },
  { code: "fr", x: 465, y: 115, label: "FR" },
  { code: "de", x: 485, y: 100, label: "DE" },
  { code: "ru", x: 620, y: 80, label: "RU" },
  { code: "us", x: 180, y: 140, label: "US" },
  { code: "ca", x: 190, y: 100, label: "CA" },
  { code: "br", x: 255, y: 310, label: "BR" },
  { code: "au", x: 800, y: 335, label: "AU" },
];
