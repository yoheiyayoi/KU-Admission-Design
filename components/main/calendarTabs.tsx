"use client"

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

function CampusTable({ campus }: { campus: CalendarRound["campuses"][number] }) {
    const hasSubColumns = campus.subColumns && campus.subColumns.length > 0

    return (
        <div className="px-4 py-4 border-b border-foreground/5 last:border-b-0">
            <h3 className="mb-2 text-base font-medium text-foreground">
                {campus.name}
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="text-left text-muted-foreground">
                            <th className="py-1.5 pr-3 font-medium">กำหนดการ</th>
                            {hasSubColumns
                                ? campus.subColumns.map((column) => (
                                      <th key={column} className="py-1.5 pr-3 font-medium whitespace-nowrap">
                                          {column}
                                      </th>
                                  ))
                                : null}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/10">
                        {campus.events.map((event) => (
                            <tr key={event.label + event.values.join("|")}>
                                <td className="py-2 pr-3 align-top text-foreground">
                                    {event.label}
                                </td>
                                {event.values.map((value, index) => (
                                    <td key={index} className="py-2 pr-3 align-top text-muted-foreground">
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
    return (
        <Tabs defaultValue={rounds[0]?.id ?? "round1"} className="w-full gap-0">
            <TabsList className="rounded-b-none shadow-none p-0 h-9!">
                {rounds.map((round) => (
                    <TabsTrigger key={round.id} value={round.id} className="rounded-b-none px-6 text-md">
                        {round.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {rounds.map((round) => (
                <TabsContent key={round.id} value={round.id}>
                    <Card className="rounded-t-none p-0 ring-0">
                        {round.campuses.map((campus) => (
                            <CampusTable key={campus.name} campus={campus} />
                        ))}
                    </Card>
                </TabsContent>
            ))}
        </Tabs>
    )
}
