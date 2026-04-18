import React, { useState } from "react";
import aboutImg from "../assets/About Medico.jpg";
import { FaCheckCircle, FaArrowRight, FaBullseye, FaBinoculars } from "react-icons/fa";

const teamMembers = [
  { icon: "👨‍⚕️", title: "Medical Professionals", desc: "Ensuring every message is clinically accurate and ethically sound." },
  { icon: "📢", title: "Health Communicators", desc: "Translating complex medical data into clear, accessible public information." },
  { icon: "✍️", title: "Content Creators", desc: "Crafting the narrative that connects your expertise with the community." },
  { icon: "🎨", title: "Graphic Designers", desc: "Building visual trust through patient-centered and professional design." },
  { icon: "📈", title: "Growth Strategists", desc: "Driving patient footfall through precision, data-driven marketing." },
];

const coreValues = [
  { letter: "E", title: "EXAMINE", desc: "We begin with deep research and data analysis to understand your unique market landscape.", color: "#003e5b" },
  { letter: "D", title: "DIAGNOSE", desc: "We identify the specific communication gaps and growth opportunities for your healthcare brand.", color: "#005a7a" },
  { letter: "T", title: "TRANSLATE", desc: "We turn complex medical expertise into clear, compliant, and life-changing health communication.", color: "#007a9a" },
  { letter: "F", title: "FLOURISH", desc: "We drive sustainable growth and long-term authority, ensuring your practice and its patients thrive.", color: "#00b9d8" },
];

const About = () => {
  const [imgHover, setImgHover] = useState(false);

  return (
    <>
      {/* ===== SECTION 1: ABOUT INTRO ===== */}
      <section
        id="about"
        style={{
          padding: "3.5rem 1.5rem",
          background: "linear-gradient(180deg, #fff 0%, #f8fbfd 100%)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background blurs */}
        <div style={{ position: "absolute", top: "50%", right: "-150px", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,185,216,0.06) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div className="about-intro" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", gap: "5rem", position: "relative", zIndex: 1 }}>
          {/* LEFT: IMAGE */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: -20, left: -20, width: 120, height: 120, backgroundImage: "radial-gradient(circle, #00b9d8 1.5px, transparent 1.5px)", backgroundSize: "12px 12px", opacity: 0.3, zIndex: 0 }} />
            <div style={{ position: "absolute", top: 30, left: -8, width: 6, height: 100, borderRadius: 3, background: "linear-gradient(180deg, #00D1FF, #003e5b)", zIndex: 5 }} />

            <div
              style={{
                position: "relative", zIndex: 1, borderRadius: 24, overflow: "hidden",
                boxShadow: imgHover ? "0 30px 70px rgba(0,62,91,0.25)" : "0 20px 50px rgba(0,62,91,0.12)",
                transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                transform: imgHover ? "scale(1.02)" : "scale(1)",
              }}
              onMouseEnter={() => setImgHover(true)}
              onMouseLeave={() => setImgHover(false)}
            >
              <img src={aboutImg} alt="About Medico" style={{ width: "100%", height: 520, objectFit: "cover", display: "block", transition: "transform 0.5s ease", transform: imgHover ? "scale(1.05)" : "scale(1)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to top, rgba(0,30,50,0.4), transparent)", pointerEvents: "none" }} />
            </div>

            {/* Floating cards */}
            <div style={{ position: "absolute", top: 30, right: -24, background: "#fff", borderRadius: 16, padding: "18px 22px", boxShadow: "0 12px 35px rgba(0,0,0,0.12)", zIndex: 4, textAlign: "center", border: "1px solid rgba(0,185,216,0.1)" }}>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#003e5b", lineHeight: 1 }}>10<span style={{ color: "#00b9d8" }}>+</span></div>
              <div style={{ fontSize: "0.7rem", color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>Years</div>
            </div>
            <div style={{ position: "absolute", bottom: 30, left: -16, background: "linear-gradient(135deg, #003e5b, #00536e)", color: "#fff", padding: "14px 24px", borderRadius: 16, fontWeight: 700, fontSize: "0.88rem", zIndex: 4, boxShadow: "0 10px 30px rgba(0,62,91,0.35)", display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(0,209,255,0.15)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,209,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🏥</div>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>Healthcare</div>
                <div style={{ fontSize: "0.68rem", opacity: 0.7, fontWeight: 400 }}>Specialized Agency</div>
              </div>
            </div>
          </div>

          {/* RIGHT: TEXT */}
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#00b9d8", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, padding: "5px 16px", background: "rgba(0,185,216,0.06)", borderRadius: 20, border: "1px solid rgba(0,185,216,0.12)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00b9d8" }} />
              Who We Are
            </span>

            <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, color: "#003e5b", lineHeight: 1.15, marginBottom: 20, marginTop: 10 }}>
              We Help Healthcare Brands{" "}
              <span style={{ background: "linear-gradient(120deg, #00b9d8, #00D1FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Grow Digitally</span>
            </h2>

            <p style={{ fontSize: "1.02rem", lineHeight: 1.85, color: "#666", marginBottom: 24 }}>
              We are a specialized team of medical professionals, health communicators, and creative strategists.
              Unlike general agencies that treat healthcare like retail, we respect the nuances of the medical
              field — where <strong style={{ color: "#003e5b" }}>trust is the primary currency</strong>.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {["Data-driven healthcare marketing strategies", "Team of medical professionals & creatives", "Clinically accurate & ethically sound messaging", "Proven track record with 50+ healthcare clients"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.93rem", color: "#444", fontWeight: 500 }}>
                  <FaCheckCircle style={{ color: "#00b9d8", fontSize: "0.95rem", flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: 24 }}>
              {[
                { value: "50+", label: "Clients Served" },
                { value: "95%", label: "Positive Feedback" },
                { value: "100+", label: "Campaigns Run" },
              ].map((stat, i) => (
                <div key={i} style={{ padding: "18px 14px", borderRadius: 16, textAlign: "center", background: "#fff", border: "1px solid rgba(0,185,216,0.1)", boxShadow: "0 4px 16px rgba(0,62,91,0.04)", transition: "all 0.3s ease", cursor: "default" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,185,216,0.12)"; e.currentTarget.style.borderColor = "#00b9d8"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,62,91,0.04)"; e.currentTarget.style.borderColor = "rgba(0,185,216,0.1)"; }}
                >
                  <div style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#003e5b" }}>{stat.value}</div>
                  <div style={{ fontSize: "0.72rem", color: "#999", fontWeight: 500, marginTop: 4, textTransform: "uppercase" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <a href="#services" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#00b9d8", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", transition: "all 0.3s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#003e5b"; e.currentTarget.style.gap = "14px"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#00b9d8"; e.currentTarget.style.gap = "8px"; }}
            >
              Explore Our Services <FaArrowRight size={14} />
            </a>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) { .about-intro { grid-template-columns: 1fr !important; gap: 3rem !important; } }
        `}</style>
      </section>

      {/* ===== SECTION 2: OUR TEAM ===== */}
      <section style={{ padding: "3rem 1.5rem", background: "#fff", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ display: "inline-block", color: "#00b9d8", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, padding: "5px 16px", background: "rgba(0,185,216,0.06)", borderRadius: 20 }}>
              Our Expertise
            </span>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, color: "#003e5b", marginTop: 8 }}>
              A Team Built for <span style={{ color: "#00b9d8" }}>Healthcare</span>
            </h2>
          </div>

          <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {teamMembers.map((member, i) => (
              <div
                key={i}
                style={{
                  background: "#fff", borderRadius: 18, padding: "2rem 1.5rem", textAlign: "center",
                  border: "1px solid rgba(0,185,216,0.08)", boxShadow: "0 2px 12px rgba(0,62,91,0.04)",
                  transition: "all 0.35s ease", cursor: "default",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,62,91,0.1)"; e.currentTarget.style.borderColor = "#00b9d8"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,62,91,0.04)"; e.currentTarget.style.borderColor = "rgba(0,185,216,0.08)"; }}
              >
                <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #f0faff, #e0f4f8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", margin: "0 auto 16px" }}>
                  {member.icon}
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#003e5b", marginBottom: 8 }}>{member.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "#777", lineHeight: 1.6 }}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: MISSION & VISION ===== */}
      <section style={{ padding: "3rem 1.5rem", background: "linear-gradient(135deg, #003e5b 0%, #002a42 100%)", fontFamily: "'Segoe UI', sans-serif", position: "relative", overflow: "hidden" }}>
        {/* Pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,209,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,209,255,0.03) 1px, transparent 1px)", backgroundSize: "50px 50px", pointerEvents: "none" }} />

        <div className="mission-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", position: "relative", zIndex: 1 }}>
          {/* Mission */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: "2.5rem", border: "1px solid rgba(0,209,255,0.1)", backdropFilter: "blur(10px)", transition: "all 0.3s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(0,209,255,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(0,209,255,0.1)"; }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(0,209,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <FaBullseye style={{ color: "#00D1FF", fontSize: "1.5rem" }} />
            </div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", marginBottom: 14 }}>🎯 Our Mission</h3>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8 }}>
              To transform medical expertise into accessible community action. We provide the strategic bridge
              between clinical excellence and the patients who seek it, ensuring every message is clear,
              ethical, and impactful.
            </p>
          </div>

          {/* Vision */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: "2.5rem", border: "1px solid rgba(0,209,255,0.1)", backdropFilter: "blur(10px)", transition: "all 0.3s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(0,209,255,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(0,209,255,0.1)"; }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(0,209,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <FaBinoculars style={{ color: "#00D1FF", fontSize: "1.5rem" }} />
            </div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", marginBottom: 14 }}>🔭 Our Vision</h3>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8 }}>
              To be the global leader in ethical health communications. We envision a future where digital
              connectivity and clinical trust are seamless, empowering every patient to make informed
              health decisions.
            </p>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) { .mission-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ===== SECTION 4: CORE VALUES (EDTF) ===== */}
      <section style={{ padding: "3rem 1.5rem", background: "#f8fbfd", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ display: "inline-block", color: "#00b9d8", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, padding: "5px 16px", background: "rgba(0,185,216,0.06)", borderRadius: 20 }}>
              What Drives Us
            </span>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, color: "#003e5b", marginTop: 8, marginBottom: 10 }}>
              Our Core Values <span style={{ color: "#00b9d8" }}></span>
            </h2>
          </div>

          <div className="values-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {coreValues.map((val, i) => (
              <div
                key={i}
                style={{
                  background: "#fff", borderRadius: 20, padding: "2rem 1.5rem", textAlign: "center",
                  border: "1px solid rgba(0,185,216,0.08)", boxShadow: "0 2px 12px rgba(0,62,91,0.04)",
                  transition: "all 0.35s ease", cursor: "default", position: "relative", overflow: "hidden",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,62,91,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,62,91,0.04)"; }}
              >
                {/* Top accent */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${val.color}, #00D1FF)` }} />

                {/* Letter circle */}
                <div style={{
                  width: 60, height: 60, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${val.color}, ${val.color}cc)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: "1.5rem", fontWeight: 900,
                  margin: "0 auto 16px", boxShadow: `0 6px 20px ${val.color}33`,
                }}>
                  {val.letter}
                </div>

                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: val.color, letterSpacing: "0.1em", marginBottom: 10 }}>
                  {val.title}
                </h3>
                <p style={{ fontSize: "0.88rem", color: "#777", lineHeight: 1.65 }}>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) { .values-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 500px) { .values-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>
    </>
  );
};

export default About;
