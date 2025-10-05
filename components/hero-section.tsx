"use client"

import { Button } from "@/components/ui/button"
import { Heart, Phone, MapPin } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  const scrollToReport = () => {
    document.getElementById("report-form")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-accent/30 to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Heart className="h-4 w-4" />
            <span>24/7 Animal Emergency Support</span>
          </div>

          <h1 className="mb-6 text-balance font-sans text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Help Animals in Need Find Safety
          </h1>

          <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl lg:text-2xl">
            Connect injured or distressed animals with nearby shelters and foster care. Every second counts when an
            animal needs help.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
              onClick={scrollToReport}
            >
              <Phone className="mr-2 h-5 w-5" />
              Report an Animal
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent" asChild>
              <a href="#shelters">
                <MapPin className="mr-2 h-5 w-5" />
                Find Nearby Shelters
              </a>
            </Button>
          </div>
        </div>

        {/* Added animal images grid below hero content */}
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image src="/happy-rescued-dog-smiling.jpg" alt="Rescued dog" fill className="object-cover" />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image src="/cute-rescued-cat-being-petted.jpg" alt="Rescued cat" fill className="object-cover" />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image src="/rescued-bird-in-rehabilitation.jpg" alt="Rescued bird" fill className="object-cover" />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image src="/rescued-puppy-being-cared-for.jpg" alt="Rescued puppy" fill className="object-cover" />
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-card p-6 text-center shadow-sm">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-card-foreground">Quick Response</h3>
            <p className="text-sm text-muted-foreground">Instant connection to nearby shelters and ready to help</p>
          </div>

          <div className="rounded-xl bg-card p-6 text-center shadow-sm">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
              <MapPin className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="mb-2 font-semibold text-card-foreground">Local Network</h3>
            <p className="text-sm text-muted-foreground">Access to verified shelters in your area</p>
          </div>

          <div className="rounded-xl bg-card p-6 text-center shadow-sm">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/50">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-card-foreground">Compassionate Care</h3>
            <p className="text-sm text-muted-foreground">Professional support for every animal</p>
          </div>
        </div>
      </div>
    </section>
  )
}
