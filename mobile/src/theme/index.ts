// Umbra Design System (dark). 가이드: mobile/design-system.md

const violet = {
  50: "#F4F0FF",
  100: "#E6DCFF",
  200: "#CDB8FF",
  300: "#B294FF",
  400: "#9772FF",
  500: "#7C4DFF", // brand
  600: "#6838EE",
  700: "#5427C7",
  800: "#3E1C94",
  900: "#291363",
};

export const colors = {
  violet,
  // surface
  background: "#09080D", // bg/base
  surface: "#110F18",
  raised: "#18151F",
  overlay: "#211D2B",
  line: "#2B2638",
  lineStrong: "#3A3449",
  // text
  text: "#F5F3FA",
  textSecondary: "#ABA5BB",
  textTertiary: "#716B82",
  textBrand: "#B294FF",
  // brand / semantic
  primary: violet[500],
  success: "#3DD68C",
  warning: "#F5B94A",
  danger: "#FF5E78",
  info: "#62B8FF",
  // tint / overlay
  white: "#FFFFFF",
  brandTint: "rgba(124,77,255,0.2)", // 칩 선택, 태그(업무)
  unreadTint: "rgba(124,77,255,0.08)",
  unreadLine: "rgba(151,114,255,0.25)",
  successTint: "rgba(61,214,140,0.12)",
  warningTint: "rgba(245,185,74,0.12)",
  glowLine: "rgba(151,114,255,0.5)", // violet400 50%
  modal: "#2A2536", // e3
  dim: "rgba(0,0,0,0.6)",
};

// expo-linear-gradient 등에 넘길 색 배열
export const gradients = {
  brand: ["#7C4DFF", "#A45CFF", "#D07BFF"] as const,
};

// 4pt grid
export const spacing = {
  "2xs": 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
};

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

// assets/fonts의 Pretendard. 커스텀 폰트는 fontWeight 대신 굵기별 family로 지정
export const fonts = {
  "Pretendard-Regular": require("../../assets/fonts/Pretendard-Regular.otf"),
  "Pretendard-Medium": require("../../assets/fonts/Pretendard-Medium.otf"),
  "Pretendard-SemiBold": require("../../assets/fonts/Pretendard-SemiBold.otf"),
  "Pretendard-Bold": require("../../assets/fonts/Pretendard-Bold.otf"),
};

// letterSpacing은 fontSize × 비율(px)
export const typography = {
  display: { fontSize: 34, lineHeight: 42, fontFamily: "Pretendard-Bold", letterSpacing: -0.85 },
  title1: { fontSize: 28, lineHeight: 36, fontFamily: "Pretendard-Bold", letterSpacing: -0.56 },
  title2: { fontSize: 22, lineHeight: 30, fontFamily: "Pretendard-SemiBold" },
  title3: { fontSize: 18, lineHeight: 26, fontFamily: "Pretendard-SemiBold" },
  body1: { fontSize: 16, lineHeight: 24, fontFamily: "Pretendard-Regular" },
  body2: { fontSize: 14, lineHeight: 22, fontFamily: "Pretendard-Regular" },
  caption: { fontSize: 12, lineHeight: 18, fontFamily: "Pretendard-Medium" },
  overline: { fontSize: 11, lineHeight: 16, fontFamily: "Pretendard-SemiBold", letterSpacing: 0.88 },
} as const;

export const touchTarget = 44;
