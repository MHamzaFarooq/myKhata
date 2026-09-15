"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export default function AppToaster() {
  const [position, setPosition] = useState<"top-right" | "top-center">(
    "top-right",
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");

    function update() {
      setPosition(query.matches ? "top-center" : "top-right");
    }

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <Toaster
      position={position}
      theme="dark"
      richColors
      duration={4000}
      toastOptions={{
        style: {
          background: "#101d27",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
        },
      }}
    />
  );
}
