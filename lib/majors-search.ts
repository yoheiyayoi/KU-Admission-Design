// ข้อมูลผลการค้นหาสาขาจาก https://admission.ku.ac.th/majors/search/?query=...
// เช่นเดียวกับ lib/majors.ts => เว็บ KU ไม่มี API/JSON จึงดึง HTML มาวิเคราะห์ตอน request
//
// หมายเหตุ: หน้า search ของ KU แสดงเฉพาะโครงการที่รับสมัครในรอบที่ 1
// แต่ละสาขาจะมีตารางโครงการ (ชื่อโครงการ / รอบ / จำนวนรับ / ลิงก์อ่านเกณฑ์)
//
// โค้ดไฟล์นี้หลีกเลี่ยงไวยากรณ์ TS ที่ type-stripping ของ Node ลบไม่ได้
// เพื่อให้สคริปต์ที่สร้างข้อมูลสำรอง import ไปใช้ได้โดยตรง

const KU_BASE = "https://admission.ku.ac.th"
const KU_SEARCH_PATH = "/majors/search/"
const REVALIDATE_SECONDS = 60 * 60 // ผลการค้นหาเปลี่ยนไม่บ่อย แคช 1 ชั่วโมง

export type MajorSearchProject = {
    name: string // ชื่อโครงการ เช่น "ช้างเผือก (รอบ 1.1)"
    round: string // รอบ เช่น "1"
    quota: string // จำนวนรับ (ตัวเลข) หรือ "*จำนวนรับรวมกับเงื่อนไขอื่น" ตามที่ KU ระบุ
    criteriaUrl: string // ลิงก์หน้าเกณฑ์ของ KU
}

export type MajorSearchResult = {
    name: string // ชื่อเต็ม เช่น "วท.บ. สาขาวิชาวิทยาการคอมพิวเตอร์ (ภาษาไทย ปกติ)"
    degree: string | null // วุฒิ เช่น "วท.บ."
    title: string // ชื่อสาขาที่เหลือจากวุฒิ
    faculty: string // ชื่อคณะ
    campus: string // ชื่อวิทยาเขต
    projects: MajorSearchProject[]
}

export type MajorSearchData = {
    query: string
    total: number
    results: MajorSearchResult[]
    fetchedAt: string
}

// ผลลัพธ์ที่เตรียมส่งให้ UI
export type SearchOutcome =
    | { kind: "idle" }
    | { kind: "error"; query: string }
    | { kind: "ok"; query: string; total: number; results: MajorSearchResult[] }

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

/** แยกวุฒิ (เช่น "วท.บ.") ออกจากชื่อสาขาจาก prefix ของชื่อเต็ม */
function splitDegree(name: string): { degree: string | null; title: string } {
    const match = name.match(/^((?:[\u0E00-\u0E7F]{1,3}\.)+)/)
    if (match) {
        const degree = match[1]
        return { degree, title: name.slice(degree.length).trim() }
    }
    return { degree: null, title: name }
}

/** อ่านแถวโครงการจาก <tbody> ของตารางผลการค้นหา */
function parseProjects(tbodyHtml: string): MajorSearchProject[] {
    const projects: MajorSearchProject[] = []
    const rowRe = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi
    let match: RegExpExecArray | null
    while ((match = rowRe.exec(tbodyHtml))) {
        const cells = [...match[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map((c) => c[1])
        if (cells.length < 4) continue
        const name = textOnly(cells[0])
        if (!name) continue
        const round = textOnly(cells[1])
        const quota = textOnly(cells[2])
        const href = cells[3].match(/href="([^"]+)"/i)?.[1]
        if (!href) continue
        projects.push({ name, round, quota, criteriaUrl: new URL(href, KU_BASE).href })
    }
    return projects
}

/**
 * แยกผลการค้นหาออกจาก HTML ของหน้า search ของ KU
 * คืน null เมื่อหาโครงสร้างไม่เจอ (หน้าเว็บเปลี่ยนไป) เพื่อให้ฝ่ายเรียกใช้รู้ว่าเจอปัญหา
 */
export function parseMajorSearch(
    html: string
): { total: number; results: MajorSearchResult[] } | null {
    const totalMatch = html.match(/พบทั้งสิ้น\s*(\d+)\s*สาขา/)
    if (!totalMatch) return null
    const total = Number(totalMatch[1])

    const results: MajorSearchResult[] = []
    // แต่ละผลลัพธ์อยู่ใน <div class="major-search-results ..."> ถัดไปจนกว่าจะเจอตัวถัดไป
    const blocks = html.split('class="major-search-results').slice(1)
    for (const block of blocks) {
        const h4 = block.match(/<h4>([\s\S]*?)<\/h4>/i)?.[1]
        if (!h4) continue
        // ตัดป้ายหมายเลขลำดับออก (<span class="badge ...">1.</span>)
        const name = textOnly(
            h4.replace(/<span\b[^>]*class="[^"]*badge[^"]*"[^>]*>[\s\S]*?<\/span>/i, "")
        )
        if (!name) continue
        const { degree, title } = splitDegree(name)

        let faculty = ""
        let campus = ""
        const locationMatch = block.match(
            /<div class="major-contents">([\s\S]*?)<span class="badge campus-badge[^"]*"[^>]*>([\s\S]*?)<\/span>/i
        )
        if (locationMatch) {
            faculty = textOnly(locationMatch[1])
            campus = textOnly(locationMatch[2])
            // บางแถวคณะติดชื่อวิทยาเขตต่อท้าย ("คณะวิทยาศาสตร์ ศรีราชา") ตัดออกเพราะมีป้ายวิทยาเขตแล้ว
            if (campus && faculty.endsWith(campus)) faculty = faculty.slice(0, -campus.length).trim()
        }

        const tbody = block.match(/<tbody>([\s\S]*?)<\/tbody>/i)?.[1]
        const projects = tbody ? parseProjects(tbody) : []

        if (!faculty && !campus && projects.length === 0) continue
        results.push({ name, degree, title, faculty, campus, projects })
    }
    return { total, results }
}

export function kuSearchUrl(query: string): string {
    return `${KU_BASE}${KU_SEARCH_PATH}?query=${encodeURIComponent(query)}`
}

/**
 * ค้นสาขาจากเว็บ KU แบบ live หากพลาด (หน้าเว็บเปลี่ยน/เน็ตขัดข้อง) คืน { ok: false }
 * ให้หน้าจอแสดงทางเลือก (ลิงก์ไปเว็บ KU โดยตรง) แทนข้อมูลที่คาดเดา
 */
export async function searchMajors(
    query: string
): Promise<{ ok: true; data: MajorSearchData } | { ok: false }> {
    try {
        const url = kuSearchUrl(query)
        const res = await fetch(url, {
            next: { revalidate: REVALIDATE_SECONDS },
            signal: AbortSignal.timeout(10000),
        })
        if (!res.ok) return { ok: false }
        const html = await res.text()
        const parsed = parseMajorSearch(html)
        if (!parsed) return { ok: false }
        return { ok: true, data: { query, ...parsed, fetchedAt: new Date().toISOString() } }
    } catch {
        return { ok: false }
    }
}
