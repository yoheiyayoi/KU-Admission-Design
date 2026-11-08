import React from 'react'

import { Card } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"
import type { CalendarRound } from "@/lib/calendar"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

// AI แก้ type error ให้
export const CALENDAR_ROUND_VISIBILITY: Record<string, boolean> = {
    round1: true,
    round2: true,
    round3: true,
    round4: false,
}

// AI สร้าง Table อันนี้
function CampusTable({ campus }: { campus: CalendarRound["campuses"][number] }) {
    const valueColumnCount = Math.max(
        campus.subColumns?.length ?? 0,
        ...campus.events.map((event) => event.values.length),
        1,
    )

    return (
        <div className="px-4 py-4 border-b border-foreground/5 last:border-b-0">
            <h3 className="mb-2 text-base font-semibold text-foreground">
                {campus.name}
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full table-fixed border-collapse text-base">
                    <colgroup>
                        <col className="w-1/2" />
                        {Array.from({ length: valueColumnCount }, (_, index) => (
                            <col key={index} style={{ width: `${50 / valueColumnCount}%` }} />
                        ))}
                    </colgroup>
                    <thead>
                        <tr className="text-left text-muted-foreground">
                            <th className="py-2 pr-4 font-semibold">กำหนดการ</th>
                            {campus.subColumns?.map((column) => (
                                <th key={column} className="py-2 pr-4 font-semibold whitespace-nowrap">
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/10">
                        {campus.events.map((event) => (
                            <tr key={event.label + event.values.join("|")}>
                                <td className="py-3 pr-4 align-top font-medium text-foreground">
                                    {event.label}
                                </td>
                                {event.values.map((value, index) => (
                                    <td key={index} className="py-3 pr-4 align-top text-foreground/80">
                                        {event.url ? (
                                            <a
                                                href={event.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 font-medium text-(--ku-color) hover:underline"
                                            >
                                                {value}
                                                <ArrowUpRight className="size-3.5" />
                                            </a>
                                        ) : (
                                            value
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default function CalendarTabs({ rounds }: { rounds: CalendarRound[] }) {
    const visibleRounds = rounds.filter((round) => CALENDAR_ROUND_VISIBILITY[round.id] ?? true)

    if (visibleRounds.length === 0) return null

    return (
        <Tabs defaultValue={visibleRounds[0].id} className="w-full gap-0">
            <TabsList
                className="grid h-auto! w-full! rounded-b-none p-0 shadow-none"
                style={{ gridTemplateColumns: `repeat(${visibleRounds.length}, minmax(0, 1fr))` }}
            >
                {visibleRounds.map((round) => (
                    <TabsTrigger
                        key={round.id}
                        value={round.id}
                        className="h-auto! min-h-10 w-full rounded-b-none px-2 text-center text-base font-semibold leading-tight whitespace-normal sm:px-3"
                    >
                        {round.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {visibleRounds.map((round) => (
                <TabsContent key={round.id} value={round.id}>
                    <Card className="rounded-t-none p-0 ring-0">
                        <p className="px-4 pt-3 text-sm text-muted-foreground">
                            {round.label}
                        </p>
                        {round.campuses.map((campus) => (
                            <CampusTable key={campus.name} campus={campus} />
                        ))}
                    </Card>
                </TabsContent>
            ))}
        </Tabs>
    )
}
