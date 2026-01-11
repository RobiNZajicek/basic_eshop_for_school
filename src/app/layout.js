import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "E-Shop | D1 Repository Pattern",
  description: "Moderní e-shop - školní projekt",
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body className={`${inter.variable} font-sans min-h-screen`}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-zinc-800 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-6 text-center text-zinc-500 text-sm">
              <p>E-Shop © 2026 • D1 Repository Pattern • Školní projekt</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
