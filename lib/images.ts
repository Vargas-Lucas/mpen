const covers: Record<string, string> = {
  "sunset-village": "/images/sunset-village.png",
  "village-du-soleil": "/images/village-du-soleil-aerea.jpg",
  iconic: "/images/iconic.jpg",
  "chez-soleil": "/images/chez-soleil-aerea-2.jpg",
  vivace: "/images/vivace-fachada.jpg",
  moana: "/images/moana-aerea.jpg",
  "carpe-diem": "/images/carpe-diem.jpg",
  sanct: "/images/sanct-aerea.jpg",
  jai: "/images/jai.jpg",
  "riozinho-o2": "/images/riozinho-o2-aerea.jpg",
  sanctuary: "/images/sanctuary.jpg",
  "riozinho-style": "/images/riozinho-style-aerea.jpg",
  "porto-das-mares": "/images/porto-das-mares-aerea.jpg",
  island: "/images/island-fachada.jpg",
};

const heroes: Record<string, string> = {
  "sunset-village": "/images/sunset-hero.jpg",
  "chez-soleil": "/images/chez-soleil-aerea-2.jpg",
  iconic: "/images/iconic.jpg",
};

const logos: Record<string, string> = {
  "sunset-village": "/images/sunset-village-mark-3.png",
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
  "sunset-village": Array.from({ length: 14 }, (_, index) => `/images/gallery/sunset-village-${index + 2}.png`),
  "village-du-soleil": [1, 2, 3, 4].map((n) => `/images/gallery/village-du-soleil-${n}.jpg`),
  iconic: Array.from({ length: 20 }, (_, index) => `/images/gallery/iconic-${index + 1}.jpg`),
  "chez-soleil": [
    ...[1, 2, 3].map((n) => `/images/gallery/chez-soleil-${n}.jpg`),
    ...[4, 5, 6, 7, 8, 9, 10].map((n) => `/images/gallery/chez-soleil-${n}.png`),
    ...[11, 12, 13].map((n) => `/images/gallery/chez-soleil-${n}.jpg`),
  ],
  vivace: [
    ...[1, 2, 3, 4].map((n) => `/images/gallery/vivace-${n}.jpg`),
    "/images/gallery/vivace-5.jpg",
    ...[6, 7].map((n) => `/images/gallery/vivace-${n}.jpg`),
    ...[8, 9, 10, 11, 12, 13, 14].map((n) => `/images/gallery/vivace-${n}.jpg`),
    "/images/gallery/vivace-15.jpg",
  ],
  moana: Array.from({ length: 8 }, (_, index) => `/images/gallery/moana-${index + 1}.jpg`),
  "carpe-diem": [1, 2, 3].map((n) => `/images/gallery/carpe-diem-${n}.jpg`),
  sanct: [1, 2, 3, 4, 5].map((n) => `/images/gallery/sanct-${n}.jpg`),
  jai: Array.from({ length: 8 }, (_, index) => `/images/gallery/jai-${index + 1}.jpg`),
  "riozinho-o2": [1, 2, 3].map((n) => `/images/gallery/riozinho-o2-${n}.jpg`),
  sanctuary: Array.from({ length: 8 }, (_, index) => `/images/gallery/sanctuary-${index + 1}.jpg`),
  "riozinho-style": Array.from({ length: 8 }, (_, index) => `/images/gallery/riozinho-style-${index + 1}.jpg`),
  "porto-das-mares": [1, 2, 3].map((n) => `/images/gallery/porto-das-mares-${n}.jpg`),
  island: [1, 2, 3, 4, 5].map((n) => `/images/gallery/island-${n}.jpg`),
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
