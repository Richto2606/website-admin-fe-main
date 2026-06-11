'use client';

import { useEffect, useState } from 'react';
import { ThemeProviderProps } from 'next-themes';
import Provider from '@components/provider';

export function ContainerProvider({ children, ...props }: ThemeProviderProps) {
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const originalRemoveChild = Node.prototype.removeChild;
    (Node.prototype as any).removeChild = function (child: Node) {
      if (child.parentNode !== this) {
        return child;
      }
      return originalRemoveChild.apply(this, arguments as any);
    };

    const originalInsertBefore = Node.prototype.insertBefore;
    (Node.prototype as any).insertBefore = function (newNode: Node, referenceNode: Node | null) {
      if (referenceNode && referenceNode.parentNode !== this) {
        return newNode;
      }
      return originalInsertBefore.apply(this, arguments as any);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return <Provider {...props}>{children}</Provider>;
}
