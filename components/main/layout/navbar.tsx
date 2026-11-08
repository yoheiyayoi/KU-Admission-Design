"use client"

import Image from "next/image";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react";
import { useState } from "react";

export const NavLinks = {
  "หน้าหลัก": "/",
  "ปฏิทิน": "/calender",
  "สาขาและโครงการรับสมัคร": "/majors",
  "ค้นหาสาขา": "/majors/search",
}

export default function Navbar() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <header className="sticky top-0 z-50 border-b">
      {showBanner && (
        <div className="p-3 bg-rose-600 text-white">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">นี่ไม่ใช่เว็บไซต์ทางการ เป็นเพียงเว็บไซต์สำหรับทดสอบเท่านั้น</p>
              <a href="https://admission.ku.ac.th/" className="text-white hover:text-gray-200">
                กดที่นี่เพื่อไปยังเว็บ https://admission.ku.ac.th/
              </a>
            </div>
            <Button
              onClick={() => setShowBanner(false)}
              aria-label="ปิดประกาศ"
              size="icon-lg"
              variant="ghost"
              className="hover:bg-white/30 hover:text-white"
            >
              <X size={20} />
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white text-(--ku-color) font-heading p-4" >
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          <Link className="flex gap-3" href="/">
            <Image
              src="/ku-name-logo.svg"
              alt="Profile photo"
              width={500}
              height={500}
              className="size-12 object-cover"
            />

            <div>
              <p>ระบบรับสมัครนักศึกษา (เว็บไซต์จำลอง)</p>
              <p>มหาวิทยาลัยเกษตรศาสตร์</p>
            </div>
          </Link>

          <div className="hidden md:flex gap-6">
            {Object.entries(NavLinks).map(([label, href]) => (
              <Link key={href} href={href} className="transition underline underline-offset-3 decoration-transparent hover:decoration-(--ku-color)">
                {label}
              </Link>
            ))}
          </div>

          <div className="block md:hidden font-heading">
            <Sheet>
              <SheetTrigger render={<Button size="icon-lg" variant="ghost"><Menu /></Button>} />
              <SheetContent className="font-heading">
                <div className="flex flex-col gap-4 text-lg p-4">
                  {Object.entries(NavLinks).map(([label, href]) => (
                    <Link key={href} href={href} className="text-(--ku-color) transition underline underline-offset-3 decoration-transparent hover:decoration-(--ku-color)">
                      {label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
}
