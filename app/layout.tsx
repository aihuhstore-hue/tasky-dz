import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata: Metadata = {
  title: "Tasky DZ — كل خدماتك في مكان واحد",
  description: "منصة جزائرية لطلب الخدمات المنزلية",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <body className="min-h-full flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
