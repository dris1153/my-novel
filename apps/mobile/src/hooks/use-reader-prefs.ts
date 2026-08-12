import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import { DEFAULT_READING_SIZE_INDEX, type ReadingThemeKey } from '@/constants/theme';

export type ReaderPrefs = {
  sizeIndex: number;
  theme: ReadingThemeKey;
  serif: boolean;
};

const KEY = 'reader-prefs-v1';
const DEFAULTS: ReaderPrefs = {
  sizeIndex: DEFAULT_READING_SIZE_INDEX,
  theme: 'paper',
  serif: true,
};

/**
 * Tuỳ chỉnh đọc, lưu máy. Người đọc chỉnh một lần rồi dùng mãi nên không đưa
 * lên server — đỡ round-trip và vẫn chạy khi offline.
 */
export function useReaderPrefs() {
  const [prefs, setPrefs] = useState<ReaderPrefs>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setPrefs({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<ReaderPrefs>) });
      })
      .catch(() => {
        // Hỏng storage thì dùng mặc định, không chặn việc đọc.
      })
      .finally(() => setLoaded(true));
  }, []);

  const update = useCallback((patch: Partial<ReaderPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return { prefs, update, loaded };
}
