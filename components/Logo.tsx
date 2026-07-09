type LogoProps = {
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClassNames = {
  sm: "logo-size-sm",
  md: "logo-size-md",
  lg: "logo-size-lg",
};

function LogoMark() {
  return (
    <svg
      aria-hidden="true"
      className="logo-mark-svg"
      focusable="false"
      viewBox="0 0 64 64"
    >
      <defs>
        <linearGradient id="chainbrief-mark-gradient" x1="10" x2="56" y1="8" y2="58">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="0.56" stopColor="#34d399" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="chainbrief-doc-gradient" x1="23" x2="45" y1="18" y2="49">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#bfdbfe" />
        </linearGradient>
      </defs>
      <rect height="64" rx="16" width="64" fill="#05070b" />
      <rect
        height="58"
        rx="14"
        width="58"
        x="3"
        y="3"
        fill="none"
        stroke="url(#chainbrief-mark-gradient)"
        strokeOpacity="0.9"
        strokeWidth="2"
      />
      <g
        fill="none"
        stroke="url(#chainbrief-mark-gradient)"
        strokeLinecap="round"
        strokeWidth="5"
      >
        <path d="M18 27.5c0-5.2 4.2-9.5 9.5-9.5H35" />
        <path d="M46 36.5c0 5.2-4.2 9.5-9.5 9.5H29" />
        <path d="M19 38.5c-3.5-3.5-3.5-9.1 0-12.6l6.9-6.9" strokeOpacity="0.72" />
        <path d="M45 25.5c3.5 3.5 3.5 9.1 0 12.6l-6.9 6.9" strokeOpacity="0.72" />
      </g>
      <path
        d="M25 16h16l8 8v24H25V16Z"
        fill="#08111f"
        stroke="url(#chainbrief-doc-gradient)"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
      <path d="M41 16v9h8" fill="none" stroke="#38bdf8" strokeLinejoin="round" strokeWidth="2.5" />
      <g fill="url(#chainbrief-mark-gradient)">
        <rect height="9" rx="1.5" width="4" x="31" y="34" />
        <rect height="15" rx="1.5" width="4" x="38" y="28" />
        <rect height="20" rx="1.5" width="4" x="45" y="23" />
      </g>
      <path d="M30 24h8M30 29h12" stroke="#dbeafe" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

export default function Logo({
  variant = "full",
  size = "md",
  className = "",
}: LogoProps) {
  const classNames = ["brand-logo", sizeClassNames[size], className]
    .filter(Boolean)
    .join(" ");

  if (variant === "icon") {
    return (
      <span className={`${classNames} brand-logo-icon`} aria-label="ChainBrief">
        <LogoMark />
      </span>
    );
  }

  return (
    <span className={classNames}>
      <LogoMark />
      <span className="brand-wordmark" aria-label="ChainBrief">
        <span>Chain</span>
        <span>Brief</span>
      </span>
    </span>
  );
}
