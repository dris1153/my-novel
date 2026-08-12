import {
  TabList,
  TabSlot,
  TabTrigger,
  Tabs,
  type TabListProps,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LinkPressable } from './link-pressable';
import { ThemedText } from './themed-text';

import { FontFamily, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useTheme } from '@/hooks/use-theme';

/**
 * Tab bar cross-platform bằng `expo-router/ui` Tabs (JS thuần — KHÔNG dùng
 * NativeTabs "unstable" nữa, thứ hay crash native và không test được qua web).
 * Desktop: top header. Mobile: bottom bar. Cùng một code path cho cả hai nền.
 *
 * `Tabs` chỉ quét con TRỰC TIẾP để tìm TabList → phải bọc chrome qua `asChild`.
 */
export default function AppTabs() {
  const { isDesktop } = useBreakpoint();

  if (isDesktop) {
    return (
      <Tabs>
        <TabList asChild>
          <HeaderBar>
            <TabTrigger name="index" href="/" asChild>
              <NavLink>Trang chủ</NavLink>
            </TabTrigger>
            <TabTrigger name="tu-truyen" href="/tu-truyen" asChild>
              <NavLink>Tủ truyện</NavLink>
            </TabTrigger>
          </HeaderBar>
        </TabList>
        <TabSlot />
      </Tabs>
    );
  }

  return (
    <Tabs>
      <TabSlot />
      <TabList asChild>
        <BottomBar>
          <TabTrigger name="index" href="/" asChild>
            <TabButton icon="⌂">Trang chủ</TabButton>
          </TabTrigger>
          <TabTrigger name="tu-truyen" href="/tu-truyen" asChild>
            <TabButton icon="▤">Tủ truyện</TabButton>
          </TabTrigger>
        </BottomBar>
      </TabList>
    </Tabs>
  );
}

/* ── Desktop: top header ─────────────────────────────────────────────── */

function HeaderBar(props: TabListProps) {
  const colors = useTheme();

  return (
    <View
      {...props}
      // Flatten: HeaderBar là con của <TabList asChild>, Slot không merge mảng.
      style={StyleSheet.flatten([
        styles.header,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ])}>
      <View style={styles.headerInner}>
        <LinkPressable href="/">
          <ThemedText style={styles.brand}>Truyện</ThemedText>
        </LinkPressable>

        <View style={styles.navRow}>{props.children}</View>

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
      </View>
    </View>
  );
}

function NavLink({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedText
        themeColor={isFocused ? 'accent' : 'textSecondary'}
        style={[styles.navLink, isFocused && styles.navLinkOn]}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

/* ── Mobile: bottom bar ──────────────────────────────────────────────── */

function BottomBar(props: TabListProps) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      {...props}
      style={StyleSheet.flatten([
        styles.bottom,
        { backgroundColor: colors.surface, borderColor: colors.border, paddingBottom: insets.bottom + Spacing.two },
      ])}>
      {props.children}
    </View>
  );
}

function TabButton({
  children,
  icon,
  isFocused,
  ...props
}: TabTriggerSlotProps & { icon: string }) {
  return (
    <Pressable {...props} style={styles.tabBtn}>
      <ThemedText themeColor={isFocused ? 'accent' : 'textTertiary'} style={styles.tabIcon}>
        {icon}
      </ThemedText>
      <ThemedText themeColor={isFocused ? 'accent' : 'textTertiary'} style={styles.tabLabel}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // desktop header
  header: { borderBottomWidth: 1, width: '100%' },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    marginHorizontal: 'auto',
  },
  brand: { fontFamily: FontFamily.serif, fontSize: 22 },
  navRow: { flexDirection: 'row', gap: Spacing.three, alignItems: 'center' },
  navLink: { fontFamily: FontFamily.uiMedium, fontSize: 14.5 },
  navLinkOn: { fontFamily: FontFamily.uiSemi },
  search: {
    marginLeft: 'auto',
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minWidth: 260,
  },
  searchText: { fontFamily: FontFamily.ui, fontSize: 13.5 },
  pressed: { opacity: 0.6 },

  // mobile bottom bar
  bottom: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: Spacing.two,
  },
  tabBtn: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: Spacing.one },
  tabIcon: { fontFamily: FontFamily.ui, fontSize: 20, lineHeight: 24 },
  tabLabel: { fontFamily: FontFamily.uiMedium, fontSize: 11 },
});
