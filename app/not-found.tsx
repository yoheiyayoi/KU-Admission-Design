import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function notFound() {
    return (
        <div>
            <div className="custom-container space-y-8">
                <div className="bg-white w-full p-4 rounded-lg border">
                    <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
                        ขออภัยเราไม่พบหน้าที่คุณกำลังค้นหา
                    </h1>
                    <p className="mt-1 mb-1 text-sm text-muted-foreground sm:text-base">
                        กรุณาตรวจสอบ URL หรือกลับไปยังหน้าหลัก
                    </p>


                    <Link href="/">
                        <Button variant="secondary" size="lg">
                            <ArrowLeft /> กลับหน้าหลัก
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
