import { useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NovelGridCard, NovelListRow } from '@/components/novel-card';
import { ThemedText } from '@/components/themed-text';
import { FontFamily, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAsync } from '@/hooks/use-async';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useTheme } from '@/hooks/use-theme';
import { fetchLibrary } from '@/lib/queries';

export default function LibraryScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { isDesktop, columns, width } = useBreakpoint();

  const { data, error, loading } = useAsync(useCallback(() => fetchLibrary(), []), []);

  const inner = Math.min(width, MaxContentWidth) - Spacing.four * 2;
  const gap = Spacing.three;
  const cardWidth = (inner - gap * (columns - 1)) / columns;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.page,
        { paddingTop: isDesktop ? Spacing.five : insets.top + Spacing.three },
      ]}>
      <View style={styles.inner}>
        <ThemedText style={styles.pageTitle}>Tủ truyện</ThemedText>

        {loading && <ActivityIndicator color={colors.accent} />}

        {error && (
          <ThemedText themeColor="textSecondary" style={styles.body}>
            {error}
          </ThemedText>
        )}

        {!loading && !error && (data ?? []).length === 0 && (
          <ThemedText themeColor="textSecondary" style={styles.body}>
            Chưa có truyện nào trong tủ. Đăng nhập rồi bấm ♡ ở trang truyện để lưu lại.
          </ThemedText>
        )}

        {isDesktop ? (
          <View style={[styles.grid, { gap }]}>
            {(data ?? []).map((n) => (
              <NovelGridCard key={n.id} novel={n} width={cardWidth} />
            ))}
          </View>
        ) : (
          <View style={styles.list}>
            {(data ?? []).map((n) => (
              <NovelListRow key={n.id} novel={n} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: Spacing.four, paddingBottom: Spacing.six },
  inner: { width: '100%', maxWidth: MaxContentWidth, marginHorizontal: 'auto' },
  pageTitle: {
    fontFamily: FontFamily.serif,
    fontSize: 28,
    lineHeight: 32,
    marginBottom: Spacing.four,
  },
  body: { fontFamily: FontFamily.ui, fontSize: 14, lineHeight: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  list: { gap: Spacing.three },
});
