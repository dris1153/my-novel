import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NovelListRow } from '@/components/novel-card';
import { ThemedText } from '@/components/themed-text';
import { FontFamily, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { searchNovels, type NovelCard } from '@/lib/queries';

export default function SearchScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [term, setTerm] = useState('');
  const [results, setResults] = useState<NovelCard[]>([]);
  const [loading, setLoading] = useState(false);

  // Bật loading ngay trong handler gõ phím; đặt trong effect thì React Compiler
  // báo cascading render.
  function onChangeTerm(next: string) {
    setTerm(next);
    const q = next.trim();
    setLoading(q !== '');
    if (q === '') setResults([]);
  }

  // Chờ người dùng ngừng gõ rồi mới gọi API.
  useEffect(() => {
    const q = term.trim();
    if (!q) return;

    let cancelled = false;
    const timer = setTimeout(() => {
      searchNovels(q)
        .then((r) => !cancelled && setResults(r))
        .catch(() => !cancelled && setResults([]))
        .finally(() => !cancelled && setLoading(false));
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [term]);

  return (
    <View style={[styles.page, { backgroundColor: colors.background, paddingTop: insets.top + Spacing.two }]}>
      <View style={styles.inner}>
        <View style={styles.bar}>
          <TextInput
            value={term}
            onChangeText={onChangeTerm}
            placeholder="Tìm truyện, tác giả…"
            placeholderTextColor={colors.textTertiary}
            autoFocus
            returnKeyType="search"
            style={[
              styles.input,
              {
                backgroundColor: colors.backgroundElement,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
          />
          <Pressable onPress={() => router.back()} style={({ pressed }) => pressed && styles.pressed}>
            <ThemedText themeColor="accent" style={styles.cancel}>
              Huỷ
            </ThemedText>
          </Pressable>
        </View>

        {loading && <ActivityIndicator color={colors.accent} style={styles.spinner} />}

        {!loading && term.trim() !== '' && results.length === 0 && (
          <ThemedText themeColor="textSecondary" style={styles.empty}>
            Không tìm thấy truyện nào khớp “{term.trim()}”.
          </ThemedText>
        )}

        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.list}>
          {results.map((n) => (
            <NovelListRow key={n.id} novel={n} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingHorizontal: Spacing.four },
  inner: { flex: 1, width: '100%', maxWidth: MaxContentWidth, marginHorizontal: 'auto' },
  bar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, marginBottom: Spacing.three },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    fontFamily: FontFamily.ui,
    fontSize: 15,
  },
  cancel: { fontFamily: FontFamily.uiMedium, fontSize: 14 },
  spinner: { marginTop: Spacing.four },
  empty: { fontFamily: FontFamily.ui, fontSize: 14, marginTop: Spacing.four },
  list: { gap: Spacing.three, paddingBottom: Spacing.six },
  pressed: { opacity: 0.6 },
});
