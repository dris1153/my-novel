import { useCallback, useEffect, useState } from 'react';

type State<T> = { data: T | null; error: string | null; loading: boolean };

/**
 * Fetch tối giản. Không cache giữa các màn — nếu thấy chớp trắng khi back nhiều
 * thì mới cân nhắc thêm TanStack Query.
 *
 * `fn` phải ổn định (bọc useCallback ở nơi gọi); deps quyết định khi nào fetch lại.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: readonly unknown[]) {
  const [state, setState] = useState<State<T>>({ data: null, error: null, loading: true });
  // Bump để ép chạy lại effect khi refetch, thay vì gọi fetch ngoài effect.
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fn()
      .then((data) => {
        if (!cancelled) setState({ data, error: null, loading: false });
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setState({
            data: null,
            error: e instanceof Error ? e.message : 'Đã có lỗi xảy ra',
            loading: false,
          });
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const refetch = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    setNonce((n) => n + 1);
  }, []);

  return { ...state, refetch };
}
