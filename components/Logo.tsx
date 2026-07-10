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
        <linearGradient id="chainbrief-frame-gradient" x1="8" x2="56" y1="8" y2="56">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="chainbrief-tile-gradient" x1="8" x2="56" y1="8" y2="56">
          <stop offset="0" stopColor="#0f172a" />
          <stop offset="1" stopColor="#07111d" />
        </linearGradient>
        <linearGradient id="chainbrief-letter-gradient" x1="15" x2="50" y1="17" y2="44">
          <stop offset="0" stopColor="#f8fafc" />
          <stop offset="0.48" stopColor="#e0f2fe" />
          <stop offset="1" stopColor="#67e8f9" />
        </linearGradient>
      </defs>
      <rect
        height="64"
        rx="14"
        width="64"
        fill="url(#chainbrief-tile-gradient)"
      />
      <rect
        height="54"
        rx="12"
        width="54"
        x="5"
        y="5"
        fill="none"
        stroke="url(#chainbrief-frame-gradient)"
        strokeWidth="3"
      />
      <text
        fill="url(#chainbrief-letter-gradient)"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="28"
        fontWeight="900"
        letterSpacing="-1.6"
        x="11"
        y="41"
      >
        CB
      </text>
      <path
        d="M16 48h32"
        fill="none"
        stroke="#38bdf8"
        strokeLinecap="round"
        strokeOpacity="0.55"
        strokeWidth="2.5"
      />
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
