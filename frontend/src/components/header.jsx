// frontend/src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import logoImg from "../assets/logo.png";

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

const Header = () => {
  const width = useWindowWidth();
  const isMobile = width <= 768;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Blog", path: "/blog" },
    { name: "Gallery", path: "/gallery" },
    { name: "Team", path: "/team" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header
        style={{
          backgroundColor: "#003e5b",
          color: "#fff",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1400,
          fontFamily: "'Segoe UI', sans-serif",
          boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.2)" : "none",
          transition: "all 0.3s ease",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0.6rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src={logoImg}
              alt="Medico Digital Marketing Logo"
              style={{
                height: "48px", width: "48px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #00b9d8",
                boxShadow: "0 0 15px rgba(0,209,255,0.2)"
              }}
            />
            <span style={{ 
              color: "#fff", 
              fontSize: "1.35rem", 
              fontWeight: 900, 
              letterSpacing: "-0.02em",
              display: isMobile && width < 400 ? "none" : "block"
            }}>
              Medico <span style={{ color: "#00D1FF" }}>Digitals</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile ? (
            <nav style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    style={{
                      color: isActive ? "#00D1FF" : "rgba(255,255,255,0.8)",
                      textDecoration: "none",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      letterSpacing: "0.03em",
                      textTransform: "uppercase",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      padding: "4px 0",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#fff";
                      e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = isActive ? "#00D1FF" : "rgba(255,255,255,0.8)";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    {item.name}
                    {isActive && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          height: 2,
                          backgroundColor: "#00D1FF",
                          boxShadow: "0 0 8px #00D1FF",
                          borderRadius: 2,
                        }}
                      />
                    )}
                  </Link>
                );
              })}

            </nav>
          ) : (
            <div
              onClick={() => setMenuOpen(true)}
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: 26,
                height: 20,
              }}
            >
              <span style={{ height: 3, backgroundColor: "#00D1FF", borderRadius: 2, transition: "all 0.3s" }} />
              <span style={{ height: 3, backgroundColor: "#00D1FF", borderRadius: 2, width: "70%", transition: "all 0.3s" }} />
              <span style={{ height: 3, backgroundColor: "#00D1FF", borderRadius: 2, transition: "all 0.3s" }} />
            </div>
          )}
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1400,
              display: menuOpen ? "block" : "none",
              transition: "opacity 0.3s ease",
            }}
            onClick={() => setMenuOpen(false)}
          />
          <aside
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              height: "100%",
              width: 280,
              backgroundColor: "#002b3d",
              display: "flex",
              flexDirection: "column",
              padding: "2rem 1.5rem",
              gap: "1.2rem",
              transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: 1500,
              boxShadow: menuOpen ? "4px 0 20px rgba(0,0,0,0.3)" : "none",
            }}
          >
            {/* Close button */}
            <div
              onClick={() => setMenuOpen(false)}
              style={{
                alignSelf: "flex-end",
                color: "#00D1FF",
                fontSize: "1.5rem",
                cursor: "pointer",
                marginBottom: 16,
              }}
            >
              ✕
            </div>

            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  style={{
                    color: isActive ? "#00D1FF" : "rgba(255,255,255,0.8)",
                    textDecoration: "none",
                    fontSize: "1.1rem",
                    fontWeight: isActive ? 700 : 500,
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: isActive ? "rgba(0,209,255,0.1)" : "transparent",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              style={{
                backgroundColor: "#00D1FF",
                color: "#003e5b",
                padding: "10px 20px",
                borderRadius: 25,
                fontWeight: 700,
                textDecoration: "none",
                textAlign: "center",
                marginTop: 12,
              }}
            >
              Get Started
            </Link>
          </aside>
        </>
      )}
    </>
  );
};

export default Header;
