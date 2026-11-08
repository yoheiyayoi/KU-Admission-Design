import React from 'react'

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

const images = [
    { url: "https://www.ku.ac.th/web-upload/202610/m_banner/23/img_08683c80abef2867a66d4ffef5b5aebd.jpg", alt: "Image 1" },
    { url: "openhouse.png", alt: "Image 2" },
]

export default function HomeCarousel() {
    return (
        // มีการใช้ AI ช่วยแก้ปัญหาขนาดภาพไม่เท่ากัน ให้สามารถแสดงผลได้สวยงาม
        <div className="w-full mx-auto">
            <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                    {images.map((image, index) => (
                        <CarouselItem key={index}>
                            <div className="h-28 md:h-90">
                                <img
                                    className="size-full object-fill"
                                    src={image.url}
                                    alt={image.alt}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" size="icon-lg" />
                <CarouselNext className="right-4" size="icon-lg" />
            </Carousel>
        </div>
    )
}
