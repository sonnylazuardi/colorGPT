export function calculateColorDif(
  [r1, g1, b1]: number[],
  [r2, g2, b2]: number[]
) {
  return Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2);
}
export function getColorComponents(color: string) {
  const r = parseInt(color && color.substring(1, 3), 16);
  const g = parseInt(color && color.substring(3, 5), 16);
  const b = parseInt(color && color.substring(5, 7), 16);
  return [r, g, b];
}

export const COLOR_REFS_CODE = [
  "#FFA07A",
  "#231F20",
  "#FF4500",
  "#CCCCFE",
  "#D0884D",
  "#871F78",
  "#007177",
  "#860104",
  "#754835",
  "#A52B2A",
  "#9966CB",
  "#555D60",
  "#42B3AD",
  "#EFEEEA",
  "#0530F9",
  "#F0C0E6",
  "#F34E14",
  "#4169E2",
  "#DFF1D7",
  "#FBD9A9",
  "#CCCCCC",
  "#BF3D27",
  "#EAB251",
  "#D9C8AE",
  "#CE0027",
  "#FA6934",
  "#FFFF01",
  "#86C127",
  "#3380F2",
  "#4C0083",
  "#9500D4",
];
export const COLOR_REFS_NAME = [
  "Bangbang",
  "Cemanu",
  "Dewangga",
  "Gandaria",
  "Hartal",
  "Ijas",
  "Indranila",
  "Jerau",
  "Kadru",
  "Kapisa",
  "Kecubung",
  "Kelam Baja",
  "Kerak Terusi",
  "Kinantan",
  "Lazuardi",
  "Lila",
  "Mambang Kuning",
  "Nilakandi",
  "Nusaindah",
  "Pinggala",
  "Saliwah",
  "Sedelinggam",
  "Soga",
  "Turangga",
  "Merah",
  "Jingga",
  "Kuning",
  "Hijau",
  "Biru",
  "Nila",
  "Ungu",
];

export function findNearestColor(color: string) {
  const [r1, g1, b1] = getColorComponents(color);
  let dif: number = 200000;
  let result = COLOR_REFS_CODE[0];
  let index = 0;
  COLOR_REFS_CODE.forEach((candidate: any, i: number) => {
    const [r2, g2, b2] = getColorComponents(candidate);
    const curDif = calculateColorDif([r1, g1, b1], [r2, g2, b2]);

    if (curDif < dif) {
      dif = curDif;
      result = candidate;
      index = i;
    }
  });
  return { color: result, name: COLOR_REFS_NAME[index] };
}
