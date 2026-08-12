import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ReaderSettings } from '@/components/reader-settings';
import { ThemedText } from '@/components/themed-text';
import {
  FontFamily,
  READING_LINE_HEIGHT,
  READING_SIZES,
  ReadingThemes,
  ReadingWidth,
  Spacing,
} from '@/constants/theme';
import { useAsync } from '@/hooks/use-async';
import { useReaderPrefs } from '@/hooks/use-reader-prefs';
import { fetchChapter, saveProgress } from '@/lib/queries';

export default function ChapterScreen() {
  const { slug, chuong } = useLocalSearchParams<{ slug: string; chuong: string }>();
  const number = Number(chuong);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { prefs, update, loaded } = useReaderPrefs();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastSaved = useRef(0);

  const load = useCallback(() => fetchChapter(slug, number), [slug, number]);
  const { data, error, loading } = useAsync(load, [slug, number]);

  const theme = ReadingThemes[prefs.theme];
  const fontSize = READING_SIZES[prefs.sizeIndex] ?? READING_SIZES[2];

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const scrollable = contentSize.height - layoutMeasurement.height;
    const pct = scrollable > 0 ? Math.min(1, Math.max(0, contentOffset.y / scrollable)) : 0;
    setProgress(pct);

    // Ghi tiến độ tối đa mỗi 5s để không spam DB khi cuộn.
    if (data && Date.now() - lastSaved.current > 5000) {
      lastSaved.current = Date.now();
      saveProgress(data.novel.id, data.chapter.id, pct).catch(() => {});
    }
  };

  if (loading || !loaded) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator color={theme.dim} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ThemedText style={{ color: theme.fg, fontFamily: FontFamily.ui }}>
          {error ?? 'Không tìm thấy chương'}
        </ThemedText>
      </View>
    );
  }

  const { chapter, novel, hasPrev, hasNext } = data;
  const paragraphs = chapter.content.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <>
      <Stack.Screen options={{ title: `Chương ${chapter.number} — ${novel.title}` }} />
      <View style={[styles.root, { backgroundColor: theme.bg }]}>
        <View style={[styles.topBar, { paddingTop: insets.top + Spacing.two, borderColor: theme.dim }]}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" hitSlop={8}>
            <ThemedText style={[styles.topText, { color: theme.dim }]}>‹ {novel.title}</ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setSettingsOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Tuỳ chỉnh đọc"
            hitSlop={8}>
            <ThemedText style={[styles.topText, { color: theme.dim, fontSize: 16 }]}>Aa</ThemedText>
          </Pressable>
        </View>

        <ScrollView
          onScroll={onScroll}
          scrollEventThrottle={100}
          contentContainerStyle={styles.page}>
          <View style={styles.inner}>
            <ThemedText style={[styles.eyebrow, { color: theme.dim }]}>
              CHƯƠNG {chapter.number}
            </ThemedText>
            <ThemedText style={[styles.title, { color: theme.fg, fontSize: fontSize * 1.5 }]}>
              {chapter.title}
            </ThemedText>

            {paragraphs.map((p, i) => (
              <ThemedText
                key={i}
                style={{
                  color: theme.fg,
                  fontFamily: prefs.serif ? FontFamily.read : FontFamily.ui,
                  fontSize,
                  lineHeight: fontSize * READING_LINE_HEIGHT,
                  marginBottom: fontSize,
                }}>
                {p.trim()}
              </ThemedText>
            ))}

            <View style={[styles.nav, { borderColor: theme.dim }]}>
              <NavButton
                label="‹ Chương trước"
                disabled={!hasPrev}
                theme={theme}
                onPress={() => router.replace(`/truyen/${slug}/${number - 1}`)}
              />
              <NavButton
                label="Chương sau ›"
                disabled={!hasNext}
                theme={theme}
                onPress={() => router.replace(`/truyen/${slug}/${number + 1}`)}
              />
            </View>
          </View>
        </ScrollView>

        <View style={[styles.track, { backgroundColor: theme.dim }]}>
          <View style={[styles.trackFill, { backgroundColor: theme.fg, width: `${progress * 100}%` }]} />
        </View>

        <ReaderSettings
          visible={settingsOpen}
          prefs={prefs}
          onChange={update}
          onClose={() => setSettingsOpen(false)}
        />
      </View>
    </>
  );
}

function NavButton({
  label,
  disabled,
  theme,
  onPress,
}: {
  label: string;
  disabled: boolean;
  theme: (typeof ReadingThemes)[keyof typeof ReadingThemes];
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.navBtn,
        { borderColor: theme.dim, opacity: disabled ? 0.35 : pressed ? 0.6 : 1 },
      ]}>
      <ThemedText style={{ color: theme.fg, fontFamily: FontFamily.uiSemi, fontSize: 14 }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.four },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topText: { fontFamily: FontFamily.uiMedium, fontSize: 13.5 },
  page: { paddingHorizontal: Spacing.four, paddingTop: Spacing.four, paddingBottom: Spacing.six },
  inner: { width: '100%', maxWidth: ReadingWidth, marginHorizontal: 'auto' },
  eyebrow: { fontFamily: FontFamily.uiSemi, fontSize: 11, letterSpacing: 1.2, marginBottom: Spacing.two },
  title: { fontFamily: FontFamily.readSemi, lineHeight: 40, marginBottom: Spacing.four },
  nav: { flexDirection: 'row', gap: Spacing.three, marginTop: Spacing.four, paddingTop: Spacing.four, borderTopWidth: 1 },
  navBtn: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: Spacing.three, alignItems: 'center' },
  track: { height: 3 },
  trackFill: { height: '100%' },
});
