"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data/navLink";
import { FaAngleDown, FaTimes, FaBars } from "react-icons/fa";
import { openAuthPopUp } from "@/store/authSlice";
import { useDispatch, useSelector } from "react-redux";
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

  return (
    <>
      <header>
        <div
          id="sticky-header"
          className={`menu-area transparent-header ${sticky ? "sticky-menu" : ""}`}
        >
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
                        <li className="header-lang">
                          <form action="#">
                            <div className="icon">
                              <i className="fas fa-globe-asia"></i>
                            </div>
                            <select id="lang-dropdown" defaultValue="">
                              <option value="">Ahmedabad</option>
                              <option value="">Mehsana</option>
                            </select>
                          </form>
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