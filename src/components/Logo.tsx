/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  textColor?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  withBackground?: boolean;
  layout?: 'vertical' | 'horizontal';
}

/**
 * Highly polished, pristine pure-SVG component replicating the uploaded StockPile logo:
 * - Double-layered warehouse roof
 * - Outer columns and structured base arc curve
 * - Interior racks with double-shelf levels housing detailed items/boxes
 * - Split-color typography: Stock (Dark Navy / White) + Pile (Steel blue / Orange) underneath the logo
 */
export default function Logo({ 
  className = '', 
  iconOnly = false, 
  textColor = 'dark', 
  size = 'md',
  withBackground = false,
  layout = 'vertical'
}: LogoProps) {
  // Dimension tuning - streamlined to be more elegant and compact while maintaining drawing proportion
  const dims = {
    sm: { icon: 'h-[48px] w-[90px]', text: 'text-[15px] font-black', subText: 'text-[10px] mt-1' },
    md: { icon: 'h-[80px] w-[150px]', text: 'text-[25px] font-black', subText: 'text-[15px] mt-1.5' },
    lg: { icon: 'h-[117px] w-[220px]', text: 'text-[37px] font-black', subText: 'text-[18px] mt-2' },
  }[size];

  // Colors based on requested text theme
  const darkNavy = '#091625';
  const steelBlue = '#438AF3';
  const neonOrange = '#FF6B00';

  const resolvedTextColor = withBackground ? 'dark' : textColor;
  const isVertical = layout === 'vertical';

  return (
    <div 
      className={`${
        withBackground 
          ? `bg-white ${size === 'sm' ? 'p-2 rounded-xl' : 'p-3.5 sm:p-4 rounded-2xl'} shadow-[0_15px_35px_rgba(0,0,0,0.12)] border border-slate-100/90 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-[0_20px_45px_rgba(0,0,0,0.18)] hover:-translate-y-0.5` 
          : isVertical
            ? 'flex flex-col items-center text-center gap-1'
            : 'flex items-center gap-2.5'
      } ${className}`} 
      id="stockpile-custom-logo"
    >
      {/* 1. The Vector SVG Icon */}
      <svg 
        viewBox="30 68 340 180" 
        className={`${dims.icon} shrink-0 transition-transform duration-200 hover:scale-105`}
        xmlns="http://www.w3.org/2000/svg"
        id="logo-vector-graphic"
      >
        {/* Soft elegant shadow group */}
        <filter id="logo-drop-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.06" />
        </filter>

        <g filter="url(#logo-drop-shadow)">
          {/* A. Base arc curve (the ground crescent) */}
          <path 
            d="M 40 240 Q 200 230 360 240" 
            stroke="#0B192C" 
            strokeWidth="5" 
            fill="none" 
            strokeLinecap="round" 
            className="transition-colors duration-300"
          />

          {/* B. Warehouse Silhouette Background (white sheet) */}
          <polygon 
            points="76,145 200,85 324,145 315,233 85,233" 
            fill="#FFFFFF" 
          />

          {/* C. Outer Structure & Double Roof */}
          {/* Main wall outline */}
          <path 
            d="M 85,233 L 85,145 L 200,89 L 315,145 L 315,233" 
            fill="none" 
            stroke="#0B192C" 
            strokeWidth="12" 
            strokeLinejoin="round" 
            strokeLinecap="round"
          />
          {/* Outer floating roof shell */}
          <path 
            d="M 76,145 L 200,85 L 324,145" 
            fill="none" 
            stroke="#0B192C" 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* D. Shelf horizontal beam separator */}
          <line 
            x1="97" y1="172" 
            x2="303" y2="172" 
            stroke="#0B192C" 
            strokeWidth="10" 
            strokeLinecap="round" 
          />

          {/* E. Top level shelves and packages */}
          {/* Left storage box on top shelf */}
          <rect x="108" y="141" width="34" height="26" rx="4" fill="#E2F1FF" stroke="#0B192C" strokeWidth="4" />
          {/* Detailed item indicators representing the labels and handles */}
          <rect x="114" y="146" width="8" height="4" fill="#0B192C" rx="1" />
          <rect x="128" y="156" width="6" height="8" fill="none" stroke="#0B192C" strokeWidth="3" rx="1.5" />

          {/* Middle storage box on top shelf */}
          <rect x="152" y="126" width="44" height="41" rx="4" fill="#E2F1FF" stroke="#0B192C" strokeWidth="4" />
          <rect x="159" y="132" width="10" height="5" fill="#0B192C" rx="1" />
          <rect x="176" y="151" width="10" height="5" fill="#0B192C" rx="1" />

          {/* Secondary small support box on top shelf */}
          <rect x="208" y="141" width="28" height="26" rx="3" fill="#D2D6DC" stroke="#0B192C" strokeWidth="4" />
          <rect x="215" y="146" width="8" height="4" fill="#0B192C" />

          {/* Right box on top shelf */}
          <rect x="250" y="141" width="40" height="26" rx="4" fill="#E2F1FF" stroke="#0B192C" strokeWidth="4" />
          <rect x="258" y="146" width="10" height="5" fill="#0B192C" rx="1" />
          <rect x="272" y="155" width="10" height="5" fill="#0B192C" rx="1" />


          {/* F. Bottom level shelves and packages */}
          {/* Left box on bottom shelf */}
          <rect x="108" y="185" width="42" height="42" rx="4" fill="#E2F1FF" stroke="#0B192C" strokeWidth="4" />
          <rect x="116" y="192" width="10" height="6" fill="#0B192C" rx="1" />
          <rect x="132" y="210" width="10" height="6" fill="#0B192C" rx="1" />

          {/* Middle box on bottom shelf */}
          <rect x="162" y="181" width="42" height="46" rx="4" fill="#E2F1FF" stroke="#0B192C" strokeWidth="4" />
          <rect x="170" y="188" width="10" height="6" fill="#0B192C" rx="1" />
          <rect x="186" y="210" width="10" height="6" fill="#0B192C" rx="1" />

          {/* Secondary small box on bottom shelf */}
          <rect x="216" y="200" width="24" height="27" rx="2" fill="#D2D6DC" stroke="#0B192C" strokeWidth="3" />
          <rect x="223" y="206" width="8" height="4" fill="#0B192C" />

          {/* Right box on bottom shelf */}
          <rect x="252" y="185" width="42" height="42" rx="4" fill="#E2F1FF" stroke="#0B192C" strokeWidth="4" />
          <rect x="260" y="192" width="10" height="6" fill="#0B192C" rx="1" />
          <rect x="276" y="210" width="10" height="6" fill="#0B192C" rx="1" />
        </g>
      </svg>

      {/* 2. Brand Identity Text */}
      {!iconOnly && (
        <div className={`flex flex-col select-none ${isVertical ? 'mt-2' : ''}`} id="logo-brand-text">
          <span className={`font-black tracking-tight ${dims.text} leading-none flex items-baseline justify-center`}>
            <span style={{ color: resolvedTextColor === 'light' ? '#FFFFFF' : darkNavy }}>Stock</span>
            <span style={{ color: resolvedTextColor === 'light' ? neonOrange : steelBlue }}>Pile</span>
          </span>
          <span 
            className={`${dims.subText} font-mono block text-center`}
            style={{
              color: '#00d2ff',
              textShadow: '0 0 10px rgba(0, 210, 255, 0.85), 0 0 3px rgba(0, 210, 255, 1)',
              fontWeight: 800,
              letterSpacing: '0.12em'
            }}
          >
            LOGÍSTICA INTELIGENTE
          </span>
        </div>
      )}
    </div>
  );
}
