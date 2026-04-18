import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

// Sections
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Blog from "./components/Blog";
import Reviews from "./components/Reviews";
import GallerySection from "./components/Gallery";
import TeamSection from "./components/TeamSection";
import ContactPage from "./components/ContactPage";
import AdminPanel from "./components/AdminPanel";
import LoginPage from "./components/LoginPage";
import GSL from "./components/GSL";
import TelegramMiniApp from "./components/TelegramMiniApp";

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <GallerySection />
      <Blog />
      <Reviews />
      <TeamSection />
      <ContactPage />
    </>
  );
}

export default function App() {
  const location = useLocation();
  const isAdminPath = location.pathname === "/admin" || location.pathname === "/login" || location.pathname === "/gsl" || location.pathname === "/minapp";

  return (
    <>
      {!isAdminPath && <Header />}
      <main className="app-wrapper" style={{ width: "100%", maxWidth: "100vw", overflowX: "hidden" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/gallery" element={<GallerySection />} />
          <Route path="/team" element={<TeamSection />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/gsl" element={<GSL />} />
          <Route path="/minapp" element={<TelegramMiniApp />} />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
    </>
  );
}
