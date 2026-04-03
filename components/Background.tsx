"use client"

import { useEffect, useState } from "react"
import { ImageCanvas } from "@/components/image-canvas"

export default function Background() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    const img = new Image()
    img.src = "/logo.png"
    img.onload = () => setImage(img)
  }, [])

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-30">
      <div className="w-full max-w-[560px] scale-110">
        {image ? (
          <ImageCanvas
            image={image}
            halftoneSize={8}
            contrast={1.15}
            accentColor="#00b4c8"
            mouseRadius={80}
            repulsionStrength={10}
            returnSpeed={0.18}
            accentProbability={0.08}
            sizeVariation={0.18}
          />
        ) : null}
      </div>
    </div>
  )
}
