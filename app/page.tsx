import AdmissionPlaces from "@/components/main/admissionPlaces"
import HomeCarousel from "@/components/main/homeImages"
import News from "@/components/main/news"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Page() {
  return (
    <div className="mx-auto">
      <HomeCarousel />

      <div className="px-4 pt-6 max-w-7xl mx-auto space-y-8">
        <News />
        <AdmissionPlaces />
      </div>
    </div>
  )
}
