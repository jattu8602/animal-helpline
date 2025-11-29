import { PhotoUpload } from "@/components/photo-upload"
import { HeroSection } from "@/components/hero-section"
import { ReportForm } from "@/components/report-form"
import { ShelterList } from "@/components/shelter-list"


export default function HomePage() {
  return (
     <>
    <main className="min-h-screen">
      <PhotoUpload />
      <HeroSection />
      <ReportForm />
      <ShelterList />
    </main>
   </>
  )
}
