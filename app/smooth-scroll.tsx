"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      }}
    >
      {children}
    </ReactLenis>
  );
}
