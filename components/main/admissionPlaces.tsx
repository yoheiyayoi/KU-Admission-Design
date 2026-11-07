import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '../ui/button'

const Places = [
    {
        name: "วิทยาเขตบางเขน",
        image: "https://admission.ku.ac.th/static/img/ku-campus-bkn.png",
        link: "https://admission.ku.ac.th/kuadm/",
    },
    {
        name: "วิทยาเขตกำแพงแสน",
        image: "https://admission.ku.ac.th/static/img/ku-campus-kps.png",
        link: "https://admission.kps.ku.ac.th/kpsadm/",
    },
    {
        name: "วิทยาเขตศรีราชา",
        image: "https://admission.ku.ac.th/static/img/ku-campus-src.png",
        link: "https://admissions.src.ku.ac.th/",
    },
    {
        name: "วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร",
        image: "https://admission.ku.ac.th/static/img/ku-campus-csc.png",
        link: "https://misreg.csc.ku.ac.th/admission/",
    },
    {
        name: "สำนักงานเขตบริหารการเรียนรู้ พื้นที่สุพรรณบุรี",
        image: "https://admission.ku.ac.th/static/img/ku-campus-sb.png",
        link: "https://admission.ku.ac.th/kuadm/",
    },
]

export default function AdmissionPlaces() {
    return (
        <div className="w-full">
            <h1 className="font-heading text-2xl font-semibold mb-2 sm:text-3xl">ระบบรับสมัครแยกตามวิทยาเขต</h1>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {Places.map((place) => (
                    <a
                        key={place.name}
                        href={place.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`เว็บไซต์การรับสมัคร ${place.name}`}
                        className="group relative w-full h-45 overflow-hidden rounded-xl bg-muted transition-all hover:-translate-y-0.5 hover:ring-(--ku-color)/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ku-color)/60"
                    >
                        <img
                            src={place.image}
                            alt={place.name}
                            loading="lazy"
                            className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* สคริมไล่สีด้านล่างเพื่อให้ชื่อวิทยาเขตอ่านได้ชัดบนภาพ */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 via-55% to-transparent"
                        />

                        <div className="absolute inset-x-3 bottom-3">
                            <p className="mb-1 line-clamp-2 text-lg text-shadow leading-snug font-medium text-white">
                                {place.name}
                            </p>

                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                                ไปยังเว็บไซต์
                                <ArrowUpRight className="mr-2 h-4 w-4" />
                            </Button>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}
