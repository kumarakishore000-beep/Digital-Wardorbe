'use client';

import React from 'react';

interface AuraStyleLogoProps {
  variant?: 'mark' | 'full' | 'showcase';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  showTagline?: boolean;
}

export default function AuraStyleLogo({
  variant = 'mark',
  size = 'md',
  className = '',
  showTagline = true,
}: AuraStyleLogoProps) {
  // Size mapping
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    hero: 'w-36 h-36',
  };

  // If mark only
  if (variant === 'mark') {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          {/* Subtle Outer Ring */}
          <rect
            x="2"
            y="2"
            width="96"
            height="96"
            rx="24"
            className="fill-[#0f254e]/80 stroke-[#FAF8F5]/20"
            strokeWidth="1.5"
          />

          {/* Central Vertical Dividing Line */}
          <line
            x1="50"
            y1="14"
            x2="50"
            y2="86"
            stroke="#38BDF8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Botanical Floral Artwork crossing vertical line */}
          {/* Top Left Rose Blossom & Leaves */}
          <g stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Top Stem */}
            <path d="M50 36 C44 32 38 28 34 22 C30 16 35 14 38 18 C40 21 44 26 50 30" />
            {/* Top Rose Petals */}
            <path d="M32 18 C28 14 34 8 40 10 C46 12 48 18 42 22 C36 26 30 22 32 18 Z" fill="#38BDF8" fillOpacity="0.15" />
            <path d="M35 14 C33 11 37 9 40 11 C43 13 41 17 38 16" />
            <circle cx="37" cy="14" r="1.5" fill="#38BDF8" />
            {/* Top Leaves */}
            <path d="M26 24 C28 20 34 22 36 25 C32 28 27 28 26 24 Z" fill="#38BDF8" fillOpacity="0.2" />
            <path d="M42 26 C46 24 49 27 48 30 C45 31 42 29 42 26 Z" fill="#38BDF8" fillOpacity="0.2" />
            <path d="M28 24 L34 25" />
            <path d="M44 27 L47 29" />
          </g>

          {/* Bottom Right Rose Blossom & Leaves */}
          <g stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Bottom Stem */}
            <path d="M50 64 C56 68 62 72 66 78 C70 84 65 86 62 82 C60 79 56 74 50 70" />
            {/* Bottom Rose Petals */}
            <path d="M68 82 C72 86 66 92 60 90 C54 88 52 82 58 78 C64 74 70 78 68 82 Z" fill="#38BDF8" fillOpacity="0.15" />
            <path d="M65 86 C67 89 63 91 60 89 C57 87 59 83 62 84" />
            <circle cx="63" cy="86" r="1.5" fill="#38BDF8" />
            {/* Bottom Leaves */}
            <path d="M74 76 C72 80 66 78 64 75 C68 72 73 72 74 76 Z" fill="#38BDF8" fillOpacity="0.2" />
            <path d="M58 74 C54 76 51 73 52 70 C55 69 58 71 58 74 Z" fill="#38BDF8" fillOpacity="0.2" />
            <path d="M72 76 L66 75" />
            <path d="M56 73 L53 71" />
          </g>

          {/* Top Right "S" (Double-line / Inline Ivory Aesthetic) */}
          <g stroke="#FAF8F5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Outer S */}
            <path d="M74 20 C70 14 58 14 56 22 C54 30 74 28 72 38 C70 46 58 46 54 40" />
            {/* Inner S */}
            <path
              d="M71 22 C68 18 60 18 58 23 C57 28 71 27 70 36 C69 42 60 42 57 38"
              strokeWidth="1.2"
              stroke="#FAF8F5"
            />
          </g>

          {/* Bottom Left "A" (Double-line / Inline Ivory Arch Aesthetic) */}
          <g stroke="#FAF8F5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Outer Arch A */}
            <path d="M26 80 L26 52 C26 42 44 42 44 52 L44 80" />
            {/* Crossbar & Inner loop */}
            <path d="M26 68 L44 68" />
            <path d="M31 80 L31 53 C31 46 39 46 39 53 L39 80" strokeWidth="1.2" />
            <path d="M31 68 L44 60" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    );
  }

  // Full Horizontal Lockup (Emblem + Wordmark + Tagline)
  if (variant === 'full') {
    return (
      <div className={`inline-flex items-center gap-3.5 ${className}`}>
        {/* Emblem */}
        <div className="w-11 h-11 shrink-0">
          <AuraStyleLogo variant="mark" size="md" />
        </div>

        {/* Wordmark & Tagline */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center tracking-tight">
            <span className="font-serif font-black text-xl sm:text-2xl text-[#FAF8F5] tracking-wider uppercase drop-shadow-sm">
              AURASTYLE <span className="text-[#38BDF8] font-sans font-bold text-sm tracking-widest pl-0.5">AI</span>
            </span>
          </div>
          {showTagline && (
            <p className="font-serif italic text-[11px] text-[#93c5fd] tracking-wide -mt-0.5 font-light">
              Dressed for your moments
            </p>
          )}
        </div>
      </div>
    );
  }

  // Showcase Mode: Full Logo with All 5 Lineart Fashion Elements from the Image
  return (
    <div className={`relative max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-[#0a192f] border border-[#FAF8F5]/15 shadow-2xl overflow-hidden text-center select-none ${className}`}>
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1e3a8a]/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container Grid with 5 Fashion Floating Icons */}
      <div className="relative z-10 grid grid-cols-12 gap-4 items-center">
        {/* Top-Left: Mannequin Stand */}
        <div className="col-span-3 flex justify-center transform -translate-y-4 hover:scale-110 transition-transform">
          <svg className="w-12 h-20 text-[#38BDF8]" viewBox="0 0 40 70" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Hanger loop */}
            <circle cx="20" cy="8" r="3" />
            {/* Mannequin Torso with Draped Gown */}
            <path d="M14 15 C17 14 23 14 26 15 C28 22 27 28 20 32 C13 28 12 22 14 15 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M14 32 C10 40 12 50 16 54 C18 48 20 44 20 32 C20 44 22 48 24 54 C28 50 30 40 26 32" fill="currentColor" fillOpacity="0.4" />
            {/* Stand Base */}
            <line x1="20" y1="54" x2="20" y2="66" strokeWidth="2.2" />
            <line x1="12" y1="66" x2="28" y2="66" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Center: The AS Floral Monogram */}
        <div className="col-span-6 flex flex-col items-center justify-center space-y-4">
          <div className="w-32 h-32 sm:w-40 sm:h-40">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
              {/* Central Dividing Line */}
              <line x1="50" y1="8" x2="50" y2="92" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />

              {/* Botanical Floral Artwork crossing vertical line */}
              <g stroke="#38BDF8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
                {/* Top Rose Blossom */}
                <path d="M50 38 C42 33 36 28 32 20 C28 12 34 10 38 15 C40 19 44 26 50 32" />
                <path d="M30 15 C25 10 33 4 40 7 C47 9 49 16 43 21 C36 26 29 21 30 15 Z" fill="#38BDF8" fillOpacity="0.2" />
                <path d="M34 11 C32 8 36 6 39 8 C42 10 40 14 37 13" />
                <circle cx="36" cy="11" r="1.5" fill="#38BDF8" />
                {/* Top Leaves */}
                <path d="M23 23 C25 18 32 20 34 24 C30 28 24 28 23 23 Z" fill="#38BDF8" fillOpacity="0.25" />
                <path d="M42 27 C47 24 50 28 49 32 C45 33 42 30 42 27 Z" fill="#38BDF8" fillOpacity="0.25" />
              </g>

              {/* Bottom Rose Blossom */}
              <g stroke="#38BDF8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M50 62 C58 67 64 72 68 80 C72 88 66 90 62 85 C60 81 56 74 50 68" />
                <path d="M70 85 C75 90 67 96 60 93 C53 91 51 84 57 79 C64 74 71 79 70 85 Z" fill="#38BDF8" fillOpacity="0.2" />
                <path d="M66 89 C68 92 64 94 61 92 C58 90 60 86 63 87" />
                <circle cx="64" cy="89" r="1.5" fill="#38BDF8" />
                {/* Bottom Leaves */}
                <path d="M77 77 C75 82 68 80 66 76 C70 72 76 72 77 77 Z" fill="#38BDF8" fillOpacity="0.25" />
                <path d="M58 73 C53 76 50 72 51 68 C55 67 58 70 58 73 Z" fill="#38BDF8" fillOpacity="0.25" />
              </g>

              {/* Top Right "S" (Double-line Ivory) */}
              <g stroke="#FAF8F5" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M76 18 C71 11 57 11 55 21 C53 31 77 29 74 41 C71 50 57 50 52 43" />
                <path d="M72 20 C68 15 59 15 57 22 C55 29 73 28 71 39 C69 46 59 46 55 41" strokeWidth="1.4" />
              </g>

              {/* Bottom Left "A" (Double-line Ivory) */}
              <g stroke="#FAF8F5" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M24 82 L24 50 C24 38 46 38 46 50 L46 82" />
                <path d="M24 69 L46 69" />
                <path d="M30 82 L30 51 C30 43 40 43 40 51 L40 82" strokeWidth="1.4" />
                <path d="M30 69 L46 59" strokeWidth="1.4" />
              </g>
            </svg>
          </div>
        </div>

        {/* Top-Right: Cocktail Dress & Stiletto */}
        <div className="col-span-3 flex justify-center transform -translate-y-4 hover:scale-110 transition-transform">
          <svg className="w-14 h-18 text-[#38BDF8]" viewBox="0 0 50 60" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Strapless Dress */}
            <path d="M28 8 C30 14 36 14 38 8 C40 18 38 24 44 42 C38 43 30 43 24 42 C28 24 26 18 28 8 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M28 20 L38 20" />
            {/* High Heel Stiletto */}
            <path d="M8 38 C14 38 18 36 20 28 L22 30 C19 39 15 42 7 42 L6 38 Z" fill="currentColor" fillOpacity="0.3" />
            <line x1="20" y1="28" x2="20" y2="44" strokeWidth="2" />
          </svg>
        </div>

        {/* Bottom-Left: Short-Sleeve Botanical Shirt */}
        <div className="col-span-3 flex justify-center transform translate-y-4 hover:scale-110 transition-transform">
          <svg className="w-16 h-16 text-[#38BDF8]" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Shirt Outline */}
            <path d="M18 10 L26 16 L34 16 L42 10 L50 20 L44 26 L40 22 L40 50 L20 50 L20 22 L16 26 L10 20 Z" fill="currentColor" fillOpacity="0.2" />
            {/* Collar & Placket */}
            <path d="M26 16 L30 26 L34 16" />
            <line x1="30" y1="26" x2="30" y2="50" />
            {/* Botanical Leaf Prints */}
            <path d="M24 32 C26 28 32 30 31 36 C27 37 24 35 24 32 Z" fill="currentColor" fillOpacity="0.4" />
            <path d="M33 40 C35 36 40 38 39 44 C35 45 33 43 33 40 Z" fill="currentColor" fillOpacity="0.4" />
          </svg>
        </div>

        {/* Center Bottom: AURASTYLE AI Wordmark & Tagline */}
        <div className="col-span-6 flex flex-col items-center space-y-1.5 pt-4">
          <h2 className="font-serif font-black text-2xl sm:text-4xl text-[#FAF8F5] tracking-widest uppercase drop-shadow-md">
            AURASTYLE AI
          </h2>
          <p className="font-serif italic text-sm sm:text-base text-[#93c5fd] font-normal tracking-wider">
            Dressed for your moments
          </p>
        </div>

        {/* Bottom-Right: Luxury Watch & Patterned Bangles */}
        <div className="col-span-3 flex flex-col items-center gap-3 transform translate-y-4 hover:scale-110 transition-transform">
          {/* Watch */}
          <svg className="w-10 h-10 text-[#38BDF8]" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="24" cy="20" r="10" fill="currentColor" fillOpacity="0.2" />
            <rect x="21" y="4" width="6" height="6" rx="1" />
            <rect x="21" y="30" width="6" height="6" rx="1" />
            <line x1="24" y1="20" x2="24" y2="15" />
            <line x1="24" y1="20" x2="28" y2="20" />
            {/* Sparkle particles */}
            <path d="M10 18 L12 20 L10 22 L8 20 Z" fill="currentColor" />
          </svg>
          {/* Bangle bracelets */}
          <svg className="w-12 h-8 text-[#38BDF8]" viewBox="0 0 50 30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="25" cy="12" rx="20" ry="8" fill="currentColor" fillOpacity="0.15" />
            <ellipse cx="25" cy="18" rx="20" ry="8" fill="currentColor" fillOpacity="0.25" />
            {/* Diamond pattern */}
            <path d="M22 18 L25 15 L28 18 L25 21 Z" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
}
