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
        <linearGradient id="chainbrief-mark-gradient" x1="8" x2="56" y1="8" y2="58">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="0.5" stopColor="#34d399" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <rect height="64" rx="15" width="64" fill="#05070b" />
      <rect
        height="54"
        rx="13"
        width="54"
        x="5"
        y="5"
        fill="none"
        stroke="url(#chainbrief-mark-gradient)"
        strokeOpacity="0.95"
        strokeWidth="3"
      />
      <g
        fill="none"
        stroke="url(#chainbrief-mark-gradient)"
        strokeLinecap="round"
        strokeWidth="7"
      >
        <path d="M18 28c0-5.5 4.5-10 10-10h8" />
        <path d="M46 36c0 5.5-4.5 10-10 10h-8" />
      </g>
      <path
        d="M24 15h18l8 8v26H24V15Z"
        fill="#0b1422"
        stroke="#f8fafc"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path d="M42 15v9h8" fill="none" stroke="#38bdf8" strokeLinejoin="round" strokeWidth="3" />
      <g fill="url(#chainbrief-mark-gradient)">
        <rect height="10" rx="2" width="5" x="30" y="34" />
        <rect height="16" rx="2" width="5" x="38" y="28" />
        <rect height="22" rx="2" width="5" x="46" y="22" />
      </g>
      <path d="M30 24h9M30 29h10" stroke="#dbeafe" strokeLinecap="round" strokeWidth="2.6" />
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
