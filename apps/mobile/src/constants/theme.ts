/**
 * Design tokens — Opennote (xem DESIGN.md, demo docs/wireframe/opennote.html).
 * Chrome: giấy ấm ivory + mực, nhấn sepia. Reader giữ hệ riêng (ReadingThemes).
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0a0a0a', // ink charcoal
    textSecondary: '#474747', // slate body
    textTertiary: '#8c8c8c', // smoke
    background: '#fffdf8', // ivory page
    backgroundElement: '#f9f9f9', // soft halo
    backgroundSelected: '#f0efe9',
    surface: '#fffdf8', // Opennote: card = canvas (giấy chồng giấy, không dùng trắng thuần)
    border: '#e5e5e5', // graphite rule
    accent: '#512906', // sepia — CTA duy nhất
    accentSoft: '#f2ece3', // nền tint mềm cho card đang đọc / nút đã lưu
    gold: '#0c3b1a', // repurpose → forest (không component nào dùng, giữ trên palette)
    goldSoft: '#eaf0ea',
  },
  dark: {
    text: '#E9E3D9',
    textSecondary: '#A8A099',
    textTertiary: '#78716C',
    background: '#141210',
    backgroundElement: '#262220',
    backgroundSelected: '#332E2A',
    surface: '#1C1917',
    border: '#302B27',
    accent: '#E08A5F',
    accentSoft: '#33231C',
    gold: '#D4A94A',
    goldSoft: '#2C2417',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Mực cố định — KHÔNG đổi theo light/dark. Ink-violet panel luôn tối chữ ivory,
 * forest tag luôn xanh. Tách khỏi Colors để giữ type symmetry light/dark.
 */
export const Ink = {
  violet: '#242d64', // feature panel (một cái/trang)
  forest: '#0c3b1a', // tag thể loại + trạng thái "đã đăng"
  onDark: '#fffdf8', // chữ ivory trên panel violet
  onDarkDim: 'rgba(255,253,248,0.75)',
  onDarkBorder: 'rgba(255,253,248,0.4)',
} as const;

/** Nền vùng đọc — tách khỏi theme app vì người đọc chọn riêng. */
export const ReadingThemes = {
  paper: { key: 'paper', label: 'Giấy', bg: '#FBF8F3', fg: '#1C1917', dim: '#8B837A' },
  sepia: { key: 'sepia', label: 'Ngả vàng', bg: '#F2E7D0', fg: '#3B2F1E', dim: '#8A7A5E' },
  night: { key: 'night', label: 'Đêm', bg: '#141210', fg: '#C9C2B8', dim: '#6E665F' },
  oled: { key: 'oled', label: 'Đen tuyền', bg: '#000000', fg: '#B5AFA6', dim: '#5E5852' },
} as const;

export type ReadingThemeKey = keyof typeof ReadingThemes;

export const Fonts = Platform.select({
  web: {
    sans: 'var(--font-ui)',
    serif: 'var(--font-serif)',
    mono: 'var(--font-mono)',
  },
  default: {
    sans: 'Inter_400Regular',
    serif: 'SourceSerif4_400Regular',
    mono: Platform.select({ ios: 'ui-monospace', default: 'monospace' }),
  },
})!;

/**
 * Tên family theo weight — RN native không suy ra được weight từ fontWeight.
 * Opennote: `serif*` (Source Serif 4) cho TIÊU ĐỀ chrome; `ui*` (Inter) cho UI/body;
 * `read*` (Literata) chỉ cho thân truyện — reader không đổi.
 */
export const FontFamily = Platform.select({
  web: {
    ui: 'var(--font-ui)',
    uiMedium: 'var(--font-ui)',
    uiSemi: 'var(--font-ui)',
    uiBold: 'var(--font-ui)',
    serif: 'var(--font-serif)',
    serifMedium: 'var(--font-serif)',
    read: 'var(--font-read)',
    readSemi: 'var(--font-read)',
  },
  default: {
    ui: 'Inter_400Regular',
    uiMedium: 'Inter_500Medium',
    uiSemi: 'Inter_600SemiBold',
    uiBold: 'Inter_700Bold',
    serif: 'SourceSerif4_400Regular',
    serifMedium: 'SourceSerif4_500Medium',
    read: 'Literata_400Regular',
    readSemi: 'Literata_600SemiBold',
  },
})!;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = { sm: 6, md: 10, lg: 14, xl: 22, pill: 999 } as const;

/**
 * Dấu tiếng Việt chồng cao (ế, ộ, ữ) — dưới 1.75 là các dòng dính vào nhau.
 * Đây là ràng buộc kỹ thuật của chữ Việt, không phải khẩu vị. Đừng hạ xuống.
 */
export const READING_LINE_HEIGHT = 1.8;

export const READING_SIZES = [15, 16.5, 18, 20, 22, 24] as const;
export const DEFAULT_READING_SIZE_INDEX = 2;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 1200;
/** ~64ch — giới hạn độ dài dòng để mắt không phải quét quá xa. */
export const ReadingWidth = 680;
/** Trên mức này thì bố cục chuyển sang dạng desktop. */
export const DesktopBreakpoint = 900;
