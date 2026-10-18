export interface FlavorConfig {
  id: string;
  name: string;
  label: string;
  description: string;
  frameFolder: string;
  bgGradient: string;
  glowColor: string;
  glowColor2: string;
  accent: string;
  accentDark: string;
  stroke: string;
  particle1: string;
  particle2: string;
  shadowAccent: string;
}

export const FLAVORS: FlavorConfig[] = [
  {
    id: "green",
    name: "Guaraná Zero",
    label: "Guaraná",
    description:
      "A bold Amazonian guaraná kick with juicy fruit taste — full flavor, zero sugar, zero compromise.",
    frameFolder: "green",
    bgGradient:
      "linear-gradient(135deg, #004D2A 0%, #006B3C 35%, #007A43 60%, #00351D 100%)",
    glowColor: "rgba(0,166,90,0.65)",
    glowColor2: "rgba(0,122,67,0.45)",
    accent: "#B7E11D",
    accentDark: "#004D2A",
    stroke: "#1E4DFF",
    particle1: "#B7E11D",
    particle2: "#1E4DFF",
    shadowAccent: "rgba(183,225,29,0.45)",
  },
  {
    id: "blue",
    name: "Blue Citrus",
    label: "Blue Citrus",
    description:
      "Ice-cold citrus meets electric blue energy — crisp, fizzy, and absolutely zero sugar.",
    frameFolder: "blue",
    bgGradient:
      "linear-gradient(135deg, #001A4D 0%, #002B7A 35%, #003399 60%, #001035 100%)",
    glowColor: "rgba(30,100,255,0.60)",
    glowColor2: "rgba(20,70,200,0.40)",
    accent: "#4DD8FF",
    accentDark: "#001A4D",
    stroke: "#4DD8FF",
    particle1: "#4DD8FF",
    particle2: "#A0C4FF",
    shadowAccent: "rgba(77,216,255,0.45)",
  },
  {
    id: "red",
    name: "Strawberry",
    label: "Strawberry",
    description:
      "Sun-ripened strawberry sweetness with an irresistible tang — big fruit taste, zero sugar.",
    frameFolder: "red",
    bgGradient:
      "linear-gradient(135deg, #4D0010 0%, #7A001A 35%, #99001F 60%, #35000B 100%)",
    glowColor: "rgba(229,57,53,0.60)",
    glowColor2: "rgba(180,30,30,0.40)",
    accent: "#FF4D6D",
    accentDark: "#4D0010",
    stroke: "#FF4D6D",
    particle1: "#FF4D6D",
    particle2: "#FFB347",
    shadowAccent: "rgba(255,77,109,0.45)",
  },
  {
    id: "purple",
    name: "Grape",
    label: "Grape",
    description:
      "Deep, dark grape burst — lush and bold with the full Arfat AI Grape experience, zero sugar.",
    frameFolder: "purple",
    bgGradient:
      "linear-gradient(135deg, #1A0040 0%, #2D006B 35%, #380080 60%, #100030 100%)",
    glowColor: "rgba(138,43,226,0.60)",
    glowColor2: "rgba(100,20,180,0.40)",
    accent: "#C77DFF",
    accentDark: "#1A0040",
    stroke: "#C77DFF",
    particle1: "#C77DFF",
    particle2: "#7B2FBE",
    shadowAccent: "rgba(199,125,255,0.45)",
  },
  {
    id: "mixed",
    name: "Tutti Frutti",
    label: "Tutti Frutti",
    description:
      "Every exotic fruit in one can — Tutti Frutti explosion with bold colour, zero sugar, limited edition.",
    frameFolder: "mixed",
    // Green background so the green water-droplet bokeh from the shoot
    // blends invisibly into the scene instead of appearing as artifacts.
    bgGradient:
      "linear-gradient(135deg, #003A1C 0%, #005228 35%, #006632 60%, #002513 100%)",
    glowColor: "rgba(0,160,70,0.65)",
    glowColor2: "rgba(0,110,45,0.40)",
    accent: "#FFB347",
    accentDark: "#003A1C",
    stroke: "#FF6B00",
    particle1: "#FFB347",
    particle2: "#56C436",
    shadowAccent: "rgba(255,179,71,0.45)",
  },
];
