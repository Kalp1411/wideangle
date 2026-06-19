"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data/navLink";
import { FaAngleDown, FaTimes, FaBars, FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";
import { openAuthPopUp } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { useSetting } from "@/hooks/useSetting";
import Image from "next/image";

function Header() {
  const [sticky, setSticky] = useState(false);
  const setting = useSetting();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useAuth();

  useEffect(() => {       
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isActive, setIsActive] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [selectedCity, setSelectedCity] = useState("Ahmedabad");
  const [cityOpen, setCityOpen] = useState(false);
  const cityRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setCityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsActive(!isActive);
    if (!isActive) {
      document.body.classList.add("mobile-menu-visible");
    } else {
      document.body.classList.remove("mobile-menu-visible");
    }
  };

  const handleSubMenu = (index) => {
    setOpenSubMenu(openSubMenu === index ? null : index);
  };
  
  const handleCityChange = (city) => {
    alert(city)
    setSelectedCity(city); setCityOpen(false);
  };

  return (
    <>
      <header>
        <div id="sticky-header" className={`menu-area transparent-header ${sticky ? "sticky-menu" : ""}`}>
          <div className="container custom-container">
            <div className="row">
              <div className="col-12">
                <div className="mobile-nav-toggler" onClick={handleToggle}>
                  <i className="fas fa-bars"></i>
                </div>
                <div className="menu-wrap">
                  <nav className="menu-nav show">
                    <div className="logo">
                      <Link href="/">
                        {/* <Image src={setting?.logo?.thumbnails['115x95'] || "/assets/img/logo/logo.png"} alt="Logo" width={150} height={50} unoptimized /> */}
                        <Image src={"/assets/img/logo/logo.png"} alt="Logo" width={150} height={50} unoptimized />
                        {/* <img src="/assets/img/logo/logo.png" alt="Logo" /> */}
                      </Link>
                    </div>
                    <div className="navbar-wrap main-menu d-none d-lg-flex">
                      <ul className="navigation">
                        {navLinks.Items.map((item) => {
                          const isActive = pathname === item.url;

                          return (
                            <li
                              key={item.id}
                              className={`${isActive ? "active" : ""} ${item.submenu ? "menu-item-has-children" : ""}`.trim()}
                            >
                              <Link href={item.url || "#"}>{item.title}</Link>

                              {item.submenu && (
                                <ul className="submenu">
                                  {item.submenu.map((sub, index) => {
                                    const isSubActive = pathname === sub.url;
                                    return (
                                      <li
                                        key={index}
                                        className={isSubActive ? "active" : ""}
                                      >
                                        <Link href={sub.url || "#"}>
                                          {sub.title}
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="header-action d-none d-md-block">
                      <ul>
                        <li className="header-lang" ref={cityRef} style={{ position: "relative" }}>
                          <button
                            onClick={() => setCityOpen(!cityOpen)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              background: cityOpen ? "rgba(242,140,40,0.12)" : "rgba(255,255,255,0.07)",
                              border: "1px solid",
                              borderColor: cityOpen ? "rgba(242,140,40,0.5)" : "rgba(255,255,255,0.15)",
                              borderRadius: "999px",
                              padding: "7px 14px",
                              cursor: "pointer",
                              color: "#fff",
                              fontSize: "13px",
                              fontWeight: 500,
                              transition: "all 0.2s ease",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <FaMapMarkerAlt style={{ color: "#f28c28", fontSize: "12px", flexShrink: 0 }} />
                            <span>{selectedCity}</span>
                            <FaChevronDown
                              style={{
                                fontSize: "10px",
                                opacity: 0.7,
                                transform: cityOpen ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s ease",
                              }}
                            />
                          </button>

                          {cityOpen && (
                            <div style={{
                              position: "absolute",
                              top: "calc(100% + 8px)",
                              left: "50%",
                              transform: "translateX(-50%)",
                              background: "#1a1a2e",
                              border: "1px solid rgba(255,255,255,0.1)",
                              borderRadius: "12px",
                              boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
                              minWidth: "140px",
                              overflow: "hidden",
                              zIndex: 999,
                            }}>
                              {["Ahmedabad", "Mehsana"].map((city) => (
                                <button
                                  key={city}
                                  onClick={() => handleCityChange(city)}
                                  style={{
                                    width: "100%",
                                    textAlign: "left",
                                    padding: "10px 16px",
                                    fontSize: "13px",
                                    fontWeight: selectedCity === city ? 600 : 400,
                                    color: selectedCity === city ? "#f28c28" : "rgba(255,255,255,0.8)",
                                    background: selectedCity === city ? "rgba(242,140,40,0.12)" : "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    transition: "background 0.15s ease",
                                  }}
                                  onMouseEnter={e => { if (selectedCity !== city) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                                  onMouseLeave={e => { if (selectedCity !== city) e.currentTarget.style.background = "transparent"; }}
                                >
                                  <FaMapMarkerAlt style={{ fontSize: "10px", color: selectedCity === city ? "#f28c28" : "rgba(255,255,255,0.4)" }} />
                                  {city}
                                </button>
                              ))}
                            </div>
                          )}
                        </li>
                        <li className="header-btn">
                          {user ? (
                            <Link
                              href="/dashboard"
                              className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-[#f28c28] to-[#d9720e] text-white text-sm font-semibold tracking-wide shadow-[0_4px_18px_rgba(242,140,40,0.35)] hover:shadow-[0_6px_26px_rgba(242,140,40,0.5)] hover:-translate-y-0.5 transition-all duration-300"
                            >
                              {user.name || user.user_name || "Dashboard"}
                            </Link>
                          ) : (
                            <button
                              className="btn"
                              onClick={() => dispatch(openAuthPopUp())}>
                              Sign In
                            </button>
                          )}
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className={`mobile-menu ${isActive ? "active" : ""}`}>
        <nav className="menu-box">
          <div className="close-btn" onClick={handleToggle}>
            <FaTimes />
          </div>

          <div className="menu-outer">
            <ul className="navigation">
              <li className="menu-item-has-children">
                <Link href="/">Home</Link>
              </li>

              <li>
                <Link href="/movies">Movies</Link>
              </li>
              <li>
                <Link href="/offers">Offers</Link>
              </li>
              <li className="">
                <Link href="/about">About</Link>
              </li>
              <li className="menu-item-has-children">
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="menu-backdrop" onClick={handleToggle}></div>
      </div>
    </>
  );
}

export default Header;