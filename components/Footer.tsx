import Link from "next/link";
import Logo from "./Logo";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Brand", href: "/brand" },
  { label: "Media Kit", href: "/media-kit" },
  { label: "Submit Project", href: "/submit-project" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <Link className="logo" href="/" aria-label="ChainBrief home">
        <Logo />
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
