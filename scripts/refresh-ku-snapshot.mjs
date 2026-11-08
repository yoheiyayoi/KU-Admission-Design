// สร้าง lib/majors-snapshot.ts (ข้อมูลสำรอง) จากเว็บ KU โดยใช้ตัว parser ชุดเดียวกับ lib/majors.ts
// รัน: node scripts/refresh-ku-snapshot.mjs
// ควร rerun ตอนข้อมูลสาขาของ TCAS เปลี่ยน (ทุกปี) แล้ว commit ไฟล์ snapshot ใหม่

import { writeFileSync } from "node:fs"

const moduleUrl = new URL("../lib/majors.ts", import.meta.url).href
const { parseSelectOptions, parseMajorsDirectory } = await import(moduleUrl)

const BASE = "https://admission.ku.ac.th"

async function fetchPage(url) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 10000)
    try {
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
        return await res.text()
    } finally {
        clearTimeout(timer)
    }
}

console.log("dowloading", `${BASE}/majors/campus/1/`)
const first = await fetchPage(`${BASE}/majors/campus/1/`)
const campusIds = [
    ...new Set(
        parseSelectOptions(first)
            .filter((option) => option.type === "campus")
            .map((option) => option.id)
    ),
]
if (campusIds.length === 0) {
    throw new Error("ไม่เจอวิทยาเขตใน select ของหน้าแรก")
}

const pages = []
for (const id of campusIds) {
    if (id === 1) {
        pages.push({ campusId: id, html: first })
        continue
    }
    console.log("dowloading", `${BASE}/majors/campus/${id}/`)
    pages.push({ campusId: id, html: await fetchPage(`${BASE}/majors/campus/${id}/`) })
}

const campuses = parseMajorsDirectory(pages)
if (campuses.length === 0) {
    throw new Error("parser ประกอบวิทยาเขตไม่ได้")
}

const now = new Date()
const fetchedAtIso = now.toISOString()
const fetchedAtThai = now.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })

function programLiteral(program, indent) {
    const pad = " ".repeat(indent)
    return `${pad}{ name: ${JSON.stringify(program.name)}, degree: ${
        program.degree === null ? "null" : JSON.stringify(program.degree)
    }, title: ${JSON.stringify(program.title)}, projects: ${JSON.stringify(program.projects)} }`
}

function facultyLiteral(faculty, indent) {
    const pad = " ".repeat(indent)
    const majorsInner = faculty.majors
        .map((program) => programLiteral(program, indent + 4))
        .join(",\n")
    return [pad + "{", `${pad}    id: ${faculty.id},`, `${pad}    name: ${JSON.stringify(faculty.name)},`, `${pad}    url: ${JSON.stringify(faculty.url)},`, `${pad}    majors: [`, majorsInner, `${pad}    ],`, pad + "}"].join("\n")
}

const lines = []
lines.push("// ข้อมูลสำรอง (snapshot) ของวิทยาเขต คณะ และสาขา/โครงการ ดึงจาก https://admission.ku.ac.th/majors/campus/{id}/")
lines.push(`// สร้างโดย: node scripts/refresh-ku-snapshot.mjs เมื่อ ${fetchedAtThai}`)
lines.push("// ใช้เมื่อ lib/majors.ts เรียกเว็บจริงไม่ได้ ตัวเลขเป็นข้อมูลจริง ณ วันที่สร้าง")
lines.push("")
lines.push('import type { MajorCampus } from "@/lib/majors"')
lines.push("")
lines.push(`export const MAJORS_SNAPSHOT_FETCHED_AT = ${JSON.stringify(fetchedAtIso)}`)
lines.push("")
lines.push("export const MAJORS_SNAPSHOT_CAMPUSES: MajorCampus[] = [")
for (const campus of campuses) {
    lines.push(`    {`)
    lines.push(`        id: ${campus.id},`)
    lines.push(`        name: ${JSON.stringify(campus.name)},`)
    lines.push(`        url: ${JSON.stringify(campus.url)},`)
    lines.push(`        faculties: [`)
    for (const faculty of campus.faculties) {
        lines.push(facultyLiteral(faculty, 12).split("\n").map((l) => "        " + l).join("\n") + ",")
    }
    lines.push(`        ],`)
    lines.push(`    },`)
}
lines.push("]")
lines.push("")

const defaultOut = new URL("../lib/majors-snapshot.ts", import.meta.url)
const outTarget = process.env.KU_SNAPSHOT_OUT ?? defaultOut

writeFileSync(outTarget, lines.join("\n"), "utf8")

const totalMajors = campuses.reduce(
    (acc, campus) =>
        acc + campus.faculties.reduce((sum, faculty) => sum + faculty.majors.length, 0),
    0
)
const totalFaculties = campuses.reduce((acc, campus) => acc + campus.faculties.length, 0)
console.log(
    `ok: ${campuses.length} วิทยาเขต, ${totalFaculties} คณะ, ${totalMajors} สาขา/โครงการ -> lib/majors-snapshot.ts`
)
