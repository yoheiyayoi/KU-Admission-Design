// มีการใช้ AI ช่วยดึงข้อมูลให้
// รวมถึงการปรับปรุงดีไซน์และแก้ข้อความ

"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ChevronDown, GraduationCap, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type {
    MajorCampus,
    MajorFaculty,
    MajorProgram,
    MajorProject,
    MajorsDirectory,
} from "@/lib/majors"

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border bg-card px-4 py-3">
            <p className="font-heading text-2xl font-semibold tabular-nums text-(--ku-color)">
                {value}
            </p>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    )
}

function MajorRow({ major, projects }: { major: MajorProgram; projects: MajorProject[] }) {
    return (
        <li className="py-2.5 first:pt-3 last:pb-3">
            <div className="flex items-start gap-2.5">
                {major.degree && (
                    <span
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 rounded border border-foreground/10 bg-foreground/5 px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                        {major.degree}
                    </span>
                )}
                <span className="min-w-0 flex-1">
                    <span className="block text-base leading-snug">{major.title}</span>
                    {projects.length > 0 && (
                        <span className="mt-1 flex flex-wrap gap-1">
                            {projects.map((project) => (
                                <span
                                    key={`${project.name}-${project.round ?? "x"}`}
                                    className="rounded-md bg-(--ku-color)/8 px-1.5 py-px text-sm text-(--ku-color)"
                                >
                                    {project.name}
                                </span>
                            ))}
                        </span>
                    )}
                    {major.projects.length > 0 && projects.length === 0 && (
                        <span className="mt-1 block text-sm text-muted-foreground">
                            ไม่เปิดรับในรอบนี้
                        </span>
                    )}
                </span>
            </div>
        </li>
    )
}

function FacultySection({
    faculty,
    open,
    onToggle,
    projectsFor,
}: {
    faculty: MajorFaculty
    open: boolean
    onToggle: () => void
    projectsFor: (major: MajorProgram) => MajorProject[]
}) {
    return (
        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
            <div className="flex items-center transition hover:bg-muted/40">
                <button
                    type="button"
                    onClick={onToggle}
                    aria-expanded={open}
                    className="flex min-w-0 flex-1 items-center gap-3 p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ku-color)/60"
                >
                    <span
                        aria-hidden="true"
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-(--ku-color)/10 text-(--ku-color)"
                    >
                        <GraduationCap className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block truncate font-heading text-base font-medium">
                            {faculty.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                            {faculty.majors.length > 0
                                ? `${faculty.majors.length} สาขา/โครงการ`
                                : "ยังไม่มีข้อมูลสาขา"}
                        </span>
                    </span>
                    <ChevronDown
                        aria-hidden="true"
                        className={cn(
                            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                            open && "rotate-180"
                        )}
                    />
                </button>

                <a
                    href={faculty.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`ดู ${faculty.name} บนเว็บไซต์ KU`}
                    className="mr-2 flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground outline-none transition hover:text-(--ku-color) focus-visible:ring-2 focus-visible:ring-(--ku-color)/60"
                >
                    <ArrowUpRight className="size-4" />
                </a>
            </div>

            <div
                className={cn(
                    "grid transition-[grid-template-rows] duration-200 ease-out",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
            >
                <div className="min-h-0 overflow-hidden">
                    <div className="border-t border-foreground/5 px-4 pb-2">
                        {faculty.majors.length > 0 ? (
                            <ul className="divide-y divide-foreground/5">
                                {faculty.majors.map((major) => (
                                    <MajorRow
                                        key={major.name}
                                        major={major}
                                        projects={projectsFor(major)}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <p className="py-3 text-sm text-muted-foreground">
                                ยังไม่มีข้อมูลสาขา/โครงการในรอบนี้
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function MajorExplorer({ directory }: { directory: MajorsDirectory }) {
    const { campuses } = directory
    const [selectedCampusId, setSelectedCampusId] = useState<number | null>(
        campuses[0]?.id ?? null
    )
    const [query, setQuery] = useState("")
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
    // null = ดูครบทุกรอบ, เลขรอบ = กรองเฉพาะโครงการของรอบนั้น
    const [selectedRound, setSelectedRound] = useState<number | null>(null)

    const campus = useMemo(
        () => campuses.find((item: MajorCampus) => item.id === selectedCampusId) ?? null,
        [campuses, selectedCampusId]
    )

    const allFaculties = campuses.flatMap((c) => c.faculties)
    const totals = {
        faculties: allFaculties.length,
        majors: allFaculties.reduce((sum, faculty) => sum + faculty.majors.length, 0), // นับว่ามีทั้งหมดกี่สาขา
    }

    // vv โค้ดที่ AI เขียน แต่เอาออกเพราะรู้สึกว่าไม่จำเป็น
    // const totals = useMemo(() => {
    //     const faculties = campuses.reduce((acc, item) => acc + item.faculties.length, 0)
    //     const majors = campuses.reduce(
    //         (acc, item) =>
    //             acc + item.faculties.reduce((sum, faculty) => sum + faculty.majors.length, 0),
    //         0
    //     )
    //     return { faculties, majors }
    // }, [campuses])

    const campusMajors = useMemo(
        () => campus ? campus.faculties.reduce((sum, faculty) => sum + faculty.majors.length, 0) : 0,
        [campus]
    )

    // กรองโครงการตามรอบที่เลือก (null = ทุกรอบ)
    const projectsFor = useMemo(
        () => (major: MajorProgram): MajorProject[] =>
            selectedRound === null
                ? major.projects
                : major.projects.filter((project) => project.round === selectedRound),
        [selectedRound]
    )

    const normalizedQuery = query.trim().toLowerCase()

    const searchGroups = useMemo(() => {
        if (!campus || !normalizedQuery) return []
        return campus.faculties
            .map((faculty) => ({
                faculty,
                hits: faculty.majors.filter((major) =>
                    major.name.toLowerCase().includes(normalizedQuery)
                ),
            }))
            .filter((group) => group.hits.length > 0)
    }, [campus, normalizedQuery])

    const searchHitCount = useMemo(
        () => searchGroups.reduce((acc, group) => acc + group.hits.length, 0),
        [searchGroups]
    )

    const allExpanded =
        campus !== null &&
        campus.faculties.length > 0 &&
        campus.faculties.every((faculty) => expandedIds.has(faculty.id))

    const toggleFaculty = (id: number) => {
        setExpandedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    const handleCampusChange = (campusName: string | null) => {
        const next = campuses.find((item) => item.name === campusName)
        setSelectedCampusId(next?.id ?? null)
        setQuery("")
        setExpandedIds(new Set())
        setSelectedRound(null)
    }

    return (
        <div className="space-y-8">
            {/* <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Stat label="วิทยาเขต" value={String(campuses.length)} />
                <Stat label="คณะ/หน่วยงาน" value={String(totals.faculties)} />
                <Stat label="สาขา/โครงการ" value={totals.majors.toLocaleString("th-TH")} />
            </dl> */}

            <Card className="mx-auto w-full gap-0 p-0 text-base">
                <CardHeader className="flex items-center gap-1.5 bg-gray-50 py-3 font-heading">
                    <Search className="size-4" /> ค้นหา
                </CardHeader>
                <CardContent className="w-full p-4 font-body">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="campus" className="text-base">วิทยาเขต</FieldLabel>
                            <Combobox
                                items={campuses.map((item) => item.name)}
                                value={campus?.name ?? null}
                                onValueChange={handleCampusChange}
                            >
                                <ComboboxInput
                                    id="campus"
                                    placeholder="เลือกวิทยาเขต..."
                                    showClear
                                />
                                <ComboboxContent>
                                    <ComboboxList>
                                        {(name) => (
                                            <ComboboxItem key={name} value={name} className="font-body">
                                                {name}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                    <ComboboxEmpty>ไม่พบวิทยาเขตที่ค้นหา</ComboboxEmpty>
                                </ComboboxContent>
                            </Combobox>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="major-search" className="text-base">
                                ค้นหาสาขา/โครงการ
                            </FieldLabel>
                            <div className="relative">
                                <Search
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                />
                                <Input
                                    id="major-search"
                                    type="search"
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder={
                                        campus
                                            ? "พิมพ์ชื่อสาขา เช่น คอมพิวเตอร์, นิติศาสตร์, พยาบาล..."
                                            : "เลือกวิทยาเขตก่อน..."
                                    }
                                    disabled={!campus}
                                    className="pl-8"
                                />
                                {query && (
                                    <button
                                        type="button"
                                        onClick={() => setQuery("")}
                                        aria-label="ล้างคำค้นหา"
                                        className="absolute right-1.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-(--ku-color)/60"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                )}
                            </div>
                        </Field>
                    </FieldGroup>
                </CardContent>
            </Card>

            {!campus ? (
                <Card className="mx-auto max-w-2xl p-8 text-center">
                    <h2 className="font-heading text-lg font-semibold">ยังไม่ได้เลือกวิทยาเขต</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        เลือกวิทยาเขตจากช่องค้นหาด้านบน หรือเลือกจากรายการด้านล่าง
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {campuses.map((item) => (
                            <Button
                                key={item.id}
                                variant="outline"
                                size="sm"
                                onClick={() => handleCampusChange(item.name)}
                            >
                                {item.name}
                            </Button>
                        ))}
                    </div>
                </Card>
            ) : (
                <section className="space-y-4" aria-label={`สาขาของ${campus.name}`}>
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <h2 className="font-heading text-xl font-semibold sm:text-2xl">
                                {campus.name}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {campus.faculties.length} คณะ - {campusMajors.toLocaleString("th-TH")}{" "}
                                สาขา/โครงการ
                            </p>
                        </div>

                        {!normalizedQuery && campus.faculties.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setExpandedIds(
                                        allExpanded
                                            ? new Set()
                                            : new Set(campus.faculties.map((faculty) => faculty.id))
                                    )
                                }
                            >
                                {allExpanded ? "ย่อทั้งหมด" : "ขยายทั้งหมด"}
                            </Button>
                        )}
                    </div>

                    {campus.rounds.length > 0 && (
                        <div
                            role="group"
                            aria-label="รอบการรับสมัคร"
                            className="flex flex-wrap items-center gap-2"
                        >
                            <span className="text-sm text-muted-foreground">รอบการรับสมัคร:</span>
                            <Button
                                type="button"
                                size="sm"
                                variant={selectedRound === null ? "default" : "outline"}
                                onClick={() => setSelectedRound(null)}
                                aria-pressed={selectedRound === null}
                                className={cn(
                                    selectedRound === null &&
                                        "bg-(--ku-color) text-white hover:bg-(--ku-color)/90"
                                )}
                            >
                                ทั้งหมด
                            </Button>
                            {campus.rounds.map((round) => {
                                const active = selectedRound === round.number
                                return (
                                    <Button
                                        key={round.number}
                                        type="button"
                                        size="sm"
                                        variant={active ? "default" : "outline"}
                                        onClick={() => setSelectedRound(active ? null : round.number)}
                                        aria-pressed={active}
                                        className={cn(
                                            active &&
                                                "bg-(--ku-color) text-white hover:bg-(--ku-color)/90"
                                        )}
                                    >
                                        {round.label}
                                    </Button>
                                )
                            })}
                        </div>
                    )}

                    {normalizedQuery ? (
                        <div className="space-y-5">
                            {searchGroups.length > 0 ? (
                                <>
                                    <p className="text-sm text-muted-foreground">
                                        พบ {searchHitCount} สาขา/โครงการ จาก{" "}
                                        {searchGroups.length} คณะ สำหรับคำค้น “{query.trim()}”
                                    </p>
                                    {searchGroups.map(({ faculty, hits }) => (
                                        <section key={faculty.id}>
                                            <h3 className="mb-2 flex items-center gap-2 font-heading text-base font-semibold">
                                                {faculty.name}
                                                <span className="text-sm font-normal text-muted-foreground">
                                                    ({hits.length})
                                                </span>
                                            </h3>
                                            <ul className="divide-y divide-foreground/5 rounded-xl bg-card px-4 py-1 ring-1 ring-foreground/10">
                                                {hits.map((major) => (
                                                    <MajorRow
                                                        key={major.name}
                                                        major={major}
                                                        projects={projectsFor(major)}
                                                    />
                                                ))}
                                            </ul>
                                        </section>
                                    ))}
                                </>
                            ) : (
                                <Card className="p-8 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        ไม่พบ “{query.trim()}” ในสาขาของ{campus.name}
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-3"
                                        onClick={() => setQuery("")}
                                    >
                                        ล้างคำค้นหา
                                    </Button>
                                </Card>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {campus.faculties.map((faculty) => (
                                <FacultySection
                                    key={faculty.id}
                                    faculty={faculty}
                                    open={expandedIds.has(faculty.id)}
                                    onToggle={() => toggleFaculty(faculty.id)}
                                    projectsFor={projectsFor}
                                />
                            ))}
                            {campus.faculties.length === 0 && (
                                <Card className="p-8 text-center text-sm text-muted-foreground">
                                    ยังไม่พบข้อมูลคณะของวิทยาเขตนี้
                                </Card>
                            )}
                        </div>
                    )}
                </section>
            )}
        </div>
    )
}
