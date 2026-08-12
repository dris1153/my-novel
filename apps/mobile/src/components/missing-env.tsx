import { StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';

import { Colors, FontFamily, Radius, Spacing } from '@/constants/theme';

/**
 * Thay cho việc ném lỗi ở module scope. Env sai là chuyện thường lúc setup,
 * không đáng để app chết câm.
 */
export function MissingEnv({ keys }: { keys: string[] }) {
  return (
    <View style={[styles.page, { backgroundColor: Colors.light.background }]}>
      <View style={[styles.card, { borderColor: Colors.light.border }]}>
        <ThemedText style={[styles.title, { color: Colors.light.accent }]}>
          Thiếu cấu hình
        </ThemedText>
        <ThemedText style={[styles.body, { color: Colors.light.textSecondary }]}>
          Chưa đọc được biến môi trường:
        </ThemedText>
        {keys.map((k) => (
          <ThemedText key={k} style={[styles.code, { color: Colors.light.text }]}>
            {k}
          </ThemedText>
        ))}
        <ThemedText style={[styles.body, { color: Colors.light.textSecondary }]}>
          Copy <ThemedText style={styles.inline}>apps/mobile/.env.example</ThemedText> thành{' '}
          <ThemedText style={styles.inline}>apps/mobile/.env</ThemedText>, điền giá trị từ
          Supabase Dashboard → Project Settings → API Keys, rồi khởi động lại bằng{' '}
          <ThemedText style={styles.inline}>pnpm mobile --clear</ThemedText>.
        </ThemedText>
        <ThemedText style={[styles.hint, { color: Colors.light.textTertiary }]}>
          File .env phải lưu dạng UTF-8 không BOM — có BOM thì biến đầu tiên bị đọc sai tên.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.four },
  card: {
    maxWidth: 480,
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  title: { fontFamily: FontFamily.uiBold, fontSize: 18 },
  body: { fontFamily: FontFamily.ui, fontSize: 14, lineHeight: 22 },
  code: { fontFamily: FontFamily.uiSemi, fontSize: 13.5 },
  inline: { fontFamily: FontFamily.uiSemi },
  hint: { fontFamily: FontFamily.ui, fontSize: 12.5, lineHeight: 19, marginTop: Spacing.one },
});
