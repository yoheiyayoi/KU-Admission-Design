import Image from "next/image";
import Link from "next/link";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react";

export const NavLinks = {
  "หน้าหลัก": "/",
  "ปฎิทิน": "/calender",
  "สาขาและโครงการรับสมัคร": "/majors",
  "ค้นหาสาขา": "/majors/search",
}

export default function Navbar() {
  return (
    <header className="bg-white text-(--ku-color) font-heading p-4 sticky top-0 z-50 border" >
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
            <p>ระบบรับสมัครนักศึกษา</p>
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
    </header>
  );
}
