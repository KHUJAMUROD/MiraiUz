'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'mirai-low-end';
const MAX_CORES = 2;
const MAX_MEMORY_GB = 4;

/**
 * Определяет, считается ли устройство «слабым» для упрощённого режима:
 * - 2 или меньше ядер CPU (hardwareConcurrency)
 * - 4 GB или меньше памяти (deviceMemory, если есть)
 * - пользователь предпочитает уменьшенное движение (prefers-reduced-motion)
 * Результат кэшируется в sessionStorage на время сессии.
 */
export function useLowEndDevice() {
  const [isLowEnd, setIsLowEnd] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached === 'true' || cached === 'false') {
      setIsLowEnd(cached === 'true');
      return;
    }

    const cores = navigator.hardwareConcurrency ?? 0;
    const memory = navigator.deviceMemory ?? 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lowEnd =
      reducedMotion ||
      cores <= MAX_CORES ||
      (memory > 0 && memory <= MAX_MEMORY_GB);

    sessionStorage.setItem(STORAGE_KEY, String(lowEnd));
    setIsLowEnd(lowEnd);
  }, []);

  return { isLowEnd: isLowEnd === true, isLowEndKnown: isLowEnd !== null };
}
