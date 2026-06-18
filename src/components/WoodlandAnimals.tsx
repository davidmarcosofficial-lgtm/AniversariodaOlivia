import React from 'react';

export function CuteFox({ size = 100, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Tail (Fluffy with white tip) */}
      <path d="M50 68C62 70 77 65 74 52C71 39 54 50 50 68Z" fill="#F4A261" />
      <path d="M70 59C77 60 77 52 74 52C71 52 67 55 70 59Z" fill="#FFF2E6" />
      
      {/* Body */}
      <circle cx="50" cy="65" r="18" fill="#F4A261" />
      <circle cx="50" cy="65" r="13" fill="#FFF2E6" />
      
      {/* Ears */}
      <path d="M31 38L18 18L43 33Z" fill="#E76F51" />
      <path d="M33 36L22 21L40 32Z" fill="#E8B2A6" />
      <path d="M69 38L82 18L57 33Z" fill="#E76F51" />
      <path d="M67 36L78 21L60 32Z" fill="#E8B2A6" />
      
      {/* Fox head base - beautifully rounded-cheek fox face shape */}
      <path d="M30 45C28 36 40 32 50 32C60 32 72 36 70 45C70 56 62 60 50 62C38 60 30 56 30 45Z" fill="#F4A261" />
      
      {/* Fox white cheeks mask */}
      <path d="M30 45C31 54 40 59 50 59C60 59 69 54 70 45C70 41 64 42 58 46C54 49 46 49 42 46C36 42 30 41 30 45Z" fill="#FFF2E6" />
      
      {/* Eyes (super cute dots) */}
      <circle cx="42" cy="45" r="2.5" fill="#3D291F" />
      <circle cx="58" cy="45" r="2.5" fill="#3D291F" />
      
      {/* Nose */}
      <ellipse cx="50" cy="50" rx="3.5" ry="2" fill="#3D291F" />
      
      {/* Whiskers */}
      <path d="M32 49H25" stroke="#3D291F" strokeWidth="1" strokeLinecap="round" />
      <path d="M33 52H26" stroke="#3D291F" strokeWidth="1" strokeLinecap="round" />
      <path d="M68 49H75" stroke="#3D291F" strokeWidth="1" strokeLinecap="round" />
      <path d="M67 52H74" stroke="#3D291F" strokeWidth="1" strokeLinecap="round" />
      
      {/* Cute Blush Cheeks */}
      <circle cx="37" cy="49" r="3" fill="#E66C86" opacity="0.45" />
      <circle cx="63" cy="49" r="3" fill="#E66C86" opacity="0.45" />
    </svg>
  );
}

export function CuteBear({ size = 100, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Ears */}
      <circle cx="34" cy="28" r="10" fill="#9A7B66" />
      <circle cx="34" cy="28" r="5" fill="#E8B2A6" />
      <circle cx="66" cy="28" r="10" fill="#9A7B66" />
      <circle cx="66" cy="28" r="5" fill="#E8B2A6" />
      
      {/* Body */}
      <ellipse cx="50" cy="65" rx="22" ry="20" fill="#9A7B66" />
      <ellipse cx="50" cy="65" rx="14" ry="12" fill="#FFF2E6" />
      
      {/* Head */}
      <circle cx="50" cy="42" r="20" fill="#9A7B66" />
      
      {/* Snout */}
      <ellipse cx="50" cy="47" rx="7.5" ry="5.5" fill="#FFF2E6" />
      <ellipse cx="50" cy="45.5" rx="2.5" ry="1.5" fill="#3D291F" />
      {/* Smile */}
      <path d="M49 48.5C49.5 49.5 50.5 49.5 51 48.5" stroke="#3D291F" strokeWidth="1" strokeLinecap="round" />
      
      {/* Eyes */}
      <ellipse cx="43" cy="39" rx="2" ry="2.5" fill="#3D291F" />
      <ellipse cx="57" cy="39" rx="2" ry="2.5" fill="#3D291F" />
      
      {/* Cute blush cheeks */}
      <circle cx="38" cy="44" r="3" fill="#E66C86" opacity="0.45" />
      <circle cx="62" cy="44" r="3" fill="#E66C86" opacity="0.45" />
    </svg>
  );
}

export function CuteRabbit({ size = 100, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Long bendy Ears */}
      <path d="M38 32C35 20 33 8 38 8C43 8 42 20 40 32Z" fill="#FBF8F3" />
      <path d="M37 28C35 20 35 11 38 11C41 11 40 20 39 28Z" fill="#F3C6D1" />
      
      <path d="M62 32C65 20 67 8 62 8C57 8 58 20 60 32Z" fill="#FBF8F3" />
      <path d="M63 28C65 20 65 11 62 11C59 11 60 20 61 28Z" fill="#F3C6D1" />
      
      {/* Body */}
      <ellipse cx="50" cy="65" rx="18" ry="16" fill="#FBF8F3" />
      <ellipse cx="50" cy="65" rx="11" ry="10" fill="#FAF0E6" />
      <circle cx="34" cy="72" r="4.5" fill="#FBF8F3" />
      
      {/* Head */}
      <circle cx="50" cy="42" r="17" fill="#FBF8F3" />
      
      {/* Snout */}
      <ellipse cx="50" cy="45" rx="3" ry="1.5" fill="#F3C6D1" />
      <path d="M48 48C49 49 51 49 52 48" stroke="#3D291F" strokeWidth="1.2" strokeLinecap="round" />
      
      {/* Eyes */}
      <circle cx="43" cy="39" r="2.2" fill="#3D291F" />
      <circle cx="57" cy="39" r="2.2" fill="#3D291F" />
      
      {/* Cute cheeks */}
      <circle cx="39" cy="44" r="3.5" fill="#E66C86" opacity="0.45" />
      <circle cx="61" cy="44" r="3.5" fill="#E66C86" opacity="0.45" />
    </svg>
  );
}

export function CuteHedgehog({ size = 100, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Soft Spikes/Quills (Lots of overlapping spiky shapes) */}
      <path d="M30 45C20 30 15 50 25 65C15 65 20 80 35 75C35 85 55 85 65 75C75 80 85 68 75 58C85 45 68 30 55 35C45 28 35 35 30 45Z" fill="#7C604D" />
      {/* Highlight/contrast spikes */}
      <path d="M35 48C30 38 27 45 32 55 M50 38C45 33 40 38 43 45 M65 42C62 35 58 40 60 48 M72 52C75 48 70 44 65 46" stroke="#4A3B32" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Main Face/Body Area */}
      <path d="M35 48C32 52 35 72 50 72C65 72 68 55 68 48C68 40 60 42 50 42C40 42 38 40 35 48Z" fill="#F5E3D3" />
      
      {/* Eyes */}
      <circle cx="44" cy="52" r="2.2" fill="#3D291F" />
      <circle cx="56" cy="52" r="2.2" fill="#3D291F" />
      
      {/* Snout & Nose */}
      <ellipse cx="50" cy="59" rx="3.5" ry="2" fill="#3D291F" stroke="#F5E3D3" strokeWidth="0.5" />
      
      {/* Cute blush cheeks */}
      <circle cx="39" cy="56" r="2.5" fill="#E66C86" opacity="0.45" />
      <circle cx="61" cy="56" r="2.5" fill="#E66C86" opacity="0.45" />
    </svg>
  );
}

// Sparkle/Forest magic decoration
export function ForestLeafDecoration({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 2C12 2 15 6 12 10C9 14 12 22 12 22C12 22 8 18 10 12C12 6 12 2 12 2Z" fill="#607c6f" />
      <path d="M12 2C12 2 9 6 12 10C15 14 12 22 12 22C12 22 16 18 14 12C12 6 12 2 12 2Z" fill="#719385" opacity="0.7" />
    </svg>
  );
}

export function WoodlandAvatar({ type, size = 40, className = '' }: { type: string; size?: number; className?: string }) {
  switch (type) {
    case 'fox':
      return <CuteFox size={size} className={className} />;
    case 'bear':
      return <CuteBear size={size} className={className} />;
    case 'rabbit':
      return <CuteRabbit size={size} className={className} />;
    case 'hedgehog':
    default:
      return <CuteHedgehog size={size} className={className} />;
  }
}

interface HandDrawnProps {
  size?: number;
  className?: string;
  stroke?: string;
  fill?: string;
}

export function HandDrawnFlower({ size = 24, className = '', stroke, fill }: HandDrawnProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* 5 Petals with soft outlines */}
      <circle cx="12" cy="7" r="4.5" fill="#F4C2C2" stroke="#4A3B32" strokeWidth="1" />
      <circle cx="7" cy="11" r="4.5" fill="#F4C2C2" stroke="#4A3B32" strokeWidth="1" />
      <circle cx="17" cy="11" r="4.5" fill="#F4C2C2" stroke="#4A3B32" strokeWidth="1" />
      <circle cx="9" cy="17" r="4.5" fill="#F4C2C2" stroke="#4A3B32" strokeWidth="1" />
      <circle cx="15" cy="17" r="4.5" fill="#F4C2C2" stroke="#4A3B32" strokeWidth="1" />
      {/* Center of the flower */}
      <circle cx="12" cy="12" r="3.5" fill="#FAD180" stroke="#4A3B32" strokeWidth="1.2" />
    </svg>
  );
}

export function HandDrawnLeaf({ size = 24, className = '', stroke = '#4A3B32', fill = '#8FA89B' }: HandDrawnProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Leaf body */}
      <path d="M4 18C4 18 6 10 12 7C18 4 20 4 20 4C20 4 19 8 15 13C11 18 4 18 4 18Z" fill={fill} stroke={stroke} strokeWidth="1" strokeLinejoin="round" />
      {/* Vein */}
      <path d="M4 18C8 15 13 11 20 4" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function HandDrawnSprout({ size = 24, className = '', stroke = '#4A3B32' }: HandDrawnProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Stem */}
      <path d="M12 21V9" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      {/* Left Leaf */}
      <path d="M12 13C12 13 8 11 6 13C4 15 6 17 9 16C12 15 12 13 12 13Z" fill="#9CC5A1" stroke={stroke} strokeWidth="1" strokeLinejoin="round" />
      {/* Right Leaf */}
      <path d="M12 11C12 11 16 9 18 11C20 13 18 15 15 14C12 13 12 11 12 11Z" fill="#9CC5A1" stroke={stroke} strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

export function HandDrawnMushroom({ size = 24, className = '' }: HandDrawnProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Stem */}
      <path d="M10 20C10 16 11 14 12 14C13 14 14 16 14 20C14 21 10 21 10 20Z" fill="#FFF2E6" stroke="#4A3B32" strokeWidth="1" strokeLinejoin="round" />
      {/* Cap */}
      <path d="M4 13C4 8 8 6 12 6C16 6 20 8 20 13C17 14 15 13 12 13C9 13 7 14 4 13Z" fill="#D36F6F" stroke="#4A3B32" strokeWidth="1.2" strokeLinejoin="round" />
      {/* White spots */}
      <circle cx="9" cy="9" r="1.2" fill="#FFFFFF" />
      <circle cx="15" cy="9.5" r="1.5" fill="#FFFFFF" />
      <circle cx="12" cy="7.8" r="1" fill="#FFFFFF" />
    </svg>
  );
}
