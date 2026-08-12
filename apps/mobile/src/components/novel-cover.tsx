import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';

import { FontFamily, Radius } from '@/constants/theme';

/** Bìa thiếu ảnh vẫn phải phân biệt được -> màu suy ra từ slug. Tông trầm Opennote. */
const FALLBACKS = ['#5b4636', '#2f3a52', '#4a3c5c', '#38503a', '#6b5330', '#4b3040'];

function colorFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return FALLBACKS[Math.abs(h) % FALLBACKS.length];
}

type Props = {
  uri?: string | null;
  title: string;
  seed: string;
  width: number;
  /** Bìa truyện theo tỉ lệ 2:3. */
  height?: number;
  radius?: number;
};

export function NovelCover({ uri, title, seed, width, height, radius = Radius.md }: Props) {
  const h = height ?? Math.round((width * 3) / 2);

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width, height: h, borderRadius: radius }}
        contentFit="cover"
        transition={160}
        accessibilityLabel={`Bìa truyện ${title}`}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { width, height: h, borderRadius: radius, backgroundColor: colorFor(seed) },
      ]}>
      <ThemedText numberOfLines={3} style={styles.fallbackText}>
        {title}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { justifyContent: 'flex-end', padding: 8, overflow: 'hidden' },
  fallbackText: {
    color: '#fffdf8',
    fontFamily: FontFamily.serif,
    fontSize: 13,
    lineHeight: 16,
  },
});
