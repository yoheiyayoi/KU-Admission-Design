import { searchMajors, type SearchOutcome } from "@/lib/majors-search"
import MajorSearch from "@/components/main/majorSearch"

export default async function MajorSearchPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string | string[] }>
}) {
    // AI ช่วยเขียนตรงนี้ให้
    const params = await searchParams
    const raw = Array.isArray(params.query) ? params.query[0] : params.query
    const query = (raw ?? "").trim()

    let outcome: SearchOutcome
    if (!query) {
        outcome = { kind: "idle" }
    } else {
        const result = await searchMajors(query)
        outcome = result.ok
            ? { kind: "ok", query, total: result.data.total, results: result.data.results }
            : { kind: "error", query }
    }

    return (
        <div className="custom-container max-w-3xl! space-y-8">
            <div className="max-w-2xl">
                <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
                    ค้นหาสาขาและโครงการ
                </h1>
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                    ค้นหาชื่อสาขาที่สนใจ ผลลัพธ์รวมทุกวิทยาเขต พร้อมโครงการ รอบ และจำนวนที่รับ
                </p>
            </div>

            <MajorSearch query={query} outcome={outcome} />
        </div>
    )
}
