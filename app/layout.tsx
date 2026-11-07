import type { Metadata } from 'next';
import { IBM_Plex_Sans_Thai, Sarabun } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import Navbar from '@/components/main/layout/navbar';

export const metadata: Metadata = {
  title: "KU Admission 70",
  description: "การสมัครเข้าศึกษาต่อมหาวิทยาลัยเกษตรศาสตร์ ปีการศึกษา 2570"
};

const headingFont = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const bodyFont = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(headingFont.variable, bodyFont.variable)}
    >
      <body>
        <ThemeProvider>
          <div className="font-body">
            <Navbar />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
