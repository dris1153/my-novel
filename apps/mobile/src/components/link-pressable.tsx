import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

type Props = {
  href: Href;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

/**
 * Slot của expo-router (`asChild`) không merge được style dạng mảng — nó ném lỗi
 * thẳng. Flatten ở đúng một chỗ này để mọi nơi gọi cứ truyền mảng thoải mái,
 * thay vì nhớ StyleSheet.flatten ở từng Link.
 */
export function LinkPressable({ href, style, children }: Props) {
  return (
    <Link href={href} asChild>
      <Pressable style={({ pressed }) => StyleSheet.flatten([style, pressed && styles.pressed])}>
        {children}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.65 },
});
