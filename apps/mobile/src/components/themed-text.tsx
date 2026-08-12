import { StyleSheet, Text, type TextProps } from 'react-native';

import { FontFamily, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  themeColor?: ThemeColor;
};

/** Text lấy màu từ theme + font UI mặc định (Inter). Caller override qua `style`. */
export function ThemedText({ style, themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles.default, style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    fontFamily: FontFamily.ui,
    fontSize: 16,
    lineHeight: 24,
  },
});
