import React from "react";

export default function JanSathiPremiumLogo({ size = 80, variant = "icon", animated = false, showText = false, className = "" }) {
  const dark = variant === "navy-gold" || variant === "metallic";
  const textColor = dark ? "#FFD700" : "#0052CC";

  return (
    <div className={`jan-sathi-logo ${animated ? "floating" : ""} ${className}`} style={{ display: "inline-flex", alignItems: "center", gap: Math.max(8, size * 0.12) }}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-label="Jan Sathi logo" role="img">
        <defs>
          <linearGradient id="js-navy" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#001A4D" />
            <stop offset="1" stopColor="#0052CC" />
          </linearGradient>
          <linearGradient id="js-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFD700" />
            <stop offset="0.5" stopColor="#FFA500" />
            <stop offset="1" stopColor="#FF8C00" />
          </linearGradient>
          <linearGradient id="js-heart" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E74C3C" />
            <stop offset="1" stopColor="#C0392B" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="47" fill="url(#js-navy)" />
        <circle cx="50" cy="50" r="39" fill="none" stroke="url(#js-gold)" strokeWidth="5" />
        <path d="M27 56c8-3 14-10 18-20l5 9 5-9c4 10 10 17 18 20" fill="none" stroke="#66B2FF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 72c-12-8-18-14-18-22 0-5 4-9 9-9 4 0 7 2 9 5 2-3 5-5 9-5 5 0 9 4 9 9 0 8-6 14-18 22Z" fill="url(#js-heart)" />
      </svg>
      {showText && (
        <span style={{ color: textColor, fontSize: Math.max(20, size * 0.28), fontWeight: 800, letterSpacing: 0 }}>
          JAN SATHI
        </span>
      )}
    </div>
  );
}