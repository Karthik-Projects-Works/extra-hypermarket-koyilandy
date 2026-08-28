// Extra Hypermarket — SVG Logo Component
// Brand: Red Primary + Green Accent + Black Text on White Logo

export function createLogoFull(className = '') {
  return `
    <svg class="logo-svg ${className}" viewBox="0 0 380 70" xmlns="http://www.w3.org/2000/svg" aria-label="Extra Hypermarket Logo">
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#D32F2F"/>
          <stop offset="100%" stop-color="#E57373"/>
        </linearGradient>
        <linearGradient id="logo-green-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#4CAF50"/>
          <stop offset="100%" stop-color="#66BB6A"/>
        </linearGradient>
      </defs>
      <text x="52" y="44" font-family="'Bebas Neue', Impact, sans-serif" font-size="52" font-weight="400" letter-spacing="6" fill="#ffffff">EXTRA</text>
      <!-- Green dot separator (matching the checkmark on the "X") -->
      <circle cx="195" cy="30" r="5" fill="url(#logo-green-grad)"/>
      <text x="210" y="44" font-family="'Space Grotesk', monospace, sans-serif" font-size="14" font-weight="700" letter-spacing="4" fill="#94a3b8">HYPER MARKET</text>
      <text x="0" y="62" font-family="'Space Grotesk', monospace, sans-serif" font-size="9" font-weight="500" letter-spacing="3" fill="#64748b">THE WORLD OF SHOPPING</text>
    </svg>
  `.trim();
}

export function createLogoCompact(className = '') {
  return `
    <svg class="logo-svg text-only ${className}" viewBox="0 0 180 50" xmlns="http://www.w3.org/2000/svg" aria-label="Extra Hypermarket Logo">
      <defs>
        <linearGradient id="logo-grad-compact" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#4CAF50"/>
          <stop offset="100%" stop-color="#66BB6A"/>
        </linearGradient>
      </defs>
      <text x="0" y="34" font-family="'Bebas Neue', Impact, sans-serif" font-size="42" font-weight="400" letter-spacing="5" fill="#ffffff">EXTRA</text>
      <circle cx="130" cy="24" r="4" fill="url(#logo-grad-compact)"/>
    </svg>
  `.trim();
}

export function createLogoHero(className = '') {
  return `
    <svg class="logo-svg ${className}" viewBox="0 0 500 100" xmlns="http://www.w3.org/2000/svg" aria-label="Extra Hypermarket Logo">
      <defs>
        <linearGradient id="logo-grad-hero" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#D32F2F"/>
          <stop offset="100%" stop-color="#E57373"/>
        </linearGradient>
        <linearGradient id="logo-green-hero" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#4CAF50"/>
          <stop offset="100%" stop-color="#66BB6A"/>
        </linearGradient>
        <filter id="logo-glow-hero">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <text x="60" y="60" font-family="'Bebas Neue', Impact, sans-serif" font-size="76" font-weight="400" letter-spacing="8" fill="#ffffff" filter="url(#logo-glow-hero)">EXTRA</text>
      <circle cx="288" cy="42" r="8" fill="url(#logo-green-hero)"/>
      <text x="308" y="60" font-family="'Space Grotesk', monospace, sans-serif" font-size="20" font-weight="700" letter-spacing="6" fill="#94a3b8">HYPER MARKET</text>
      <text x="60" y="82" font-family="'Space Grotesk', monospace, sans-serif" font-size="11" font-weight="500" letter-spacing="4" fill="#64748b">THE WORLD OF SHOPPING</text>
    </svg>
  `.trim();
}

export function createLogoFooter(className = '') {
  return `
    <svg class="logo-svg ${className}" viewBox="0 0 300 60" xmlns="http://www.w3.org/2000/svg" aria-label="Extra Hypermarket Logo">
      <defs>
        <linearGradient id="logo-grad-footer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#4CAF50"/>
          <stop offset="100%" stop-color="#66BB6A"/>
        </linearGradient>
      </defs>
      <text x="0" y="36" font-family="'Bebas Neue', Impact, sans-serif" font-size="42" font-weight="400" letter-spacing="5" fill="#ffffff">EXTRA</text>
      <circle cx="134" cy="24" r="4.5" fill="url(#logo-grad-footer)"/>
      <text x="148" y="36" font-family="'Space Grotesk', monospace, sans-serif" font-size="11" font-weight="700" letter-spacing="3.5" fill="#94a3b8">HYPER MARKET</text>
      <text x="0" y="52" font-family="'Space Grotesk', monospace, sans-serif" font-size="8" font-weight="500" letter-spacing="2.5" fill="#64748b">THE WORLD OF SHOPPING</text>
    </svg>
  `.trim();
}
