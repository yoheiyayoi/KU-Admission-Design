"use client"

import React from 'react'

import { Card } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"
import { cn } from "cn"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

// มีการใช้ AI ช่วยทำ MOCK DATA
// AI ดึงข้อมูลและลิงก์ PDF จากเว็บไซต์ https://admission.ku.ac.th/

type Announcement = {
    title: string
    fileUrl: string
}

const round1Announcements: Announcement[] = [
    {
        title: "กำหนดการจัดกิจกรรม KU Open House 2026",
        fileUrl: "https://admission.ku.ac.th/media/announcements/2026/11/07/PR_openhouse_ig_ratio.png",
    },
    {
        title: "ประกาศรับสมัคร โครงการช้างเผือก (รอบที่ 1.1)",
        fileUrl: "https://admission.ku.ac.th/media/announcements/2026/10/07/70_TCAS1_White_Elephant_1.1.pdf",
    },
    {
        title: "ประกาศรับสมัคร โครงการช้างเผือก (รอบที่ 1.2)",
        fileUrl: "https://admission.ku.ac.th/media/announcements/2026/10/01/70_TCAS1_White_Elephant_1.2.pdf",
    },
    {
        title: "ประกาศรับสมัคร โครงการโอลิมปิกวิชาการ (รอบที่ 1.1)",
        fileUrl: "https://admission.ku.ac.th/media/announcements/2026/09/14/70_TCAS1_Oiympics_1.1.pdf",
    },
    {
        title: "ประกาศรับสมัคร โครงการโอลิมปิกวิชาการ (รอบที่ 1.2)",
        fileUrl: "https://admission.ku.ac.th/media/announcements/2026/10/01/70_TCAS1_Oiympics_1.2.pdf",
    },
    {
        title: "ปฏิทินการรับสมัคร TCAS1.1",
        fileUrl: "https://admission.ku.ac.th/media/announcements/2026/09/15/70_TCAS1.1.pdf",
    },
]

const round2Announcements: Announcement[] = [
    {
        title: "ประกาศรับสมัคร โครงการเพชรนนทรี",
        fileUrl: "https://admission.ku.ac.th/media/announcements/2026/11/06/70-TCAS2-Diamond_Nontri.pdf",
    },
    {
        title: "ประกาศรับสมัคร โครงการลูกพระพิรุณ",
        fileUrl: "https://admission.ku.ac.th/media/announcements/2026/11/06/70-TCAS2-Pra_Pirun.pdf",
    },
    {
        title: "ประกาศรับสมัคร โครงการส่งเสริมโอกาสศึกษาต่อสำหรับนักเรียนจบมัธยมศึกษาตอนปลายใน 6 จังหวัดชายฝั่งทะเลอันดามัน",
        fileUrl: "https://admission.ku.ac.th/media/announcements/2026/11/06/70-TCAS2-Province_6.pdf",
    },
    {
        title: "ประกาศรับสมัคร โครงการส่งเสริมโอกาสศึกษาต่อในมหาวิทยาลัยเกษตรศาสตร์ สำหรับนักเรียนจบมัธยมศึกษาตอนปลายจากโรงเรียนมัธยมศึกษาในท้องถิ่น (โควตา 30 จังหวัด)",
        fileUrl: "https://admission.ku.ac.th/media/announcements/2026/11/06/70-TCAS2-Province_30.pdf",
    },
    {
        title: "ปฏิทินการรับสมัคร KUTCAS70",
        fileUrl: "https://admission.ku.ac.th/media/announcements/2026/09/12/70_TCAS.pdf",
    },
]

// AI เจนตรงนี้มาให้ แต่มีการแก้ไขเองเพราะ AI ทำมาไม่สวย
function AnnouncementRow({ announcement }: { announcement: Announcement }) {
    return (
        <li>
            <a
                href={announcement.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`เปิดเอกสาร ${announcement.title}`}
                className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-gray-50"
            >
                <span className="min-w-0 text-base leading-relaxed text-card-foreground transition-colors group-hover:text-(--ku-color)">
                    {announcement.title}
                </span>

                <span className="flex shrink-0 items-center gap-1.5 transition-colors group-hover:text-(--ku-color)">
                    เปิด
                    <ArrowUpRight className="size-4 mt-0.5" />
                </span>
            </a>
        </li>
    )
}

export default function News() {
    return (
        <div className="w-full">
            <h1 className="font-heading text-2xl font-semibold mb-2 sm:text-3xl">ข่าวสารการสมัคร</h1>

            <Tabs
                defaultValue="round1"
                className="w-full gap-0"
            >
                <TabsList className="rounded-b-none shadow-none p-0 h-9!">
                    <TabsTrigger value="round1" className="rounded-b-none px-6 text-md">รอบที่ 1</TabsTrigger>
                    <TabsTrigger value="round2" className="rounded-b-none px-6 text-md">รอบที่ 2</TabsTrigger>
                </TabsList>

                <TabsContent value="round1">
                    <Card className="rounded-t-none p-0 ring-0">
                        <ul className="divide-y">
                            {round1Announcements.map((announcement) => (
                                <AnnouncementRow key={announcement.fileUrl} announcement={announcement} />
                            ))}
                        </ul>
                    </Card>
                </TabsContent>

                <TabsContent value="round2">
                    <Card className="rounded-t-none p-0 ring-0">
                        <ul className="divide-y">
                            {round2Announcements.map((announcement) => (
                                <AnnouncementRow key={announcement.fileUrl} announcement={announcement} />
                            ))}
                        </ul>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
