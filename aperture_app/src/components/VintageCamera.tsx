import React from 'react';

export type CameraVariant =
  | 'noir-35'
  | 'silver-m'
  | 'halide-50'
  | 'twin-reflex'
  | 'field-28'
  | 'prime-lens';

interface VintageCameraProps {
  variant?: CameraVariant;
  className?: string;
  showShadow?: boolean;
}

export const VintageCamera: React.FC<VintageCameraProps> = ({
  variant = 'noir-35',
  className = '',
  showShadow = true,
}) => {
  if (variant === 'prime-lens' || variant === 'halide-50') {
    const isWarm = variant === 'halide-50';
    return (
      <svg
        viewBox="0 0 280 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${showShadow ? 'camera-shadow' : ''} ${className}`}
        role="img"
        aria-label={isWarm ? 'Helios 50mm f/1.4 prime lens' : 'Summi-Optic 35mm f/2.0 prime lens'}
      >
        <defs>
          <radialGradient id={`lensGlass-${variant}`} cx="42%" cy="38%" r="60%">
            <stop offset="0%" stopColor={isWarm ? '#D9CFC4' : '#CFD8E3'} />
            <stop offset="32%" stopColor="#5D646E" />
            <stop offset="72%" stopColor="#1E2228" />
            <stop offset="100%" stopColor="#0D0F12" />
          </radialGradient>
          <linearGradient id={`barrel-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2F3033" />
            <stop offset="50%" stopColor="#161719" />
            <stop offset="100%" stopColor="#0C0D0E" />
          </linearGradient>
        </defs>
        <circle cx="140" cy="110" r="88" fill={`url(#barrel-${variant})`} stroke="#3B3D42" strokeWidth="2" />
        <circle cx="140" cy="110" r="78" fill="#17181B" stroke="#2D2F34" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="140" cy="110" r="68" fill="#111214" stroke="#45484E" strokeWidth="1.5" />
        <circle cx="140" cy="110" r="56" fill="#0B0C0E" stroke={isWarm ? '#C8A87A' : '#9AA3AE'} strokeWidth="1.2" />
        <circle cx="140" cy="110" r="46" fill={`url(#lensGlass-${variant})`} />
        <ellipse cx="123" cy="92" rx="14" ry="9" transform="rotate(-28 123 92)" fill="white" fillOpacity="0.24" />
        <circle cx="158" cy="128" r="5" fill="white" fillOpacity="0.14" />
        <circle cx="140" cy="110" r="24" stroke="white" strokeOpacity="0.16" strokeWidth="1" />
      </svg>
    );
  }

  if (variant === 'twin-reflex') {
    return (
      <svg
        viewBox="0 0 280 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${showShadow ? 'camera-shadow' : ''} ${className}`}
        role="img"
        aria-label="Chronos Twin 6x6 medium format reflex camera"
      >
        <defs>
          <linearGradient id="tlrBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#232426" />
            <stop offset="100%" stopColor="#101113" />
          </linearGradient>
          <radialGradient id="tlrGlass" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#D6DCE2" />
            <stop offset="45%" stopColor="#434A54" />
            <stop offset="100%" stopColor="#0E1012" />
          </radialGradient>
        </defs>
        <rect x="74" y="14" width="132" height="192" rx="6" fill="url(#tlrBody)" stroke="#383A3E" strokeWidth="2" />
        <rect x="82" y="22" width="116" height="176" rx="3" fill="#151618" stroke="#2D2F33" strokeWidth="1" />
        {/* Top chrome plate */}
        <rect x="82" y="22" width="116" height="18" rx="2" fill="#D2D4D7" />
        <rect x="118" y="26" width="44" height="10" rx="1.5" fill="#1F2022" />
        {/* Viewing lens */}
        <circle cx="140" cy="76" r="28" fill="#1F2124" stroke="#C5C7CA" strokeWidth="2.5" />
        <circle cx="140" cy="76" r="20" fill="url(#tlrGlass)" />
        <ellipse cx="133" cy="69" rx="6" ry="3.5" transform="rotate(-25 133 69)" fill="white" fillOpacity="0.3" />
        {/* Taking lens */}
        <circle cx="140" cy="148" r="32" fill="#18191B" stroke="#C5C7CA" strokeWidth="3" />
        <circle cx="140" cy="148" r="23" fill="url(#tlrGlass)" />
        <ellipse cx="132" cy="140" rx="7" ry="4" transform="rotate(-25 132 140)" fill="white" fillOpacity="0.28" />
        {/* Side focus dial */}
        <rect x="65" y="128" width="9" height="38" rx="2" fill="#B9BCC0" />
      </svg>
    );
  }

  const isSilverTop = variant === 'silver-m';
  const isCompact28 = variant === 'field-28';

  const topPlateStart = isSilverTop ? '#E2E4E7' : isCompact28 ? '#2A2B2E' : '#1E1F21';
  const topPlateEnd = isSilverTop ? '#B9BDC2' : isCompact28 ? '#18191B' : '#111214';
  const bodyHighlight = isSilverTop ? '#CFD2D6' : '#323336';

  return (
    <svg
      viewBox="0 0 380 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${showShadow ? 'camera-shadow' : ''} ${className}`}
      role="img"
      aria-label={
        isSilverTop
          ? 'Silver Halide M2 rangefinder camera'
          : isCompact28
            ? 'Field Compact 28 analog camera'
            : 'Noir 35 black vintage rangefinder camera'
      }
    >
      <defs>
        {/* Top plate gradient */}
        <linearGradient id={`topPlate-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={topPlateStart} />
          <stop offset="100%" stopColor={topPlateEnd} />
        </linearGradient>

        {/* Body metal bezel */}
        <linearGradient id={`bodyShell-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#232426" />
          <stop offset="50%" stopColor="#141517" />
          <stop offset="100%" stopColor="#0C0D0E" />
        </linearGradient>

        {/* Ribbed vulcanite leatherette pattern */}
        <pattern id={`ribbedGrip-${variant}`} width="4" height="8" patternUnits="userSpaceOnUse">
          <rect width="4" height="8" fill="#17181A" />
          <rect x="0" width="1.6" height="8" fill="#232427" />
          <rect x="2.6" width="1" height="8" fill="#0F1012" />
        </pattern>

        {/* Stepped lens barrel */}
        <linearGradient id={`lensRing-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#323336" />
          <stop offset="45%" stopColor="#161719" />
          <stop offset="100%" stopColor="#090A0B" />
        </linearGradient>

        {/* Inner lens glass reflection */}
        <radialGradient id={`lensOptic-${variant}`} cx="44%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#D6CEC6" />
          <stop offset="28%" stopColor="#847E7A" />
          <stop offset="58%" stopColor="#3B3A3D" />
          <stop offset="86%" stopColor="#1B1B1D" />
          <stop offset="100%" stopColor="#0B0B0D" />
        </radialGradient>

        {/* Viewfinder glass */}
        <radialGradient id={`vfGlass-${variant}`} cx="38%" cy="34%" r="64%">
          <stop offset="0%" stopColor="#F3F5F7" />
          <stop offset="45%" stopColor="#A6ACB4" />
          <stop offset="100%" stopColor="#36393F" />
        </radialGradient>
      </defs>

      {/* Left & Right Strap Lugs */}
      <g>
        <path
          d="M27 83 C18 83, 18 99, 27 99"
          stroke="#7E7771"
          strokeWidth="3.2"
          fill="none"
          strokeLinecap="round"
        />
        <rect x="27" y="85" width="6" height="12" rx="1.5" fill="#4A4744" />

        <path
          d="M353 83 C362 83, 362 99, 353 99"
          stroke="#7E7771"
          strokeWidth="3.2"
          fill="none"
          strokeLinecap="round"
        />
        <rect x="347" y="85" width="6" height="12" rx="1.5" fill="#4A4744" />
      </g>

      {/* Top-left rewind / shutter dial */}
      <g>
        <rect x="52" y="13" width="44" height="14" rx="2" fill={isSilverTop ? '#C7CACF' : '#262729'} stroke="#3B3C40" strokeWidth="1" />
        {/* Knurling lines on dial */}
        <path
          d="M57 14v12 M62 14v12 M67 14v12 M72 14v12 M77 14v12 M82 14v12 M87 14v12 M92 14v12"
          stroke={isSilverTop ? '#8A8E94' : '#121314'}
          strokeWidth="1.2"
        />
        {/* Base collar */}
        <rect x="46" y="25" width="56" height="5" rx="1" fill={isSilverTop ? '#D5D8DC' : '#1E1F22'} />
        {/* Small shutter release button */}
        <rect x="115" y="21" width="12" height="8" rx="2" fill="#D5D7DB" stroke="#5A5C60" strokeWidth="0.8" />
        {/* Hot-shoe / rewind knob detail on right */}
        {isCompact28 && (
          <rect x="292" y="23" width="24" height="6" rx="1.5" fill="#323438" />
        )}
      </g>

      {/* Main Camera Chassis */}
      <rect
        x="32"
        y="29"
        width="316"
        height="208"
        rx="4"
        fill={`url(#bodyShell-${variant})`}
        stroke={bodyHighlight}
        strokeWidth="1.5"
      />

      {/* Top Plate Section */}
      <path
        d="M33 33 C33 30.8 34.8 29 37 29 H343 C345.2 29 347 30.8 347 33 V79 H33 V33 Z"
        fill={`url(#topPlate-${variant})`}
      />
      {/* Top edge specular line */}
      <line x1="36" y1="30.5" x2="344" y2="30.5" stroke="white" strokeOpacity={isSilverTop ? '0.65' : '0.18'} strokeWidth="1" />
      {/* Dividing groove between top plate & vulcanite grip */}
      <line x1="33" y1="79.5" x2="347" y2="79.5" stroke="#090A0B" strokeWidth="1.5" />
      <line x1="33" y1="81" x2="347" y2="81" stroke="white" strokeOpacity="0.1" strokeWidth="0.8" />

      {/* Center Metering / Flash Socket on Top Plate */}
      <g>
        <circle cx="179" cy="48" r="10.5" fill="#2A2B2E" stroke="#686A70" strokeWidth="1.2" />
        <circle cx="179" cy="48" r="7.5" fill="#131416" stroke="#8C8F96" strokeWidth="0.8" />
        <circle cx="179" cy="48" r="4" fill="#3D4046" />
        <circle cx="177.5" cy="46.5" r="1.4" fill="white" fillOpacity="0.45" />
      </g>

      {/* Right Optical Viewfinder Window */}
      <g>
        <rect
          x="266"
          y="39"
          width="36"
          height="36"
          rx="4"
          fill={isSilverTop ? '#B5B8BD' : '#18191B'}
          stroke={isSilverTop ? '#7B7E84' : '#35373B'}
          strokeWidth="1.2"
        />
        <circle cx="284" cy="57" r="14.5" fill="#2A2C30" stroke="#7A7D84" strokeWidth="1.4" />
        <circle cx="284" cy="57" r="11.5" fill={`url(#vfGlass-${variant})`} />
        <ellipse cx="280" cy="53" rx="4.5" ry="2.5" transform="rotate(-24 280 53)" fill="white" fillOpacity="0.55" />
      </g>

      {/* Left secondary rangefinder window for Silver M2 */}
      {isSilverTop && (
        <g>
          <rect x="128" y="45" width="16" height="14" rx="2" fill="#1B1C1E" stroke="#8E9299" strokeWidth="1" />
          <rect x="131" y="48" width="10" height="8" rx="1" fill="#4B525C" />
        </g>
      )}

      {/* Ribbed Vulcanite Leatherette Lower Body */}
      <rect x="35" y="81.5" width="310" height="146" rx="1.5" fill={`url(#ribbedGrip-${variant})`} />
      {/* Subtle inner metallic border around leatherette */}
      <rect x="35" y="81.5" width="310" height="146" rx="1.5" stroke="#2D2E32" strokeWidth="1" />

      {/* Bottom Baseplate Seam */}
      <rect x="33" y="228" width="314" height="8" rx="2" fill={isSilverTop ? '#C5C8CD' : '#18191B'} />
      <line x1="33" y1="228" x2="347" y2="228" stroke="#080809" strokeWidth="1.2" />

      {/* Central Lens Barrel Assembly */}
      <g>
        {/* Outer cast shadow ring on body */}
        <circle cx="179" cy="153" r="76" fill="black" fillOpacity="0.52" />

        {/* Outer knurled focus barrel */}
        <circle cx="179" cy="151" r="72" fill={`url(#lensRing-${variant})`} stroke="#3B3D42" strokeWidth="1.6" />
        <circle cx="179" cy="151" r="69" stroke="#0C0D0E" strokeWidth="2.5" strokeDasharray="2 2.5" />

        {/* Smooth matte bezel holding lens markings */}
        <circle cx="179" cy="151" r="61" fill="#131416" stroke="#2B2D31" strokeWidth="1.2" />

        {/* Delicate curved lens markings (matching the vintage engravings) */}
        <path id={`arcTop-${variant}`} d="M 129 151 A 50 50 0 0 1 229 151" fill="none" />
        <path id={`arcBottom-${variant}`} d="M 127 153 A 52 52 0 0 0 231 153" fill="none" />
        <text fill="#CFCBC4" fillOpacity="0.82" fontSize="7.2" fontWeight="500" letterSpacing="1.6">
          <textPath href={`#arcTop-${variant}`} startOffset="14%">
            {isCompact28 ? 'OPTICAL  28mm  1:2.8' : 'APERTURE  38mm  1:2.8'}
          </textPath>
        </text>
        <text fill="#CFCBC4" fillOpacity="0.72" fontSize="6.4" fontWeight="500" letterSpacing="1.8">
          <textPath href={`#arcBottom-${variant}`} startOffset="22%">
            ANALOG SERIES · 1974
          </textPath>
        </text>

        {/* Inner brushed metallic ring */}
        <circle
          cx="179"
          cy="151"
          r="43"
          fill="#101113"
          stroke={isSilverTop ? '#D4D6DA' : '#7D7B78'}
          strokeWidth="1.5"
        />
        <circle cx="179" cy="151" r="39" fill="#0A0B0C" stroke="#2A2B2E" strokeWidth="1" />

        {/* Multi-coated Front Glass Element */}
        <circle cx="179" cy="151" r="33" fill={`url(#lensOptic-${variant})`} />

        {/* Recessed aperture blades ring */}
        <circle cx="179" cy="151" r="16" fill="#18171A" fillOpacity="0.55" stroke="white" strokeOpacity="0.14" strokeWidth="0.8" />

        {/* Soft optical glass reflections */}
        <ellipse
          cx="166"
          cy="137"
          rx="11"
          ry="6"
          transform="rotate(-32 166 137)"
          fill="white"
          fillOpacity="0.22"
        />
        <circle cx="192" cy="166" r="4.5" fill="white" fillOpacity="0.12" />
      </g>
    </svg>
  );
};
