"use client";
import { SessionProvider } from "next-auth/react";

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // рефреш кожні 5 хвилин
      refetchOnWindowFocus={false} // рефреш при фокусі вікна
    >
      {children}
    </SessionProvider>
  );
}
