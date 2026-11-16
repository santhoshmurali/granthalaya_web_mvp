"use client";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ABOUT_LINKS = [
  { href: "/about/", label: "About Granthalaya" },
  { href: "/about/shrines/", label: "Shrines" },
  { href: "/about/founder/", label: "About Founder" },
];

/** Site header: brand, About menu (3 pages), News and Alerts. */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const close = () => { setMenuOpen(false); setAboutOpen(false); };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" onClick={close}>
          <span className="brand-name">Sri Raghavendra Granthalaya</span>
        </Link>
        <button className="icon-button menu-toggle" aria-label="Toggle menu" aria-expanded={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Main">
          <Link href="/" onClick={close}>Home</Link>
          <div className="dropdown" onMouseLeave={() => setAboutOpen(false)}>
            <button className="dropdown-button" aria-expanded={aboutOpen} aria-haspopup="true"
                    onClick={() => setAboutOpen(!aboutOpen)} onMouseEnter={() => setAboutOpen(true)}>
              About <ChevronDown size={16} aria-hidden />
            </button>
            {aboutOpen && (
              <div className="dropdown-menu">
                {ABOUT_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} onClick={close}>{link.label}</Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/news/" onClick={close}>News and Alerts</Link>
        </nav>
      </div>
    </header>
  );
}
