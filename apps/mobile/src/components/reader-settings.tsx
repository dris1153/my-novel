import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';

import {
  FontFamily,
  READING_SIZES,
  Radius,
  ReadingThemes,
  Spacing,
  type ReadingThemeKey,
} from '@/constants/theme';
import type { ReaderPrefs } from '@/hooks/use-reader-prefs';

type Props = {
  visible: boolean;
  prefs: ReaderPrefs;
  onChange: (patch: Partial<ReaderPrefs>) => void;
  onClose: () => void;
};

export function ReaderSettings({ visible, prefs, onChange, onClose }: Props) {
  const theme = ReadingThemes[prefs.theme];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Đóng tuỳ chỉnh" />
      <View style={[styles.sheet, { backgroundColor: theme.bg }]}>
        <View style={[styles.grabber, { backgroundColor: theme.dim }]} />

        <ThemedText style={[styles.label, { color: theme.dim }]}>CỠ CHỮ</ThemedText>
        <View style={styles.sizeRow}>
          {READING_SIZES.map((size, i) => (
            <Pressable
              key={size}
              onPress={() => onChange({ sizeIndex: i })}
              accessibilityRole="button"
              accessibilityLabel={`Cỡ chữ ${size}`}
              style={[
                styles.sizeBtn,
                {
                  borderColor: i === prefs.sizeIndex ? theme.fg : theme.dim,
                  backgroundColor: i === prefs.sizeIndex ? theme.fg : 'transparent',
                },
              ]}>
              <ThemedText
                style={{
                  color: i === prefs.sizeIndex ? theme.bg : theme.fg,
                  fontSize: 11 + i,
                  fontFamily: FontFamily.uiSemi,
                }}>
                A
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <ThemedText style={[styles.label, { color: theme.dim }]}>NỀN</ThemedText>
        <View style={styles.themeRow}>
          {(Object.keys(ReadingThemes) as ReadingThemeKey[]).map((key) => (
            <Pressable
              key={key}
              onPress={() => onChange({ theme: key })}
              accessibilityRole="button"
              accessibilityLabel={ReadingThemes[key].label}
              style={[
                styles.themeSwatch,
                {
                  backgroundColor: ReadingThemes[key].bg,
                  borderColor: key === prefs.theme ? theme.fg : theme.dim,
                  borderWidth: key === prefs.theme ? 2 : 1,
                },
              ]}>
              <ThemedText style={{ color: ReadingThemes[key].fg, fontSize: 11, fontFamily: FontFamily.uiSemi }}>
                {ReadingThemes[key].label}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <ThemedText style={[styles.label, { color: theme.dim }]}>KIỂU CHỮ</ThemedText>
        <View style={styles.fontRow}>
          <Pressable
            onPress={() => onChange({ serif: true })}
            style={[
              styles.fontBtn,
              { borderColor: prefs.serif ? theme.fg : theme.dim, borderWidth: prefs.serif ? 2 : 1 },
            ]}>
            <ThemedText style={{ color: theme.fg, fontFamily: FontFamily.read, fontSize: 14 }}>
              Literata
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => onChange({ serif: false })}
            style={[
              styles.fontBtn,
              { borderColor: !prefs.serif ? theme.fg : theme.dim, borderWidth: !prefs.serif ? 2 : 1 },
            ]}>
            <ThemedText style={{ color: theme.fg, fontFamily: FontFamily.ui, fontSize: 14 }}>
              Be Vietnam
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#00000059' },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.four,
    paddingBottom: Spacing.five,
    gap: Spacing.two,
  },
  grabber: { width: 36, height: 4, borderRadius: Radius.pill, alignSelf: 'center', marginBottom: Spacing.three },
  label: { fontFamily: FontFamily.uiSemi, fontSize: 11, letterSpacing: 1, marginTop: Spacing.two },
  sizeRow: { flexDirection: 'row', gap: Spacing.two },
  sizeBtn: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeRow: { flexDirection: 'row', gap: Spacing.two },
  themeSwatch: {
    flex: 1,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontRow: { flexDirection: 'row', gap: Spacing.two },
  fontBtn: { flex: 1, paddingVertical: Spacing.three, borderRadius: Radius.md, alignItems: 'center' },
});
