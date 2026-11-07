import Image from "next/image";
import Link from "next/link";

export const NavLinks = {
  "หน้าแรก": "/",
  "ปฎิทิน": "/calender",
  "ค้นหาสาขา": "/majors",
  "ติดต่อเรา": "/contact"
}

export default function Navbar() {
  return (
    <header className="bg-(--ku-color) text-white font-heading p-4 sticky top-0 z-50" >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <div className="flex gap-3">
          <Image
            src="/ku-logo.png"
            alt="Profile photo"
            width={500}
            height={500}
            className="size-12 object-cover"
          />

          <div>
            <h1>ระบบรับสมัครนักศึกษา</h1>
            <h1>มหาวิทยาลัยเกษตรศาสตร์</h1>
          </div>
        </div>

        <div className="hidden md:flex gap-6">
          {Object.entries(NavLinks).map(([label, href]) => (
            <Link key={href} href={href} className="transition underline underline-offset-2 decoration-transparent hover:decoration-white">
              {label}
            </Link>
          ))}
        </div>

      </div>
    </header>
  );
}
