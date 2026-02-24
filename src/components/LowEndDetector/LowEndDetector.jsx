'use client';

import { useEffect } from 'react';
import { useLowEndDevice } from '@/hooks/useLowEndDevice';

const BODY_CLASS = 'low-end';

/**
 * Устанавливает класс на document.body при определении слабого устройства,
 * чтобы CSS и компоненты могли отключать тяжёлые анимации и предзагрузку.
 */
export default function LowEndDetector() {
  const { isLowEnd } = useLowEndDevice();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isLowEnd) {
      document.body.classList.add(BODY_CLASS);
    } else {
      document.body.classList.remove(BODY_CLASS);
    }
    return () => document.body.classList.remove(BODY_CLASS);
  }, [isLowEnd]);

  return null;
}
