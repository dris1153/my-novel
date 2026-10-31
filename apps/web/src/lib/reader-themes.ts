/**
 * Vùng đọc giữ bảng màu riêng, tách khỏi theme của app — đọc đêm là tính năng.
 * `dim` dùng cho chữ phụ trên thanh điều khiển nên cũng phải ≥4.5:1 (reader-themes.test.ts).
 */
export const READER_THEMES = {
  paper: { label: "Giấy", bg: "#F6F3EC", fg: "#222222", dim: "#5f5a52" },
  sepia: { label: "Ngả vàng", bg: "#EFE5D0", fg: "#3B3024", dim: "#66573d" },
  night: { label: "Đêm", bg: "#111113", fg: "#d8dade", dim: "#9a9ea6" },
  oled: { label: "Đen tuyền", bg: "#000000", fg: "#b5afa6", dim: "#8a857d" },
} as const;

export type ReaderThemeKey = keyof typeof READER_THEMES;

export const READER_SIZES = [15, 16.5, 18, 20, 22, 24] as const;

/** Dấu tiếng Việt chồng cao (ế, ộ, ữ) cần khoảng trống giữa dòng — không cho xuống dưới 1.6. */
export const READER_LINE_HEIGHTS = {
  tight: { label: "Hẹp", value: 1.6 },
  normal: { label: "Vừa", value: 1.75 },
  loose: { label: "Rộng", value: 1.95 },
} as const;

export type ReaderLineHeight = keyof typeof READER_LINE_HEIGHTS;

/** ~64ch — giới hạn độ dài dòng để mắt không phải quét quá xa trên màn rộng. */
export const READER_WIDTH = 680;
