import Link from "next/link";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <Link className="logo" href="/" aria-label="ChainBrief home">
        <span className="logo-mark">CB</span>
        <span>ChainBrief</span>
      </Link>

      <nav aria-label="Footer navigation">
        {footerLinks.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
