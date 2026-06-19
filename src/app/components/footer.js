"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaLinkedinIn,
  FaInstagram,
  FaChevronDown,
} from "react-icons/fa";

const NAV_COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/aboutus" },
      { label: "Movies", href: "/movies" },
      { label: "Offers", href: "/offers" },
      { label: "Careers", href: "#" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Use", href: "#" },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaPinterestP, href: "#", label: "Pinterest" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
];

function Footer() {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (title) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <footer className="site-footer">
      <div className="footer-top-accent" />

      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand column */}
            <div className="footer-brand-col">
              <Link href="/" className="footer-logo-link">
                <img src="/assets/img/logo/logo.png" alt="WideAngle" className="footer-logo-img" />
              </Link>
              <p className="footer-tagline">
                Wide Angle Movies delivers a seamless entertainment experience with the latest films, exclusive offers, and a user-friendly platform designed for movie lovers.
              </p>
              <div className="footer-social-row">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="footer-social-icon"
                  >
                    <Icon size={13} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            {NAV_COLUMNS.map((col) => {
              const isOpen = !!openSections[col.title];
              return (
                <div key={col.title} className="footer-nav-col">
                  <button
                    className="footer-col-toggle"
                    onClick={() => toggleSection(col.title)}
                    aria-expanded={isOpen}
                  >
                    <span className="footer-col-title">{col.title}</span>
                    <FaChevronDown
                      className={`footer-col-chevron${isOpen ? " is-open" : ""}`}
                      size={11}
                    />
                  </button>
                  <ul className={`footer-link-list${isOpen ? " is-open" : ""}`}>
                    <li className="footer-link-list-header">{col.title}</li>
                    {col.links.map(({ label, href }) => (
                      <li key={label}>
                        <Link href={href} className="footer-link">
                          <span className="footer-link-dash" />
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <p className="footer-copyright">
              Copyright &copy; 2025{" "}
              <span className="footer-brand-name">WideAngle</span>. All Rights
              Reserved. Website developed by{" "}
              <Link
                href="https://www.roblinx.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-dev-link"
              >
                Roblinx
              </Link>
              .
            </p>
            <div className="footer-payments">
              <img src="assets/img/images/card_img.png" alt="Payment methods" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;