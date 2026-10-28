"use client";

import type React from "react";

import { Analytics } from "@vercel/analytics/next";
import {
  Ballet,
  Cormorant_Garamond,
  EB_Garamond,
  Great_Vibes,
  Imperial_Script,
  Quicksand,
} from "next/font/google";
import { Suspense } from "react";

// <CHANGE> Configure Google Fonts with Vietnamese language support
const imperialScript = Imperial_Script({
  weight: "400",
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-imperial-script",
  display: "swap",
});

const quicksand = Quicksand({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-quicksand",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const ballet = Ballet({
  weight: ["400"],
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-ballet",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500"],
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-cormorant",
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-great-vibes",
  display: "swap",
});

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div
        className={`font-sans ${imperialScript.variable} ${quicksand.variable} ${ebGaramond.variable} ${ballet.variable} ${cormorant.variable} ${greatVibes.variable}`}
      >
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </div>
      <Analytics />
    </>
  );
}
