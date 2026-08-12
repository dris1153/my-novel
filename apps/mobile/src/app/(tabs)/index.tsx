import { useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LinkPressable } from '@/components/link-pressable';
import { NovelGridCard, NovelListRow } from '@/components/novel-card';
import { NovelCover } from '@/components/novel-cover';
import { ThemedText } from '@/components/themed-text';
import { FontFamily, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useAsync } from '@/hooks/use-async';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useTheme } from '@/hooks/use-theme';
import { fetchContinueReading, fetchPopular, fetchRecent } from '@/lib/queries';

export default function HomeScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { isDesktop, columns, width } = useBreakpoint();

  const load = useCallback(
    () => Promise.all([fetchPopular(12), fetchRecent(24), fetchContinueReading()]),
    []
  );
  const { data, error, loading } = useAsync(load, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <ThemedText themeColor="textSecondary" style={styles.errorText}>
          {error}
        </ThemedText>
      </View>
    );
  }

  const [popular, recent, continuing] = data ?? [[], [], []];
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
        {!isDesktop && (
          <>
            <ThemedText themeColor="textTertiary" style={styles.eyebrow}>
              CHÀO BẠN
            </ThemedText>
            <ThemedText style={styles.pageTitle}>Đọc tiếp thôi</ThemedText>
            <LinkPressable
              href="/tim-kiem"
              style={[
                styles.search,
                { backgroundColor: colors.backgroundElement, borderColor: colors.border },
              ]}>
              <ThemedText themeColor="textTertiary" style={styles.searchText}>
                Tìm truyện, tác giả…
              </ThemedText>
            </LinkPressable>
          </>
        )}

        {continuing.length > 0 && (
          <LinkPressable
            href={`/truyen/${continuing[0].novels.slug}/${continuing[0].chapters.number}`}
            style={[styles.continueCard, { backgroundColor: colors.accentSoft }]}>
            <NovelCover
              uri={continuing[0].novels.cover_url}
              title={continuing[0].novels.title}
              seed={continuing[0].novels.slug}
              width={48}
            />
            <View style={styles.continueBody}>
              <ThemedText themeColor="accent" style={styles.eyebrow}>
                ĐANG ĐỌC
              </ThemedText>
              <ThemedText numberOfLines={1} style={styles.continueTitle}>
                {continuing[0].novels.title}
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.meta}>
                Chương {continuing[0].chapters.number}
              </ThemedText>
              <View style={[styles.track, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.trackFill,
                    {
                      backgroundColor: colors.accent,
                      width: `${Math.round(continuing[0].percent * 100)}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </LinkPressable>
        )}

        {popular.length > 0 && (
          <>
            <ThemedText style={styles.sectionTitle}>Nổi bật</ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}>
              {popular.map((n) => (
                <LinkPressable key={n.id} href={`/truyen/${n.slug}`}>
                  <NovelCover uri={n.cover_url} title={n.title} seed={n.slug} width={104} />
                  <ThemedText numberOfLines={2} style={styles.railTitle}>
                    {n.title}
                  </ThemedText>
                </LinkPressable>
              ))}
            </ScrollView>
          </>
        )}

        <ThemedText style={styles.sectionTitle}>Mới cập nhật</ThemedText>
        {recent.length === 0 ? (
          <ThemedText themeColor="textSecondary" style={styles.meta}>
            Chưa có truyện nào. Đăng truyện từ trang admin để bắt đầu.
          </ThemedText>
        ) : isDesktop ? (
          <View style={[styles.grid, { gap }]}>
            {recent.map((n) => (
              <NovelGridCard key={n.id} novel={n} width={cardWidth} />
            ))}
          </View>
        ) : (
          <View style={styles.list}>
            {recent.map((n) => (
              <NovelListRow key={n.id} novel={n} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.four },
  errorText: { fontFamily: FontFamily.ui, textAlign: 'center' },
  page: { paddingHorizontal: Spacing.four, paddingBottom: Spacing.six },
  inner: { width: '100%', maxWidth: MaxContentWidth, marginHorizontal: 'auto' },
  eyebrow: { fontFamily: FontFamily.uiSemi, fontSize: 11, letterSpacing: 1 },
  pageTitle: { fontFamily: FontFamily.serif, fontSize: 28, lineHeight: 32, marginBottom: Spacing.three },
  search: { borderWidth: 1, borderRadius: Radius.md, padding: Spacing.three, marginBottom: Spacing.four },
  searchText: { fontFamily: FontFamily.ui, fontSize: 13.5 },
  continueCard: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    marginBottom: Spacing.four,
  },
  continueBody: { flex: 1, gap: 2 },
  continueTitle: { fontFamily: FontFamily.serif, fontSize: 17 },
  meta: { fontFamily: FontFamily.ui, fontSize: 12.5 },
  track: { height: 3, borderRadius: Radius.pill, marginTop: Spacing.two, overflow: 'hidden' },
  trackFill: { height: '100%', borderRadius: Radius.pill },
  sectionTitle: {
    fontFamily: FontFamily.serif,
    fontSize: 22,
    marginTop: Spacing.four,
    marginBottom: Spacing.three,
  },
  rail: { gap: Spacing.three, paddingRight: Spacing.four },
  railTitle: { fontFamily: FontFamily.serif, fontSize: 14, width: 104, marginTop: Spacing.two },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  list: { gap: Spacing.three },
  pressed: { opacity: 0.65 },
});
