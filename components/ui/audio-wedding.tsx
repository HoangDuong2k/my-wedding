"use client";

import { useEffect, useRef, useState } from "react";

const MusicIcon = (
  props: { width?: string; height?: string; className?: string } = {}
) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
      <path d="M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
      <path d="M9 17v-13h10v13" />
      <path d="M9 8h10" />
    </svg>
  );
};

const MusicTurnOffIcon = (
  props: { width?: string; height?: string; className?: string } = {}
) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M14.42 14.45a3 3 0 1 0 4.138 4.119" />
      <path d="M9 17v-8m0 -4v-1h10v11" />
      <path d="M12 8h7" />
      <path d="M3 3l18 18" />
    </svg>
  );
};

const AudioWedding = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [visible, setVisible] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleToggle = () => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (audioRef.current) {
        if (next) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      }
      return next;
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      console.log("Scroll Y:", {
        scrollY: window.scrollY,
        innerWidth: window.innerWidth,
      });
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        setVisible(true);
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) return;
        setIsPlaying(true);
        if (audioRef.current) {
          audioRef.current.play();
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 1000,
        background: "rgba(255,255,255,0.7)",
        borderRadius: "50%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        visibility: visible ? "visible" : "hidden",
      }}
      onClick={handleToggle}
      title={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
    >
      <span
        style={
          isPlaying
            ? {
                display: "inline-block",
                animation: "spin 2s linear infinite",
              }
            : { display: "inline-block" }
        }
      >
        {isPlaying ? (
          <MusicIcon className="text-[#474747]" />
        ) : (
          <MusicTurnOffIcon className="text-[#474747]" />
        )}
      </span>
      <audio
        ref={audioRef}
        src="audio-wedding.mp3"
        autoPlay
        loop
        style={{ display: "none" }}
      />
      <style>
        {`
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AudioWedding;
