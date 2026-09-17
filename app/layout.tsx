import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raeed Dev | اشتراكات رقمية",
  description: "اشتراكاتك الرقمية بمكان واحد",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
