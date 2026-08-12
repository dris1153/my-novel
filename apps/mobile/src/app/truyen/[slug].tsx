import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NOVEL_STATUS_LABEL, formatCount, timeAgo } from 'shared';

import { LinkPressable } from '@/components/link-pressable';
import { NovelCover } from '@/components/novel-cover';
import { ThemedText } from '@/components/themed-text';
import { FontFamily, Ink, MaxContentWidth, Radius, ReadingWidth, Spacing } from '@/constants/theme';
import { useAsync } from '@/hooks/use-async';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useTheme } from '@/hooks/use-theme';
import {
  fetchChapterList,
  fetchNovel,
  incrementView,
  isInLibrary,
  toggleLibrary,
} from '@/lib/queries';

export default function NovelDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDesktop } = useBreakpoint();

  // Trạng thái lưu bắt nguồn từ DB; chỉ ghi đè sau khi người dùng bấm. Đồng bộ
  // bằng setState trong effect sẽ tạo cascading render.
  const [savedOverride, setSavedOverride] = useState<boolean | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const novel = await fetchNovel(slug);
    const [chapters, inLib] = await Promise.all([fetchChapterList(novel.id), isInLibrary(novel.id)]);
    return { novel, chapters, inLib };
  }, [slug]);

  const { data, error, loading } = useAsync(load, [slug]);
  const saved = savedOverride ?? data?.inLib ?? false;

  useEffect(() => {
    if (data) incrementView(data.novel.id);
  }, [data]);

  const onToggleSave = async () => {
    if (!data) return;
    setSaveError(null);
    try {
      setSavedOverride(await toggleLibrary(data.novel.id, saved));
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Không lưu được');
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ThemedText themeColor="textSecondary" style={styles.body}>
          {error ?? 'Không tìm thấy truyện'}
        </ThemedText>
      </View>
    );
  }

  const { novel, chapters } = data;
  const genres = novel.novel_genres.map((g) => g.genres);
  const first = chapters[chapters.length - 1];

  return (
    <>
      <Stack.Screen options={{ title: novel.title }} />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.page}>
        {/* Đầu trang lấy màu tối cố định để chữ trắng luôn đủ tương phản. */}
        <View style={[styles.hero, { paddingTop: insets.top + Spacing.three }]}>
          <View style={styles.heroInner}>
            {!isDesktop && (
              <Pressable onPress={() => router.back()} style={styles.back}>
                <ThemedText style={styles.backText}>‹ Quay lại</ThemedText>
              </Pressable>
            )}
            <View style={styles.heroRow}>
              <NovelCover
                uri={novel.cover_url}
                title={novel.title}
                seed={novel.slug}
                width={isDesktop ? 132 : 100}
              />
              <View style={styles.heroBody}>
                <ThemedText style={styles.title}>{novel.title}</ThemedText>
                <ThemedText style={styles.author}>{novel.author}</ThemedText>
                <View style={styles.tagRow}>
                  <View style={styles.tag}>
                    <ThemedText style={styles.tagText}>{NOVEL_STATUS_LABEL[novel.status]}</ThemedText>
                  </View>
                  {genres.map((g) => (
                    <View key={g.slug} style={styles.tag}>
                      <ThemedText style={styles.tagText}>{g.name}</ThemedText>
                    </View>
                  ))}
                </View>
                <View style={styles.stats}>
                  <Stat value={String(chapters.length)} label="Chương" />
                  <Stat value={formatCount(novel.view_count)} label="Lượt đọc" />
                  <Stat value={timeAgo(novel.updated_at)} label="Cập nhật" />
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.inner}>
          <View style={styles.actions}>
            {first && (
              <LinkPressable
                href={`/truyen/${novel.slug}/${first.number}`}
                style={[styles.cta, { backgroundColor: colors.accent }]}>
                <ThemedText style={styles.ctaText}>Đọc từ đầu</ThemedText>
              </LinkPressable>
            )}
            <Pressable
              onPress={onToggleSave}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.saveBtn,
                { borderColor: colors.border, backgroundColor: saved ? colors.accentSoft : 'transparent' },
                pressed && styles.pressed,
              ]}>
              <ThemedText themeColor={saved ? 'accent' : 'textSecondary'} style={styles.saveText}>
                {saved ? '♥ Đã lưu' : '♡ Lưu'}
              </ThemedText>
            </Pressable>
          </View>

          {saveError && (
            <ThemedText themeColor="accent" style={styles.saveError}>
              {saveError}
            </ThemedText>
          )}

          {novel.description && (
            <ThemedText themeColor="textSecondary" style={styles.desc}>
              {novel.description}
            </ThemedText>
          )}

          <ThemedText style={styles.sectionTitle}>Danh sách chương ({chapters.length})</ThemedText>

          {chapters.length === 0 ? (
            <ThemedText themeColor="textSecondary" style={styles.body}>
              Truyện chưa có chương nào.
            </ThemedText>
          ) : (
            chapters.map((c) => (
              <LinkPressable
                key={c.id}
                href={`/truyen/${novel.slug}/${c.number}`}
                style={[styles.chapterRow, { borderColor: colors.border }]}>
                <ThemedText numberOfLines={1} style={styles.chapterTitle}>
                  Chương {c.number} — {c.title}
                </ThemedText>
                <ThemedText themeColor="textTertiary" style={styles.chapterMeta}>
                  {timeAgo(c.created_at)}
                </ThemedText>
              </LinkPressable>
            ))
          )}
        </View>
      </ScrollView>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.four },
  page: { paddingBottom: Spacing.six },
  // Ink-violet feature panel — MỘT panel/trang (Opennote reset moment).
  hero: { backgroundColor: Ink.violet, paddingHorizontal: Spacing.four, paddingBottom: Spacing.four },
  heroInner: { width: '100%', maxWidth: MaxContentWidth, marginHorizontal: 'auto' },
  back: { marginBottom: Spacing.three, alignSelf: 'flex-start' },
  backText: { color: Ink.onDarkDim, fontFamily: FontFamily.uiMedium, fontSize: 14 },
  heroRow: { flexDirection: 'row', gap: Spacing.three, alignItems: 'flex-start' },
  heroBody: { flex: 1, gap: Spacing.one },
  title: { color: Ink.onDark, fontFamily: FontFamily.serif, fontSize: 24, lineHeight: 28 },
  author: { color: Ink.onDarkDim, fontFamily: FontFamily.ui, fontSize: 13.5 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one, marginTop: Spacing.one },
  tag: { borderWidth: 1, borderColor: Ink.onDarkBorder, borderRadius: Radius.md, paddingHorizontal: Spacing.two, paddingVertical: 3 },
  tagText: { color: Ink.onDark, fontFamily: FontFamily.ui, fontSize: 11 },
  stats: { flexDirection: 'row', gap: Spacing.four, marginTop: Spacing.three },
  stat: { gap: 1 },
  statValue: { color: Ink.onDark, fontFamily: FontFamily.serif, fontSize: 18 },
  statLabel: { color: Ink.onDarkDim, fontFamily: FontFamily.ui, fontSize: 11 },
  inner: {
    width: '100%',
    maxWidth: ReadingWidth,
    marginHorizontal: 'auto',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
  },
  actions: { flexDirection: 'row', gap: Spacing.two, marginBottom: Spacing.three },
  cta: { flex: 1, borderRadius: Radius.md, paddingVertical: Spacing.three, alignItems: 'center' },
  ctaText: { color: Ink.onDark, fontFamily: FontFamily.uiSemi, fontSize: 15 },
  saveBtn: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  saveText: { fontFamily: FontFamily.uiSemi, fontSize: 14 },
  saveError: { fontFamily: FontFamily.ui, fontSize: 13, marginBottom: Spacing.two },
  desc: { fontFamily: FontFamily.ui, fontSize: 14.5, lineHeight: 24, marginBottom: Spacing.four },
  sectionTitle: { fontFamily: FontFamily.serif, fontSize: 20, marginBottom: Spacing.two },
  body: { fontFamily: FontFamily.ui, fontSize: 14 },
  chapterRow: { borderTopWidth: 1, paddingVertical: Spacing.three, gap: 2 },
  chapterTitle: { fontFamily: FontFamily.uiMedium, fontSize: 14.5 },
  chapterMeta: { fontFamily: FontFamily.ui, fontSize: 12 },
  pressed: { opacity: 0.65 },
});
