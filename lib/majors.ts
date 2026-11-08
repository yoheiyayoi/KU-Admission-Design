// ข้อมูลวิทยาเขต คณะ และสาขา/โครงการที่เปิดรับ จาก https://admission.ku.ac.th/majors/campus/{id}/
// เว็บไซต์ไม่มี API/JSON ให้เรียกตรงๆ จึงดึง HTML มาวิเคราะห์ตอน request เหมือน lib/calendar.ts
//   - รายชื่อวิทยาเขต + คณะ  อ่านจาก <select class="target-selects"> ซึ่งทุกหน้าแสดงชุดเดียวกัน
//     (option ของวิทยาเขตมี data-sel-type="campus", ของคณะมี data-sel-type="faculty")
//   - รอบการรับสมัคร อ่านจากปุ่ม <a class="nav-link round-buttons" data-round-number="N"> เช่น "รอบที่ 1"
//   - รายชื่อสาขา/โครงการต่อคณะ อ่านจากตาราง <table id="majorTableId"> ของแต่ละวิทยาเขต
//     แต่ละแถวสาขามีคอลัมน์โครงการ (ช้างเผือก, นานาชาติ, พสวท. ฯลฯ) ที่มีเครื่องหมาย ✓ = เปิดรับผ่านโครงการนั้น
//     ชื่อคอลัมน์เก็บชื่อเต็มพร้อมรอบย่อย (เช่น "ช้างเผือก (รอบ 1.1)") และเลขรอบจาก class p-round-N
// หากโครงสร้างหน้าเว็บเปลี่ยนไปจนวิเคราะห์ไม่ได้ จะคืนข้อมูลสำรอง (lib/majors-snapshot.ts) ที่ดึงไว้แล้วแทน

// หมายเหตุ: โค้ดในไฟล์นี้หลีกเลี่ยงไวยากรณ์ TS ที่ type-stripping ของ Node ลบไม่ได้ (enum/namespace ฯลฯ)
// เพื่อให้ scripts/refresh-ku-snapshot.mjs import parser แล้ว rerun ข้อมูลสำรองได้โดยตรง

export type MajorProject = {
    name: string // ชื่อเต็มโครงการที่แสดง เช่น "ช้างเผือก (รอบ 1.1)" หรือ "เรียนล่วงหน้า"
    round: number | null // เลขรอบการรับสมัคร เช่น 1 (จาก class p-round-N ของคอลัมน์)
}

export type MajorRound = {
    number: number // เลขรอบ เช่น 1
    label: string // ฉลากสำหรับแสดง เช่น "รอบที่ 1"
}

export type MajorProgram = {
    name: string // ชื่อเต็ม เช่น "วท.บ. สาขาวิชาคณิตศาสตร์ (ภาษาไทย ปกติ)"
    degree: string | null // วุฒิ/ชื่อปริญญา เช่น "วท.บ." (ถอดจาก prefix ของชื่อ)
    title: string // ชื่อสาขาที่เหลือ เช่น "สาขาวิชาคณิตศาสตร์ (ภาษาไทย ปกติ)"
    projects: MajorProject[] // โครงการที่เปิดรับ เช่น [{ name: "ช้างเผือก (รอบ 1.1)", round: 1 }]
}

export type MajorFaculty = {
    id: number
    name: string
    url: string
    majors: MajorProgram[]
}

export type MajorCampus = {
    id: number
    name: string
    url: string
    rounds: MajorRound[] // รอบการรับสมัครที่หน้าเว็บประกาศ เช่น [{ number: 1, label: "รอบที่ 1" }]
    faculties: MajorFaculty[]
}

export type MajorsDirectory = {
    campuses: MajorCampus[]
    fetchedAt: string
    source: "live" | "snapshot"
}

export type KUCampusPage = {
    campusId: number
    html: string
}

const KU_BASE = "https://admission.ku.ac.th"
const REVALIDATE_SECONDS = 60 * 60 * 24 // ข้อมูลสาขาเปลี่ยนแปลงไม่บ่อย แคช 1 วัน

function kuUrl(kind: "campus" | "faculty", id: number): string {
    return `${KU_BASE}/majors/${kind}/${id}/`
}

function decodeEntities(input: string): string {
    return input
        .replace(/&nbsp;|&#160;/gi, " ")
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/&quot;/gi, '"')
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
}

function textOnly(html: string): string {
    return decodeEntities(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim()
}

type KUOption = {
    type: "campus" | "faculty"
    id: number
    name: string
}

/**
 * อ่านตัวเลือกวิทยาเขต/คณะจาก <select class="target-selects">
 * ชื่อวิทยาเขตในหน้าเว็บมี "--- ชื่อ ---" ส่วนชื่อคณะมีคำนำ "››" คงถอดออกตอนเก็บชื่อ
 */
export function parseSelectOptions(html: string): KUOption[] {
    const options: KUOption[] = []
    const select = html.match(/<select class="target-selects"[\s\S]*?<\/select>/i)?.[0]
    if (!select) return options

    const optionRe = /<option\b([^>]*)>([\s\S]*?)<\/option>/gi
    let match: RegExpExecArray | null
    while ((match = optionRe.exec(select))) {
        const attrs = match[1]
        const type = attrs.match(/data-sel-type="([^"]+)"/i)?.[1]
        const id = Number(attrs.match(/data-sel-id="(\d+)"/i)?.[1])
        if (type !== "campus" && type !== "faculty") continue
        if (!Number.isFinite(id)) continue

        const raw = textOnly(match[2])
        const name =
            type === "campus"
                ? raw.replace(/^\s*---\s*|\s*---\s*$/g, "")
                : raw.replace(/^\s*››\s*/, "")
        if (!name) continue
        options.push({ type, id, name })
    }
    return options
}

/**
 * หัวตารางใช้ <br> คั่นคำ ทำให้ชื่อโครงการมีช่องว่างหลงมา (เช่น "นานาชาติและ ภาษาอังกฤษ")
 * ตัดช่องว่างระหว่างอักษรไทยทิ้งให้เหลือชื่อเดียว ("นานาชาติและภาษาอังกฤษ")
 * ชื่อโครงการคง "(รอบ x.y)" ไว้เพื่อแสดงเหมือนเว็บต้นทาง เช่น "ช้างเผือก (รอบ 1.1)"
 */
function collapseThaiSpaces(label: string): string {
    const re = /([\u0E00-\u0E7F])\s+([\u0E00-\u0E7F])/g
    let previous: string
    do {
        previous = label
        label = label.replace(re, "$1$2")
    } while (label !== previous)
    return label
}

/** แยกวุฒิ (เช่น "วท.บ.") ออกจากชื่อสาขาจาก prefix ของชื่อเต็ม */
function toMajorProgram(name: string): { degree: string | null; title: string } {
    const degreeMatch = name.match(/^((?:[\u0E00-\u0E7F]{1,3}\.)+)/)
    if (degreeMatch) {
        const degree = degreeMatch[1]
        return { degree, title: name.slice(degree.length).trim() }
    }
    return { degree: null, title: name }
}

/** อ่านรอบการรับสมัครจากปุ่ม <a class="nav-link round-buttons" data-round-number="N"> บนหน้าวิทยาเขต
 * (อยู่ใน <ul class="nav nav-pills ..."> ถัดจากป้าย "รอบการรับสมัคร:") เช่น { number: 1, label: "รอบที่ 1" } */
export function parseCampusRounds(html: string): MajorRound[] {
    const pills = html.match(/<ul class="nav nav-pills mb-1 pb-2">([\s\S]*?)<\/ul>/i)?.[1]
    if (!pills) return []

    const rounds: MajorRound[] = []
    for (const m of pills.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
        if (!/round-buttons/.test(m[1])) continue // ข้ามป้าย "รอบการรับสมัคร:" ที่ไม่ใช่ปุ่มรอบ
        const number = Number(m[1].match(/data-round-number="(\d+)"/i)?.[1])
        const label = textOnly(m[2])
        if (!Number.isFinite(number) || !label) continue
        rounds.push({ number, label })
    }
    return rounds
}

/**
 * ชื่อคอลัมน์โครงการจาก <thead> ของตารางสาขา
 * เก็บชื่อเต็ม (รวม "(รอบ 1.1)" ถ้ามี) และเลขรอบจาก class p-round-N เพื่อ
 *   - แสดงเหมือนเว็บต้นทาง เช่น "ช้างเผือก (รอบ 1.1)" แทนการรวมสองคอลัมน์เป็น "ช้างเผือก"
 *   - กรองรายการตามรอบการรับสมัครในหน้าเว็บของเรา
 */
function parseProjectColumns(tableHtml: string): MajorProject[] {
    const thead = tableHtml.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i)?.[1]
    if (!thead) return []

    const projects: MajorProject[] = []
    for (const m of thead.matchAll(/<th\b([^>]*)>([\s\S]*?)<\/th>/gi)) {
        const label = collapseThaiSpaces(textOnly(m[2]))
        if (!label || label === "สาขาวิชา") continue
        const roundMatch = m[1].match(/class="[^"]*\bp-round-(\d+)\b[^"]*"/i)
        const project = { name: label, round: roundMatch ? Number(roundMatch[1]) : null }
        if (!projects.some((p) => p.name === project.name && p.round === project.round)) {
            projects.push(project)
        }
    }
    return projects
}

/**
 * อ่านรายชื่อสาขา/โครงการต่อคณะจากตาราง <table id="majorTableId">
 * แถวหัวคณะคือ <tr class="table-info"> แถวถัดไปจนถึงหัวคณะถัดไป = สาขาที่เปิดรับ
 * ในแต่ละแถวสาขา คอลัมน์โครงการที่มีเครื่องหมาย ✓ = เปิดรับผ่านโครงการนั้น
 */
export function parseMajorSections(
    html: string
): Array<{ name: string; majors: MajorProgram[] }> {
    const table = html.match(/<table id="majorTableId"[\s\S]*?<\/table>/i)?.[0]
    if (!table) return []

    const projects = parseProjectColumns(table)
    const tbody = table.match(/<tbody>([\s\S]*?)<\/tbody>/i)?.[1]
    if (!tbody) return []

    const sections: Array<{ name: string; majors: MajorProgram[] }> = []
    let current: { name: string; majors: MajorProgram[] } | null = null

    const rowRe = /<tr\b([^>]*)>([\s\S]*?)<\/tr>/gi
    let match: RegExpExecArray | null
    while ((match = rowRe.exec(tbody))) {
        const attrs = match[1]
        const body = match[2]

        if (/table-info/.test(attrs)) {
            if (current) sections.push(current)
            const cell = body.match(/<td\b[^>]*>([\s\S]*?)<\/td>/i)?.[1]
            const name = cell
                ? textOnly(cell).replace(/\s*\(วิทยาเขต[^)]*\)\s*$/, "")
                : ""
            current = name ? { name, majors: [] } : null
            continue
        }

        if (!current) continue
        const cells = [...body.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map((c) => c[1])
        if (cells.length === 0) continue

        const name = textOnly(cells[0])
        if (!name) continue
        const { degree, title } = toMajorProgram(name)

        const projectsForMajor: MajorProject[] = []
        for (let i = 0; i < Math.min(cells.length - 1, projects.length); i += 1) {
            const project = projects[i]
            if (project && /fa-check/.test(cells[i + 1]) && !projectsForMajor.includes(project)) {
                projectsForMajor.push(project)
            }
        }
        current.majors.push({ name, degree, title, projects: projectsForMajor })
    }
    if (current) sections.push(current)
    return sections
}

function matchMajorSection(
    facultyName: string,
    sections: Array<{ name: string; majors: MajorProgram[] }>
): { name: string; majors: MajorProgram[] } | null {
    // หัวตารางเป็น "<ชื่อคณะ> (คำอธิบายวิทยาเขต...)" ส่วนชื่อใน select อาจต่อท้ายชื่อวิทยาเขต
    // จึงจับคู่ได้ทั้งสองทาง ถ้าเลขไม่ตรงเป๊ะก็หาแบบ prefix กันพลาด
    for (const section of sections) {
        if (section.name === facultyName) return section
    }
    for (const section of sections) {
        if (facultyName.startsWith(section.name)) return section
    }
    for (const section of sections) {
        if (section.name.startsWith(facultyName)) return section
    }
    return null
}

/**
 * ประกอบโครงสร้างวิทยาเขต/คณะ/สาขาจาก HTML ของแต่ละหน้าวิทยาเขต (อย่างน้อยต้องมีหน้าแรก)
 * ฟังก์ชันนี้เป็น pure และใช้ได้ทั้งใน Next (ตอน request) และในสคริปต์สร้าง snapshot
 */
export function parseMajorsDirectory(pages: KUCampusPage[]): MajorCampus[] {
    const first = pages[0]
    if (!first) return []

    const campuses: MajorCampus[] = []
    let current: MajorCampus | null = null
    for (const option of parseSelectOptions(first.html)) {
        if (option.type === "campus") {
            if (current) campuses.push(current)
            current = {
                id: option.id,
                name: option.name,
                url: kuUrl("campus", option.id),
                rounds: [],
                faculties: [],
            }
        } else if (option.type === "faculty" && current) {
            current.faculties.push({
                id: option.id,
                name: option.name,
                url: kuUrl("faculty", option.id),
                majors: [],
            })
        }
    }
    if (current) campuses.push(current)
    if (campuses.length === 0) return []

    for (const page of pages) {
        const campus = campuses.find((item) => item.id === page.campusId)
        if (!campus) continue
        const sections = parseMajorSections(page.html)
        campus.faculties = campus.faculties.map((faculty) => ({
            ...faculty,
            majors: matchMajorSection(faculty.name, sections)?.majors ?? [],
        }))

        // รอบการรับสมัคร: เอามาจากปุ่มบนหน้า และรวมเลขรอบจากคอลัมน์โครงการด้วย
        // (เผื่อหน้าเว็บเปลี่ยนไม่แสดงปุ่มแต่คอลัมน์ยังมี class p-round-N) เรียงตามเลขรอบ
        const fromPills = parseCampusRounds(page.html)
        const seen = new Set(campus.rounds.map((round) => round.number))
        const rounds = [...campus.rounds]
        for (const round of fromPills) {
            if (seen.has(round.number)) continue
            seen.add(round.number)
            rounds.push(round)
        }
        for (const faculty of campus.faculties) {
            for (const major of faculty.majors) {
                for (const project of major.projects) {
                    if (project.round === null || seen.has(project.round)) continue
                    seen.add(project.round)
                    rounds.push({ number: project.round, label: `รอบที่ ${project.round}` })
                }
            }
        }
        rounds.sort((a, b) => a.number - b.number)
        campus.rounds = rounds
    }
    return campuses
}

async function fetchKUText(url: string): Promise<string> {
    const res = await fetch(url, {
        next: { revalidate: REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
    return res.text()
}

/**
 * ดึงข้อมูลวิทยาเขต/คณะ/สาขาแบบ live จากเว็บ KU หากพลาด (หน้าเว็บเปลี่ยน/เน็ตขัดข้อง) คืน snapshot
 */
export async function getMajorsDirectory(): Promise<MajorsDirectory> {
    try {
        const firstHtml = await fetchKUText(kuUrl("campus", 1))

        const shells = parseSelectOptions(firstHtml)
        const campusIds = [
            ...new Set(
                shells.filter((option) => option.type === "campus").map((option) => option.id)
            ),
        ]
        if (campusIds.length === 0) throw new Error("parse select options failed")

        // ดึงตารางสาขาของทุกวิทยาเขต; หากหน้าหนึ่งพลาดให้ข้ามไป (เหลือสาขาว่าง) ไม่ล้มทั้งหน้า
        const pages: KUCampusPage[] = campusIds.map((campusId) => ({
            campusId,
            html: campusId === 1 ? firstHtml : "",
        }))

        await Promise.all(
            pages.map(async (page) => {
                if (page.html) return
                try {
                    page.html = await fetchKUText(kuUrl("campus", page.campusId))
                } catch {
                    page.html = "" // ข้ามหน้า พลาดเฉพาะสาขาของวิทยาเขตนี้
                }
            })
        )

        const campuses = parseMajorsDirectory(pages)
        if (campuses.length === 0) throw new Error("parse majors directory failed")

        return { campuses, fetchedAt: new Date().toISOString(), source: "live" }
    } catch {
        const { MAJORS_SNAPSHOT_CAMPUSES, MAJORS_SNAPSHOT_FETCHED_AT } = await import(
            "@/lib/majors-snapshot"
        )
        return {
            campuses: MAJORS_SNAPSHOT_CAMPUSES.map((campus) => ({
                ...campus,
                faculties: campus.faculties.map((faculty) => ({
                    ...faculty,
                    majors: faculty.majors.map((major) => ({
                        ...major,
                        projects: [...major.projects],
                    })),
                })),
            })),
            fetchedAt: MAJORS_SNAPSHOT_FETCHED_AT,
            source: "snapshot",
        }
    }
}
