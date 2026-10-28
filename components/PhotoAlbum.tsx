"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useScrollEffects } from "@/hooks/use-scroll-effects";

type PhotoItem =
  | string
  | {
      src: string;
      className?: string;
      style?: React.CSSProperties;
      alt?: string;
    };

interface PhotoAlbumProps {
  photos: PhotoItem[];
  // Seconds each photo takes to scroll past; higher is slower
  secondsPerPhoto?: number;
}

const resolvePhoto = (item: PhotoItem) =>
  typeof item === "string"
    ? { src: item, className: "", style: undefined, alt: undefined }
    : { className: "", ...item };

function MarqueeRow({
  photos,
  offset,
  reverse,
  duration,
  onOpen,
}: {
  photos: ReturnType<typeof resolvePhoto>[];
  offset: number;
  reverse?: boolean;
  duration: number;
  onOpen: (index: number) => void;
}) {
  // Rotate the order so the two rows don't show the same photos side by side
  const row = photos.map((_, i) => (i + offset) % photos.length);

  return (
    <div className="marquee group">
      <div
        className={`marquee-track ${reverse ? "marquee-reverse" : ""}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {[...row, ...row].map((photoIndex, i) => {
          const photo = photos[photoIndex];
          return (
            <button
              key={i}
              type="button"
              onClick={() => onOpen(photoIndex)}
              aria-hidden={i >= row.length}
              tabIndex={i >= row.length ? -1 : 0}
              className="album-card"
              style={{ rotate: `${i % 2 === 0 ? -2 : 2}deg` }}
            >
              <img
                src={photo.src}
                alt={photo.alt ?? `Khoảnh khắc ${photoIndex + 1}`}
                loading="lazy"
                className={`w-full h-full object-cover ${photo.className}`}
                style={photo.style}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PhotoAlbum({ photos, secondsPerPhoto = 7 }: PhotoAlbumProps) {
  const albumSection = useScrollEffects({ threshold: 0.1 });
  const resolved = photos.map(resolvePhoto);
  const [active, setActive] = useState<number | null>(null);

  const step = useCallback(
    (dir: number) =>
      setActive((prev) => (prev === null ? prev : (prev + dir + resolved.length) % resolved.length)),
    [resolved.length]
  );

  useEffect(() => {
    if (active === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
      else if (event.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, step]);

  const duration = resolved.length * secondsPerPhoto;

  return (
    <section ref={albumSection.elementRef} className="paper-bg py-20 overflow-hidden">
      <div
        className={`text-center mb-12 px-6 transition-all duration-1000 ${
          albumSection.isVisible ? "animate-fadeInUp opacity-100" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="font-great-vibes text-5xl md:text-6xl text-[#7a2a2a]">Album hình cưới</h2>
        <p className="mt-3 font-quicksand text-sm text-[#9a5a5a]">Chạm vào ảnh để xem lớn hơn</p>
      </div>

      <div
        className={`space-y-6 sm:space-y-8 transition-opacity duration-1000 ${
          albumSection.isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <MarqueeRow photos={resolved} offset={0} duration={duration} onOpen={setActive} />
        <MarqueeRow
          photos={resolved}
          offset={Math.ceil(resolved.length / 2)}
          reverse
          duration={duration * 1.15}
          onOpen={setActive}
        />
      </div>

      {/* Lightbox */}
      {active !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/85 flex items-center justify-center animate-fadeSwap"
          onClick={() => setActive(null)}
        >
          <img
            key={active}
            src={resolved[active].src}
            alt={resolved[active].alt ?? "Ảnh cưới"}
            className="max-h-[88vh] max-w-[92vw] object-contain rounded-xl shadow-2xl animate-fadeSwap"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/15 text-white hover:bg-white/25"
            aria-label="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-3 sm:left-6 p-3 rounded-full bg-white/15 text-white hover:bg-white/25"
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-3 sm:right-6 p-3 rounded-full bg-white/15 text-white hover:bg-white/25"
            aria-label="Ảnh sau"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
}
