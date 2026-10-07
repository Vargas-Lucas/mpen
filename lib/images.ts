const covers: Record<string, string> = {
  "sunset-village": "/images/sunset-village.png",
  "village-du-soleil": "/images/village-du-soleil.png",
  iconic: "/images/iconic.jpg",
  "chez-soleil": "/images/chez-soleil.png",
  vivace: "/images/vivace.png",
  moana: "/images/moana.png",
  "carpe-diem": "/images/carpe-diem.png",
  sanct: "/images/sanct.png",
  jai: "/images/jai.png",
  "riozinho-o2": "/images/riozinho-o2.jpg",
  sanctuary: "/images/sanctuary.png",
  "riozinho-style": "/images/riozinho-style.jpg",
  "porto-das-mares": "/images/porto-das-mares.png",
  island: "/images/island.png",
};

const heroes: Record<string, string> = {
  "sunset-village": "/images/sunset-hero.jpg",
  "village-du-soleil": "/images/chez-soleil.png",
  iconic: "/images/iconic.jpg",
};

const logos: Record<string, string> = {
  "sunset-village": "/images/sunset-village-mark-3.png",
  "village-du-soleil": "/images/chez-soleil-mark.png",
  "chez-soleil": "/images/chez-soleil-mark.png",
  vivace: "/images/vivace-logo.png",
  jai: "/images/jai-logo.png",
  iconic: "/images/iconic-logo.png",
  moana: "/images/moana-logo.png",
  "carpe-diem": "/images/carpe-diem-logo.png",
  island: "/images/island-logo.png",
  sanct: "/images/sanct-logo.png",
  sanctuary: "/images/sanctuary-logo.png",
  "riozinho-o2": "/images/riozinho-o2-logo.png",
  "riozinho-style": "/images/riozinho-style-logo.png",
};

const galleries: Record<string, string[]> = {
  iconic: [1, 2, 3, 4, 5].map((n) => `/images/gallery/iconic-${n}.jpg`),
  moana: [1, 2, 3, 4, 5].map((n) => `/images/gallery/moana-${n}.jpg`),
  "carpe-diem": [1, 3, 4, 5].map((n) => `/images/gallery/carpe-diem-${n}.jpg`),
  island: [1, 2, 3, 4].map((n) => `/images/gallery/island-${n}.jpg`),
  jai: [1, 2, 3, 4].map((n) => `/images/gallery/jai-${n}.jpg`),
  sanct: [1, 2, 3, 4, 5].map((n) => `/images/gallery/sanct-${n}.jpg`),
  sanctuary: [1, 2, 3, 4, 5].map((n) => `/images/gallery/sanctuary-${n}.jpg`),
  "riozinho-o2": [1, 2, 3, 4].map((n) => `/images/gallery/riozinho-o2-${n}.jpg`),
  "riozinho-style": [1, 2, 3, 4].map((n) => `/images/gallery/riozinho-style-${n}.jpg`),
};

export function coverImage(slug: string) {
  return covers[slug] ?? "";
}

export function heroImage(slug: string) {
  return heroes[slug] ?? covers[slug] ?? "";
}

export function logoImage(slug: string) {
  return logos[slug] ?? "";
}

export function galleryImages(slug: string) {
  return galleries[slug] ?? [];
}
