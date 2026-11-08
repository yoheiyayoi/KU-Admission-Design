import { Mail, Phone } from "lucide-react";
import Image from "next/image";

interface FooterProps {
    className?: string;
}

export default function Footer() {
    return (
        <footer className="w-full mt-15 border-t border-border/50 bg-white">
            <div className="mx-auto w-full max-w-6xl px-6">
                <div className="flex flex-col gap-10 py-10 sm:flex-row sm:items-start sm:gap-16 sm:py-12">
                    <div className="flex min-w-0 flex-col items-start gap-3">
                        <Image
                            src="ku-name-logo.svg"
                            width={50}
                            height={50}
                            alt="KU"
                        />

                        <p className="mt-1 max-w-xs text-md leading-relaxed text-gray-500">
                            ฝ่ายรับสมัครและพัฒนาการรับเข้าศึกษา <br />
                            สำนักบริหารการศึกษา มหาวิทยาลัยเกษตรศาสตร์
                        </p>
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-md font-medium text-gray-900">
                            ติดต่อ
                        </h3>

                        <p className="flex gap-2 items-center mt-2 text-md leading-relaxed text-gray-500">
                            <Phone className="size-4" /> 02-118-0100 ต่อ 8046 - 8051
                        </p>

                        <p className="flex gap-2 items-center mt-2 text-md leading-relaxed text-gray-500">
                            <Mail className="size-4" /> E-mail: admission@ku.ac.th
                        </p>
                    </div>
                </div>

                <div className="border-t border-black/5 py-5">
                    <p className="text-center text-sm tracking-wide text-gray-400 sm:text-left">
                        &copy; {new Date().getFullYear()} yooo_.

                        เครดิตรูปภาพ: KU-Photo และภาพจากเว็บไซต์วิทยาเขต และข้อมูลจาก https://admission.ku.ac.th/
                    </p>
                </div>
            </div>
        </footer>
    );
}
