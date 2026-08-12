import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const subscribe = () => () => {};

/**
 * Static rendering: server luôn trả 'light', client tính lại sau khi hydrate.
 * Dùng useSyncExternalStore thay cho setState-trong-effect để React biết đây là
 * khác biệt server/client hợp lệ, không phải cascading render.
 */
export function useColorScheme() {
  const hasHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  const colorScheme = useRNColorScheme();

  return hasHydrated ? colorScheme : 'light';
}
