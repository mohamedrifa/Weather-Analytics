import { useEffect, useRef } from 'react';

export default function usePolling(callback, intervalMs) {
  const saved = useRef();
  useEffect(() => { saved.current = callback; }, [callback]);
  useEffect(() => {
    function tick() { saved.current(); }
    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
