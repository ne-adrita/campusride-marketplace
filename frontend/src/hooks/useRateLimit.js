import { useRef, useCallback } from 'react';

export default function useRateLimit(delay = 2000) {
  const lastCallRef = useRef(0);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    if (now - lastCallRef.current < delay) {
      return false;
    }
    lastCallRef.current = now;
    return true;
  }, [delay]);

  return checkRateLimit;
}
