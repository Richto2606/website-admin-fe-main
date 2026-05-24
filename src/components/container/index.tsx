'use client';

import { useEffect, useState } from 'react';
import { ThemeProviderProps } from 'next-themes';
import Provider from '@components/provider';

export function ContainerProvider({ children, ...props }: ThemeProviderProps) {
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function (child) {
      if (child.parentNode !== this) {
        return child;
      }
      return originalRemoveChild.apply(this, arguments);
    };

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function (newNode, referenceNode) {
      if (referenceNode && referenceNode.parentNode !== this) {
        return newNode;
      }
      return originalInsertBefore.apply(this, arguments);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return <Provider {...props}>{children}</Provider>;
}
