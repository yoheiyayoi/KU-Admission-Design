// ข้อมูลปฏิทินการรับสมัคร ปีการศึกษา 2570 จาก https://admission.ku.ac.th/
// เว็บไซต์ไม่มี API/JSON ให้เรียกตรงๆ จึงดึง (fetch) HTML มาวิเคราะห์ตารางปฏิทินตอน request
// หากโครงสร้างหน้าเว็บเปลี่ยนไปจนวิเคราะห์ไม่ได้ จะคืนข้อมูลสำรอง (snapshot) ที่ดึงไว้แล้วแทน

// ไฟล์นี้สร้างโดย AI

export type CalendarEvent = {
    label: string
    values: string[]
    url?: string
}

export type CalendarCampus = {
    name: string
    subColumns?: string[]
    events: CalendarEvent[]
}

export type CalendarRound = {
    id: string
    label: string
    campuses: CalendarCampus[]
}

const fallbackRounds: CalendarRound[] = [
    {
        id: "round1",
        label: "รอบที่ 1 Portfolio",
        campuses: [
            {
                name: "วิทยาเขตบางเขน โครงการจัดตั้งวิทยาเขตสุพรรณบุรี และวิทยาลัยการชลประทาน",
                subColumns: ["รอบที่ 1.1", "รอบที่ 1.2"],
                events: [
                    { label: "รับสมัคร", values: ["18 ก.ย. - 14 ต.ค. 69", "4 ม.ค. 70 - 4 ก.พ. 70"] },
                    { label: "ประกาศรายชื่อผู้มีสิทธิ์สอบสัมภาษณ์", values: ["3 พ.ย. 69", "2 มี.ค. 70"] },
                    { label: "สอบสัมภาษณ์", values: ["9 พ.ย. 69", "4 มี.ค. 70"] },
                    { label: "ประกาศผลสอบสัมภาษณ์", values: ["16 พ.ย. 69", "5 มี.ค. 70"] },
                ],
            },
            {
                name: "วิทยาเขตกำแพงแสน",
                subColumns: ["รอบที่ 1.1", "รอบที่ 1.2"],
                events: [
                    { label: "รับสมัคร", values: ["1 ต.ค. - 5 พ.ย. 69", "1 ธ.ค. 69 - 10 ก.พ. 70"] },
                    { label: "ประกาศรายชื่อผู้มีสิทธิ์สอบสัมภาษณ์", values: ["16 พ.ย. 69", "22 ก.พ. 70"] },
                    { label: "สอบสัมภาษณ์", values: ["20 พ.ย. 69", "25-26 ก.พ. 70"] },
                    { label: "ประกาศผลสอบสัมภาษณ์", values: ["24 พ.ย. 69", "2 มี.ค. 70"] },
                ],
            },
            {
                name: "วิทยาเขตศรีราชา",
                subColumns: ["รอบที่ 1.1", "รอบที่ 1.2"],
                events: [
                    { label: "รับสมัคร", values: ["25 ส.ค. - 15 พ.ย. 69", "20 ธ.ค. 69 - 10 ก.พ. 70"] },
                    { label: "ประกาศรายชื่อผู้มีสิทธิ์สอบสัมภาษณ์", values: ["4 ธ.ค. 69", "21 ก.พ. 70"] },
                    { label: "สอบสัมภาษณ์", values: ["13 ธ.ค. 69", "27 ก.พ. 70"] },
                    { label: "ประกาศผลสอบสัมภาษณ์", values: ["18 ธ.ค. 69", "3 มี.ค. 70"] },
                ],
            },
            {
                name: "วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร",
                events: [
                    { label: "รับสมัคร", values: ["24 ส.ค. 69 - 19 ก.พ. 70"] },
                    { label: "ประกาศผลการคัดเลือก", values: ["หลังชำระเงิน 1 วันทำการ ยกเว้นสาขาวศ.โยธา"] },
                    { label: "สอบสัมภาษณ์", values: ["เฉพาะสาขาวศ.โยธา 26 ก.พ. 70"] },
                ],
            },
        ],
    },
    {
        id: "round2",
        label: "รอบที่ 2 Quota",
        campuses: [
            {
                name: "วิทยาเขตบางเขน โครงการจัดตั้งวิทยาเขตสุพรรณบุรี และวิทยาลัยการชลประทาน",
                events: [
                    { label: "รับสมัคร", values: ["15 - 22 มี.ค. 70"] },
                    { label: "ประกาศรายชื่อผู้มีสิทธิ์ทดสอบความสามารถ", values: ["ตามที่โครงการกำหนด"] },
                    { label: "ประกาศรายชื่อผู้มีสิทธิ์สอบสัมภาษณ์", values: ["24 เม.ย. 70"] },
                    { label: "สอบสัมภาษณ์", values: ["27 เม.ย. 70"] },
                    { label: "ประกาศผลสอบสัมภาษณ์", values: ["ภายใน 29 เม.ย. 70"] },
                ],
            },
            {
                name: "วิทยาเขตกำแพงแสน",
                events: [
                    { label: "รับสมัคร", values: ["18 มี.ค. - 11 เม.ย. 70"] },
                    { label: "ประกาศรายชื่อผู้มีสิทธิ์เข้าทดสอบทักษะ", values: ["ตามที่โครงการกำหนด"] },
                    { label: "ประกาศรายชื่อผู้มีสิทธิ์สอบสัมภาษณ์", values: ["23 เม.ย. 70"] },
                    { label: "สอบสัมภาษณ์", values: ["26 เม.ย. 70"] },
                    { label: "ประกาศผลสอบสัมภาษณ์", values: ["ภายใน 28 เม.ย. 70"] },
                ],
            },
            {
                name: "วิทยาเขตศรีราชา",
                events: [
                    { label: "รับสมัคร", values: ["รอประกาศ"] },
                    { label: "ประกาศรายชื่อผู้มีสิทธิ์สอบสัมภาษณ์", values: ["รอประกาศ"] },
                    { label: "สอบสัมภาษณ์", values: ["รอประกาศ"] },
                    { label: "ประกาศผลสอบสัมภาษณ์", values: ["รอประกาศ"] },
                ],
            },
            {
                name: "วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร",
                events: [
                    { label: "รับสมัคร", values: ["20 มี.ค. - 16 เม.ย. 70"] },
                    { label: "ประกาศผลการคัดเลือก", values: ["29 เม.ย. 70"] },
                    { label: "สอบสัมภาษณ์", values: ["เฉพาะสาขาวศ.โยธา 26 เม.ย. 70"] },
                ],
            },
        ],
    },
    {
        id: "round3",
        label: "รอบที่ 3 Admission",
        campuses: [
            {
                name: "ทุกวิทยาเขต รับสมัครผ่านระบบของ ทปอ. ทางเว็บไซต์ mytcas.com",
                events: [
                    { label: "รับสมัคร", values: ["7 - 11 พ.ค. 70"] },
                    { label: "ประกาศผล (ครั้งที่ 1)", values: ["22 พ.ค. 70"] },
                    { label: "ยืนยันสิทธิ์ (ครั้งที่ 1)", values: ["22 - 23 พ.ค. 70"] },
                    { label: "ประกาศผล (ครั้งที่ 2) โดยระบบยืนยันสิทธิ์ให้อัตโนมัติ", values: ["27 พ.ค. 70"] },
                    { label: "สละสิทธิ์ในระบบ mytcas", values: ["28 พ.ค. 70"] },
                    { label: "สอบสัมภาษณ์หรือส่งผลตรวจสุขภาพ (ถ้ามี)", values: ["ภายใน 31 พ.ค. 70"] },
                    { label: "ประกาศรายชื่อผู้ยืนยันสิทธิ์", values: ["7 มิ.ย. 70"] },
                ],
            },
        ],
    }
]

/* ------------------------------------------------------------------ */
/*  Parser: ดึงตารางปฏิทินจาก HTML ของเว็บ admission.ku.ac.th           */
/* ------------------------------------------------------------------ */

function stripTags(input: string): string {
    return input
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/&quot;/gi, '"')
        .replace(/\s+/g, " ")
        .trim()
}

function extractTables(html: string): string[] {
    const tables: string[] = []
    const re = /<table\b[^>]*>([\s\S]*?)<\/table>/gi
    let match: RegExpExecArray | null
    while ((match = re.exec(html))) {
        tables.push(match[1])
    }
    return tables
}

function tableRows(tableHtml: string): string[][] {
    const rows: string[][] = []
    const trRe = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi
    let trMatch: RegExpExecArray | null
    while ((trMatch = trRe.exec(tableHtml))) {
        const cells: string[] = []
        const cellRe = /<(?:th|td)\b[^>]*>([\s\S]*?)<\/(?:th|td)>/gi
        let cellMatch: RegExpExecArray | null
        while ((cellMatch = cellRe.exec(trMatch[1]))) {
            cells.push(stripTags(cellMatch[1]))
        }
        if (cells.length > 0 && cells.some((cell) => cell.length > 0)) {
            rows.push(cells)
        }
    }
    return rows
}

function isCampusRow(cells: string[]): boolean {
    return cells[0].includes("วิทยาเขต") || cells[0].includes("สำนักงาน")
}

function isSubHeader(cell: string): boolean {
    return cell.length > 0 && cell.startsWith("รอบที่")
}

function isEventLabel(cell: string): boolean {
    if (cell.length === 0) return false
    return /รับสมัคร|สอบสัมภาษณ์|ประกาศ|ยืนยันสิทธิ์|สละสิทธิ์|ตรวจสอบ|เข้าศึกษา/.test(cell)
}

function withUrlValue(cell: string): { value: string | null; url: string | null } {
    if (/^https?:\/\//i.test(cell)) {
        return { value: null, url: cell.trim() }
    }
    return { value: cell, url: null }
}

function parseRoundTable(rows: string[][]): CalendarRound | null {
    let label = ""
    const campuses: CalendarCampus[] = []
    let current: CalendarCampus | null = null
    let subColumns: string[] = []

    const flush = () => {
        if (current && current.events.length > 0) campuses.push(current)
    }

    for (const cells of rows) {
        const first = cells[0]

        // แถวชื่อรอบ เช่น "รอบที่ 1 Portfolio" (เป็นแถวเซลล์เดียว)
        if (cells.length === 1 && /^รอบที่\s*\d/.test(first)) {
            label = first
            continue
        }

        if (isCampusRow(cells)) {
            flush()
            subColumns = cells.slice(1).filter(isSubHeader).map((cell) => cell.trim())
            current = {
                name: first,
                ...(subColumns.length > 0 ? { subColumns } : {}),
                events: [],
            }
            // บางวิทยาเขตมีเหตุการณ์แรกอยู่ในแถวเดียวกับชื่อ เช่น | ชื่อ | รับสมัคร | วันที่ |
            const rest = cells
                .slice(1)
                .filter((cell) => cell.length > 0 && !isSubHeader(cell))
            if (rest.length >= 2 && isEventLabel(rest[0])) {
                const values: string[] = []
                let url: string | undefined
                for (const item of rest.slice(1)) {
                    const { value, url: detectedUrl } = withUrlValue(item)
                    if (value) values.push(value)
                    if (detectedUrl) url = detectedUrl
                }
                if (values.length > 0) current.events.push({ label: rest[0], values, ...(url ? { url } : {}) })
                else if (url) current.events.push({ label: rest[0], values: ["ตรวจสอบที่เว็บไซต์"], url })
            }
            continue
        }

        if (!current) continue // แถวหัวตาราง เช่น "รอบรับสมัคร | กำหนดการ"
        if (!isEventLabel(first)) continue

        const values: string[] = []
        let url: string | undefined
        for (const item of cells.slice(1)) {
            const { value, url: detectedUrl } = withUrlValue(item)
            if (value) values.push(value)
            if (detectedUrl) url = detectedUrl
        }
        if (values.length === 0) continue
        current.events.push({ label: first, values, ...(url ? { url } : {}) })
    }
    flush()

    if (!label || campuses.length === 0) return null
    const numberMatch = label.match(/\d+/)
    return { id: `round${numberMatch ? numberMatch[0] : "1"}`, label, campuses }
}

function parseRoundsFromHtml(html: string): CalendarRound[] | null {
    const startMark = "ปฏิทินการรับสมัคร"
    const start = html.indexOf(startMark)
    if (start === -1) return null
    const from = start + startMark.length

    // ตัดเอาเฉพาะส่วนของปฏิทิน (ถึงหัวข้อถัดไป) เพื่อไม่เจอตารางอื่น ๆ บนหน้า
    const endMark = "ระบบรับสมัครแยกตามวิทยาเขต"
    const endIdx = html.indexOf(endMark, from)
    const slice = endIdx === -1 ? html.slice(from) : html.slice(from, endIdx)

    const tables = extractTables(slice)
    if (tables.length < 1) return null

    const rounds: CalendarRound[] = []
    for (const tableHtml of tables) {
        const round = parseRoundTable(tableRows(tableHtml))
        if (!round) return null
        rounds.push(round)
    }
    if (rounds.length < 3) return null
    return rounds
}

export async function getCalendarData(): Promise<CalendarRound[]> {
    try {
        const res = await fetch("https://admission.ku.ac.th/", {
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(6000),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const html = await res.text()
        const parsed = parseRoundsFromHtml(html)
        if (parsed) return parsed
    } catch {
        // fall through to snapshot data
    }
    return fallbackRounds
}
