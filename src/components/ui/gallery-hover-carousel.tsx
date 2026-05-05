"use client"

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"
import Image from "next/image"
import Link from "next/link"

interface GalleryHoverCarouselItem {
  id: string
  title: string
  summary: string
  url: string
  image: string
}

const defaultItems: GalleryHoverCarouselItem[] = [
  {
    id: "item-1",
    title: "Gelir Takibi",
    summary: "Tüm gelir kaynaklarınızı tek ekranda görün. Maaş, serbest çalışma, yatırım — hepsi burada.",
    url: "#",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
  },
  {
    id: "item-2",
    title: "Bütçe Planlaması",
    summary: "Aylık bütçenizi akıllıca planlayın. Harcama limitleri belirleyin, hedeflerinize ulaşın.",
    url: "#",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
  },
  {
    id: "item-3",
    title: "Tasarruf Analizi",
    summary: "Birikimlerinizin büyümesini izleyin. Otomatik analizlerle tasarruf potansiyelinizi keşfedin.",
    url: "#",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    id: "item-4",
    title: "Harcama Kontrolü",
    summary: "Gereksiz harcamaları tespit edin. Kategori bazlı raporlarla finansal disiplininizi artırın.",
    url: "#",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
  },
  {
    id: "item-5",
    title: "Finansal Hedefler",
    summary: "Hayallerinizi hedeflere dönüştürün. İlerlemenizi takip edin, motivasyonunuzu koruyun.",
    url: "#",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
]

export default function GalleryHoverCarousel({
  heading = "Sermayenizi Yönetin",
  items = defaultItems,
}: {
  heading?: string
  demoUrl?: string
  items?: GalleryHoverCarouselItem[]
}) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!carouselApi) return
    const update = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
    }
    update()
    carouselApi.on("select", update)
    return () => {
      carouselApi.off("select", update)
    }
  }, [carouselApi])

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 flex flex-col justify-between md:mb-12 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-semibold text-[var(--c-text)] leading-snug">
              {heading}{" "}
              <span className="text-[var(--c-muted)] text-lg sm:text-xl font-normal">
                Gelir, gider ve birikimlerinizi tek panelde takip edin.
              </span>
            </h3>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="h-10 w-10 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="h-10 w-10 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="w-full">
          <Carousel
            setApi={setCarouselApi}
            opts={{ breakpoints: { "(max-width: 768px)": { dragFree: true } } }}
            className="relative w-full"
          >
            <CarouselContent className="w-full md:ml-4">
              {items.map((item) => (
                <CarouselItem key={item.id} className="ml-4 w-[280px] md:w-[350px]">
                  <Link href={item.url} className="group block relative w-full h-[300px] md:h-[350px]">
                    <Card className="overflow-hidden rounded-2xl h-full w-full border-[var(--c-border)]">
                      <div className="relative h-full w-full transition-all duration-500 group-hover:h-1/2">
                        <Image
                          width={400}
                          height={300}
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover object-center"
                        />
                        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      <div className="absolute bottom-0 left-0 w-full px-4 py-3 transition-all duration-500 group-hover:h-1/2 group-hover:flex flex-col justify-center bg-[var(--c-modal)] opacity-0 group-hover:opacity-100">
                        <h3 className="text-base font-semibold text-[var(--c-text)]">{item.title}</h3>
                        <p className="text-[var(--c-muted)] text-sm line-clamp-2 mt-1">{item.summary}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute bottom-3 right-3 rounded-full hover:-rotate-45 transition-all duration-300"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  )
}
