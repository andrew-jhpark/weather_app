import { useEffect, useState } from 'react';

/**
 * 디바운싱 훅 - 값의 변경을 지연시켜 불필요한 API 호출을 방지합니다.
 * 
 * @param value 디바운싱할 값
 * @param delay 지연 시간 (밀리초)
 * @returns 디바운싱된 값
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // value가 null이나 undefined인 경우 즉시 설정
    if (value === null || value === undefined) {
      setDebouncedValue(value);
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
