"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowUpRight, GraduationCap, Search, X } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type {
    MajorSearchProject,
    MajorSearchResult,
    SearchOutcome,
} from "@/lib/majors-search"

const KU_SEARCH_URL = "https://admission.ku.ac.th/majors/search/"
const EXAMPLE_QUERIES = ["คอมพิวเตอร์", "วิศวกรรม", "พยาบาล"]

export default function MajorSearch({
    query,
    outcome,
}: {
    query: string
    outcome: SearchOutcome
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [value, setValue] = useState(query)

    useEffect(() => {
        setValue(query)
    }, [query])

    const navigate = (next: string) => {
        const trimmed = next.trim()
        startTransition(() => {
            router.push(
                trimmed ? `/majors/search/?query=${encodeURIComponent(trimmed)}` : "/majors/search"
            )
        })
    }

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <form
                role="search"
                className="flex flex-col gap-2 sm:flex-row"
                onSubmit={(event) => {
                    event.preventDefault()
                    navigate(value)
                }}
            >
                <div className="relative flex-1">
                    <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        type="search"
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        placeholder="พิมพ์ชื่อสาขา เช่น คอมพิวเตอร์ วิศวกรรม พยาบาล"
                        aria-label="ค้นหาสาขาและโครงการ"
                        className={cn("bg-white pl-8", value && "pr-8")}
                    />
                    {value && (
                        <button
                            type="button"
                            onClick={() => setValue("")}
                            aria-label="ล้างคำค้นหา"
                            className="absolute right-1.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none transition hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-(--ku-color)/60"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-(--ku-color) text-white hover:bg-(--ku-color)/90"
                >
                    {isPending ? "กำลังค้นหา..." : "ค้นหาสาขา"}
                </Button>
            </form>

            {isPending ? (
                <p role="status" className="text-center text-sm text-muted-foreground">
                    กำลังค้นหา...
                </p>
            ) : (
                <Results outcome={outcome} query={query} onNavigate={navigate} />
            )}
        </div>
    )
}

function Results({
    outcome,
    query,
    onNavigate,
}: {
    outcome: SearchOutcome
    query: string
    onNavigate: (query: string) => void
}) {
    if (outcome.kind === "idle") {
        return (
            <Card className="p-6 text-center">
                <p className="text-sm text-muted-foreground">
                    พิมพ์ชื่อสาขาที่สนใจข้างบน แล้วกด Enter หรือปุ่มค้นหา
                </p>
                <p className="mt-4 text-sm text-muted-foreground">ลองค้นจากตัวอย่าง:</p>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {EXAMPLE_QUERIES.map((q) => (
                        <Button key={q} variant="outline" size="sm" onClick={() => onNavigate(q)}>
                            {q}
                        </Button>
                    ))}
                </div>
            </Card>
        )
    }

    if (outcome.kind === "error") {
        return (
            <Card className="p-8 text-center">
                <p className="font-heading text-base font-semibold">ไม่สามารถดึงข้อมูลได้ในขณะนี้</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    เว็บ KU อาจอยู่ระหว่างการปรับปรุง หรือโครงสร้างหน้าเว็บเปลี่ยนไป ลองใหม่อีกครั้งภายหลัง
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onNavigate(query)}>
                        ลองใหม่
                    </Button>
                    <a
                        href={KU_SEARCH_URL + encodeURIComponent(query)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                        ค้นบนเว็บ KU โดยตรง
                        <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </a>
                </div>
            </Card>
        )
    }

    const { total, results } = outcome

    return (
        <section className="space-y-5" aria-label={`ผลการค้นหา ${query}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-sm text-muted-foreground">
                    พบ <span className="font-medium text-foreground">{total}</span> สาขา สำหรับคำค้น{" "}
                    <span className="font-medium text-foreground">“{query}”</span>
                </p>
                {results.length > 0 && (
                    <p className="text-xs text-muted-foreground">เฉพาะโครงการที่เปิดรับในรอบที่ 1</p>
                )}
            </div>

            {results.length > 0 ? (
                <ul className="space-y-4">
                    {results.map((result, index) => (
                        <ResultItem
                            key={`${result.campus}|${result.name}|${index}`}
                            result={result}
                        />
                    ))}
                </ul>
            ) : (
                <Card className="p-8 text-center">
                    <p className="font-heading text-base font-semibold">ไม่พบสาขาที่ต้องการ</p>
                    <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                        สำหรับคำค้น “{query}” ในรอบที่ 1 สาขาที่สนใจอาจเปิดรับในรอบอื่น ลองเปลี่ยนคำค้น
                        หรือล้างเพื่อดูใหม่
                    </p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => onNavigate("")}>
                        ล้างคำค้นหา
                    </Button>
                </Card>
            )}
        </section>
    )
}

function ResultItem({ result }: { result: MajorSearchResult }) {
    return (
        <li>
            <Card className="gap-0 overflow-hidden p-0">
                <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start gap-2.5">
                        {result.degree && (
                            <span
                                aria-hidden="true"
                                className="mt-0.5 shrink-0 rounded border border-foreground/10 bg-foreground/5 px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
                            >
                                {result.degree}
                            </span>
                        )}
                        <div className="min-w-0 flex-1">
                            <h3 className="font-heading text-base font-semibold leading-snug">
                                {result.title}
                            </h3>

                            <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
                                <GraduationCap aria-hidden="true" className="size-4" />
                                <span className="min-w-0">{result.faculty}</span>
                                {result.campus && (
                                    <span className="rounded-md bg-foreground/5 px-1.5 py-px text-xs ring-1 ring-foreground/10">
                                        {result.campus}
                                    </span>
                                )}
                            </div>

                            {result.projects.length > 0 ? (
                                <ul className="mt-3 divide-y divide-foreground/5 border-t border-foreground/5">
                                    {result.projects.map((project) => (
                                        <ProjectRow key={project.criteriaUrl + project.name} project={project} />
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-3 text-sm text-muted-foreground">
                                    ไม่พบโครงการที่เปิดรับในรอบนี้
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </li>
    )
}

function ProjectRow({ project }: { project: MajorSearchProject }) {
    const quotaIsNumber = /^\d+$/.test(project.quota)
    return (
        <li className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3">
            <span className="min-w-0 flex-1 basis-52 text-[15px] leading-snug">{project.name}</span>
            <span className="flex flex-wrap items-center justify-end gap-x-2 gap-y-2">
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                    รอบ {project.round}
                </span>
                {quotaIsNumber ? (
                    <span className="rounded-md bg-(--ku-color)/10 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-(--ku-color)">
                        รับ {project.quota}
                    </span>
                ) : (
                    <span className="text-xs text-muted-foreground">{project.quota}</span>
                )}
                <a
                    href={project.criteriaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                    อ่านเกณฑ์
                    <ArrowUpRight aria-hidden="true" className="size-3.5" />
                </a>
            </span>
        </li>
    )
}
