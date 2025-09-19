"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

type AudioPlayerProps = {
  src: string;
  title?: string;
  position?: "bottom" | "top-right";
  layout?: "horizontal" | "vertical";
  variant?: "standard" | "navbar";
  strategy?: "fixed" | "absolute"; // positioning strategy
  offsetClassName?: string; // optional extra classes for fine offsets
};

export default function AudioPlayer({ src, title = "Background Music", position = "bottom", layout = "horizontal", variant = "standard", strategy = "fixed", offsetClassName = "" }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Create audio element lazily to avoid SSR issues
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.preload = "metadata";
      audio.addEventListener("timeupdate", () => {
        if (!audio.duration) return;
        setProgress(audio.currentTime);
      });
      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration || 0);
      });
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setProgress(0);
      });
    }
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
      }
    };
  }, [src]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (e) {
      // Autoplay restrictions or other errors
      console.warn("Audio play failed:", e);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setProgress(newTime);
  };

  const formatted = (t: number) => {
    const m = Math.floor(t / 60)
      .toString()
      .padStart(1, "0");
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const basePos = strategy === "fixed" ? "fixed z-50" : "absolute z-40";
  const baseBox = `${basePos} bg-[#F8F4E6]/95 backdrop-blur shadow-lg border border-amber-700/10`;
  const containerClass = (() => {
    if (variant === "navbar") {
      // Slim vertical bar
      return [
        baseBox,
        position === "top-right" ? "top-2 right-2 md:top-4 md:right-4" : "bottom-4 right-4",
        "rounded-2xl px-2 py-2 flex flex-col items-center gap-2 w-[72px] sm:w-[76px] md:w-[88px]",
        offsetClassName
      ].join(" ");
    }
    // Standard pill container
    return (
      position === "top-right"
        ? `${baseBox} top-3 right-3 rounded-full px-3 py-2 flex items-center gap-3 ${offsetClassName}`
        : `${baseBox} bottom-3 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 rounded-full px-3 py-2 flex items-center gap-3 ${offsetClassName}`
    );
  })();

  const vertical = layout === "vertical" || variant === "navbar";

  return (
    <div className={containerClass} role="region" aria-label="Audio player">
      <div className={vertical ? "flex flex-col items-center gap-2" : "flex items-center gap-3"}>
        <button
          onClick={togglePlay}
          className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#3D6B1F] text-white shadow hover:brightness-110 active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-[#DAA520]/70"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        {variant !== "navbar" && (
          <div className={vertical ? "hidden sm:flex flex-col items-center w-full" : "hidden sm:flex flex-col min-w-[140px] max-w-[220px]"}>
            <span className="text-xs font-semibold text-[#4A2C20] truncate max-w-[180px]">{title}</span>
            <div className={vertical ? "flex items-center gap-2 w-full justify-center" : "flex items-center gap-2"}>
              <input
                type="range"
                min={0}
                max={Math.max(1, duration)}
                step={0.1}
                value={progress}
                onChange={onSeek}
                className={vertical ? "w-[160px] accent-[#DAA520]" : "w-[140px] accent-[#DAA520]"}
                aria-label="Seek"
              />
              <span className="text-[10px] tabular-nums text-[#4A2C20]/80 w-10 text-right">{formatted(progress)}</span>
            </div>
          </div>
        )}

        <button
          onClick={toggleMute}
          className={variant === "navbar" ? "inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/80 text-[#4A2C20] hover:bg-white transition border border-amber-900/10 focus:outline-none focus:ring-2 focus:ring-[#DAA520]/60" : "hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/70 text-[#4A2C20] hover:bg-white transition border border-amber-900/10"}
          aria-label={muted ? "Unmute" : "Mute"}
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {variant === "navbar" && (
          <span
            className="mt-1 inline-block max-w-[64px] sm:max-w-[72px] md:max-w-[80px] truncate text-center bg-[#DAA520] text-[#2A1A0F] px-2 py-1 rounded-full text-[10px] sm:text-[11px] md:text-[12px] font-bold tracking-wide shadow-sm"
            title={title}
          >
            {title}
          </span>
        )}
      </div>
    </div>
  );
}
