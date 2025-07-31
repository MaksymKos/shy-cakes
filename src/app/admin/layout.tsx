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
      <div className="min-h-screen bg-gray-50">
        <div className="pt-8">
          {children}
        </div>
      </div>
    </SessionWrapper>
  );
}
