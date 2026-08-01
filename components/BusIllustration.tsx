export default function BusIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 600 300"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="600" height="300" fill="#eef3fc" rx="16" />
      {/* skyline */}
      <g opacity="0.35" fill="#c7d7f5">
        <rect x="20" y="90" width="40" height="120" />
        <rect x="70" y="60" width="34" height="150" />
        <rect x="470" y="70" width="36" height="140" />
        <rect x="520" y="100" width="46" height="110" />
      </g>
      {/* clouds */}
      <g fill="#ffffff">
        <ellipse cx="120" cy="55" rx="34" ry="16" />
        <ellipse cx="150" cy="48" rx="26" ry="14" />
        <ellipse cx="470" cy="45" rx="30" ry="14" />
      </g>
      {/* ground */}
      <rect x="0" y="230" width="600" height="70" fill="#dbe6f8" />
      <rect x="0" y="230" width="600" height="6" fill="#b9cdf2" />
      {/* trees */}
      <g>
        <rect x="120" y="205" width="8" height="30" fill="#8a6b4f" />
        <circle cx="124" cy="195" r="24" fill="#8fd19e" />
        <rect x="430" y="200" width="8" height="35" fill="#8a6b4f" />
        <circle cx="434" cy="188" r="28" fill="#7fc492" />
      </g>
      {/* bus stop */}
      <g>
        <rect x="500" y="150" width="6" height="85" fill="#1e3a8a" />
        <rect x="490" y="150" width="70" height="46" rx="4" fill="#1e3a8a" />
        <rect x="497" y="157" width="56" height="30" rx="2" fill="#ffffff" fillOpacity="0.9" />
        <rect x="480" y="230" width="90" height="6" fill="#1e3a8a" />
      </g>
      {/* pin */}
      <g>
        <path
          d="M180 40c-16 0-28 12-28 28 0 20 28 52 28 52s28-32 28-52c0-16-12-28-28-28z"
          fill="#1e3a8a"
        />
        <circle cx="180" cy="68" r="10" fill="#ffffff" />
      </g>
      {/* road */}
      <rect x="0" y="235" width="600" height="4" fill="#ffffff" fillOpacity="0.6" />
      {/* bus body */}
      <g>
        <rect x="140" y="150" width="260" height="80" rx="14" fill="#ffffff" stroke="#1e3a8a" strokeWidth="3" />
        <rect x="140" y="150" width="260" height="34" rx="14" fill="#1e3a8a" />
        <rect x="160" y="158" width="34" height="20" rx="3" fill="#bfd3fb" />
        <rect x="202" y="158" width="34" height="20" rx="3" fill="#bfd3fb" />
        <rect x="244" y="158" width="34" height="20" rx="3" fill="#bfd3fb" />
        <rect x="286" y="158" width="34" height="20" rx="3" fill="#bfd3fb" />
        <text x="160" y="215" fontSize="20" fontWeight="700" fill="#1e3a8a" fontFamily="sans-serif">
          BUSahero
        </text>
        <circle cx="185" cy="232" r="14" fill="#1e293b" />
        <circle cx="185" cy="232" r="6" fill="#94a3b8" />
        <circle cx="345" cy="232" r="14" fill="#1e293b" />
        <circle cx="345" cy="232" r="6" fill="#94a3b8" />
      </g>
    </svg>
  );
}
