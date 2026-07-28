import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dashboard Strategis Kabupaten Majene",
  description: "Aplikasi pemantauan indikator strategis Kabupaten Majene: Kemiskinan, PDRB, Inflasi, dan Pertanian.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex bg-[#f1f3f5] font-sans antialiased text-slate-800">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-y-auto h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
