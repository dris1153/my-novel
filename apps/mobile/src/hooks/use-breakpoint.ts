import { useWindowDimensions } from 'react-native';

import { DesktopBreakpoint } from '@/constants/theme';

/**
 * Thay cho `md:`/`lg:` của Tailwind. RNW không có media query nên breakpoint
 * phải tính từ chiều rộng cửa sổ.
 */
export function useBreakpoint() {
  const { width } = useWindowDimensions();
  return {
    width,
    isDesktop: width >= DesktopBreakpoint,
    /** Số cột lưới bìa truyện. */
    columns: width >= 1100 ? 6 : width >= DesktopBreakpoint ? 4 : width >= 600 ? 3 : 2,
  };
}
