export function logPerformance(label, duration) {
  if (duration > 100) {
    console.warn(`[Performance] ${label} took ${duration.toFixed(2)}ms (>100ms)`);
  }
}

export function measurePerformance(label, fn) {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  logPerformance(label, duration);
  return result;
}

export async function measureAsync(label, asyncFn) {
  const start = performance.now();
  const result = await asyncFn();
  const duration = performance.now() - start;
  logPerformance(label, duration);
  return result;
}

// Enable React DevTools hint in production
if (typeof window !== 'undefined' && import.meta.env?.PROD) {
  if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.info('[Performance] Install React DevTools for better debugging: https://react.dev/tools');
  }
}
