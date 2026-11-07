import React from 'react'
import { getCalendarData } from '@/lib/calendar'
import CalendarTabs from '@/components/main/calendarTabs'

export default async function CalendarPage() {
    const rounds = await getCalendarData()

    return (
        <div className="custom-container space-y-8">
            <h1 className="font-heading text-2xl font-semibold mb-2 sm:text-3xl">ปฏิทินการรับสมัคร</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
                ข้อมูลจากเว็บไซต์ https://admission.ku.ac.th/
            </p>

            <CalendarTabs rounds={rounds} />
        </div>
    )
}
