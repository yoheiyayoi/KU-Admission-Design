import { getMajorsDirectory } from "@/lib/majors"
import MajorExplorer from "@/components/main/majorExplorer"

export default async function MajorsPage() {
    // AI ช่วยดึงข้อมูลให้
    const directory = await getMajorsDirectory()

    return (
        <div className="custom-container space-y-8">
            <div className="max-w-2xl">
                <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
                    สาขาและโครงการที่รับสมัคร
                </h1>
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                    เลือกวิทยาเขตเพื่อดูสาขาและโครงการที่แต่ละคณะเปิดรับ
                    {directory.source === "snapshot" && " (กำลังแสดงข้อมูลสำรอง)"}
                </p>
            </div>

            <MajorExplorer directory={directory} />
        </div>
    )
}
