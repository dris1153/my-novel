import { StyleSheet, View } from 'react-native';
import { formatCount, timeAgo } from 'shared';

import { LinkPressable } from './link-pressable';
import { NovelCover } from './novel-cover';
import { ThemedText } from './themed-text';

import { FontFamily, Spacing } from '@/constants/theme';
import type { NovelCard as NovelCardData } from '@/lib/queries';

export function NovelGridCard({ novel, width }: { novel: NovelCardData; width: number }) {
  return (
    <LinkPressable href={`/truyen/${novel.slug}`} style={{ width }}>
      <NovelCover uri={novel.cover_url} title={novel.title} seed={novel.slug} width={width} />
      <ThemedText numberOfLines={2} style={styles.gridTitle}>
        {novel.title}
      </ThemedText>
      <ThemedText themeColor="textTertiary" style={styles.meta}>
        {novel.chapters?.[0]?.count ?? 0} chương · {timeAgo(novel.updated_at)}
      </ThemedText>
    </LinkPressable>
  );
}

export function NovelListRow({ novel }: { novel: NovelCardData }) {
  return (
    <LinkPressable href={`/truyen/${novel.slug}`} style={styles.row}>
      <NovelCover uri={novel.cover_url} title={novel.title} seed={novel.slug} width={48} />
      <View style={styles.rowBody}>
        <ThemedText numberOfLines={1} style={styles.rowTitle}>
          {novel.title}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.meta} numberOfLines={1}>
          {novel.author}
        </ThemedText>
        <ThemedText themeColor="textTertiary" style={styles.meta}>
          {novel.chapters?.[0]?.count ?? 0} chương · {formatCount(novel.view_count)} lượt đọc ·{' '}
          {timeAgo(novel.updated_at)}
        </ThemedText>
      </View>
    </LinkPressable>
  );
}

const styles = StyleSheet.create({
  gridTitle: {
    fontFamily: FontFamily.serif, // Opennote: tên truyện là serif
    fontSize: 16,
    lineHeight: 20,
    marginTop: Spacing.two,
  },
  meta: { fontFamily: FontFamily.ui, fontSize: 12, lineHeight: 17 },
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  rowBody: { flex: 1, gap: 1 },
  rowTitle: { fontFamily: FontFamily.serif, fontSize: 17, lineHeight: 21 },
});
