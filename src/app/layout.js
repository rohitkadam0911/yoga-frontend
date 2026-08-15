import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ScrollToTop from "@/components/layout/ScrollToTop";

export const metadata = {
  title: "YogaConnect",
  description: "Book yoga classes online and offline",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ScrollToTop />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}