import Link from "next/link";

const navigationLinks = [
  { label: "News", href: "/news" },
  { label: "Markets", href: "/markets" },
  { label: "Rankings", href: "/rankings" },
  { label: "Sponsored", href: "/sponsored" },
  { label: "Advertise", href: "/advertise" },
];

export default function Header() {
  return (
    <header className="site-header">
      <Link className="logo" href="/" aria-label="ChainBrief home">
        <span className="logo-mark">CB</span>
        <span>ChainBrief</span>
      </Link>

      <nav className="main-nav" aria-label="Primary navigation">
        {navigationLinks.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
