'use client';

import { useEffect, useState } from 'react';
import Provider, { AppProviderProps } from '@components/provider';

export function ContainerProvider({ children, ...props }: AppProviderProps) {
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <Provider {...props}>{children}</Provider>;
}
