import type { Metadata } from "next";
import SessionWrapper from "@/components/utils/SessionWrapper";

export const metadata: Metadata = {
  title: "Адмін панель - Shy Cakes",
  description: "Панель адміністратора",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionWrapper>
      <div className="pt-16">
        {children}
      </div>
    </SessionWrapper>
  );
}
