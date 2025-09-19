"use client";

import { Play, Pause } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export default function HamburgerMenu() {
  const src =
    "https://pub-b36625a09e404435935ae0e838f9c35d.r2.dev/Ai-Music/Roots%20of%20the%20Sun/1.Roots-of%3Dthe-Sun.mp3";

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.preload = "metadata";
      audio.addEventListener("ended", () => setIsPlaying(false));
    }
    return () => {
      const a = audioRef.current;
      if (a) a.pause();
    };
  }, [src]);

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (isPlaying) {
        a.pause();
        setIsPlaying(false);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("music-playing", { detail: { playing: false } }));
        }
      } else {
        await a.play();
        setIsPlaying(true);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("music-playing", { detail: { playing: true } }));
        }
      }
    } catch (e) {
      // ignore autoplay errors
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Transparent circular button with yellow border and embedded soundwave */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        className="relative inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#DAA520] bg-transparent text-[#3D6B1F] hover:bg-white/10 active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-[#DAA520]/60 backdrop-blur-sm"
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        {/* Tiny flame effect (left side) */}
        <span className="absolute left-2 bottom-2">
          <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg"
            className={isPlaying ? "animate-[flicker_1.3s_ease-in-out_infinite]" : "opacity-60"}>
            <path d="M5 0C5.8 1.8 7.8 3.2 7.8 5.5C7.8 7.2 6.6 8.6 5 9.2C3.4 8.6 2.2 7.2 2.2 5.5C2.2 4 3.1 2.7 4.1 1.8C4.5 1.4 4.8 1.1 5 0Z" fill="#FF7A00"/>
            <path d="M5 4.5C5.5 5.6 6.5 6.4 6.5 7.5C6.5 8.4 5.9 9.1 5 9.4C4.1 9.1 3.5 8.4 3.5 7.5C3.5 6.7 4.1 6 4.6 5.5C4.8 5.3 4.9 5.1 5 4.5Z" fill="#FFD36E"/>
          </svg>
        </span>
        {/* Embedded mini soundwave inside the circle */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-end gap-[1px]">
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              className="w-[3px] bg-white rounded"
              style={{
                opacity: isPlaying ? 1 : 0.7,
                height: `${10 + ((i * 7) % 18)}px`,
                animation: isPlaying ? `pulse${i % 3} 0.95s ease-in-out ${(i % 7) * 0.05}s infinite` : "none",
              }}
            />
          ))}
        </span>
      </button>

      <style jsx>{`
        @keyframes pulse0 { 0%, 100% { transform: scaleY(0.6); } 50% { transform: scaleY(1.15); } }
        @keyframes pulse1 { 0%, 100% { transform: scaleY(0.7); } 50% { transform: scaleY(1.25); } }
        @keyframes pulse2 { 0%, 100% { transform: scaleY(0.65); } 50% { transform: scaleY(1.2); } }
        @keyframes flicker {
          0%, 100% { transform: translateY(0) scale(1); opacity: .9; filter: drop-shadow(0 0 2px rgba(255,122,0,.5)); }
          50% { transform: translateY(-1px) scale(1.05); opacity: 1; filter: drop-shadow(0 0 4px rgba(255,189,74,.8)); }
        }
      `}</style>
    </div>
  );
}
