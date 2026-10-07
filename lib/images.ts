const covers: Record<string, string> = {
  "sunset-village": "/images/sunset-village.png",
  "village-du-soleil": "/images/village-du-soleil.png",
  iconic: "/images/iconic.png",
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
  "village-du-soleil": "/images/village-du-soleil.png",
  iconic: "/images/iconic.png",
};

const logos: Record<string, string> = {
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

export function coverImage(slug: string) {
  return covers[slug] ?? "";
}

export function heroImage(slug: string) {
  return heroes[slug] ?? covers[slug] ?? "";
}

export function logoImage(slug: string) {
  return logos[slug] ?? "";
}
