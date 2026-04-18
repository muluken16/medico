import React, { useState } from "react";

// ================== HEALTHCARE SERVICES DATA ==================
const servicesData = [
  {
    id: 1,
    icon: "🏥",
    title: "Healthcare Digital Strategy",
    description:
      "We develop comprehensive digital marketing strategies tailored for hospitals, clinics, and healthcare organizations. Our approach combines patient journey mapping, competitive analysis, and data-driven insights to create actionable growth plans that respect medical ethics and compliance requirements.",
  },
  {
    id: 2,
    icon: "📱",
    title: "Social Media Marketing",
    description:
      "We design thumb-stopping social media campaigns that reach patients across Facebook, Instagram, LinkedIn, and TikTok. Healthcare-focused content that builds trust, educates patients, and drives engagement while maintaining professional medical standards.",
  },
  {
    id: 3,
    icon: "✍️",
    title: "Health Content Creation",
    description:
      "Our medical writers and health communicators create accurate, accessible content for blogs, websites, and social media. Every piece is reviewed for clinical accuracy, optimized for SEO, and designed to build authority in your medical specialty.",
  },
  {
    id: 4,
    icon: "🎬",
    title: "Healthcare Video Marketing",
    description:
      "We produce educational and engaging videos that demystify medical procedures, introduce your medical team, and share patient success stories. From short social clips to full-length explainer videos, all optimized for patient education and trust-building.",
  },
  {
    id: 5,
    icon: "📧",
    title: "Patient Email Campaigns",
    description:
      "Reach your patients with HIPAA-compliant email marketing. Hyper-personalized campaigns for appointment reminders, health tips, newsletters, and follow-up care communications that nurture the patient-provider relationship.",
  },
  {
    id: 6,
    icon: "📲",
    title: "SMS Healthcare Communications",
    description:
      "Leverage SMS campaigns for appointment reminders, health alerts, and urgent care notifications. Timely, targeted messages that keep patients informed and engaged with their healthcare providers.",
  },
  {
    id: 7,
    icon: "💻",
    title: "Medical Website Development",
    description:
      "We build responsive, modern, and HIPAA-compliant websites for healthcare providers. Patient-centered UX/UI design with telemedicine integration, and accessibility compliance.",
  },
  {
    id: 8,
    icon: "🎨",
    title: "Healthcare Branding & Design",
    description:
      "From medical logos to full visual identity systems, we craft designs that communicate trust and professionalism. Patient-centered branding that differentiates your practice and builds lasting recognition.",
  },
  {
    id: 9,
    icon: "🤝",
    title: "Healthcare Consultation",
    description:
      "Expert strategic guidance to scale your digital presence in the healthcare sector. We analyze market data, create compliant marketing frameworks, and provide actionable insights for sustainable growth.",
  },
  {
    id: 10,
    icon: "🔍",
    title: "Healthcare SEO",
    description:
      "Improve your medical practice's online visibility with specialized healthcare SEO. Technical optimization, medical content strategy, local SEO for clinics, and schema markup for medical services.",
  },
  {
    id: 11,
    icon: "📊",
    title: "Healthcare Analytics & Reporting",
    description:
      "Data-driven insights specifically designed for healthcare marketing. Track patient acquisition, campaign performance, and ROI with custom dashboards that inform your medical marketing decisions.",
  },
  {
    id: 12,
    icon: "🌍",
    title: "Public Health Campaigns",
    description:
      "Strategic health communication campaigns for NGOs and public health organizations. We design awareness campaigns that educate communities, promote preventive care, and drive public health action.",
  },
];

// ================== SERVICES COMPONENT ==================
export default function Services() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section
      id="services"
      style={{
        padding: "3.5rem 1.5rem",
        background: "linear-gradient(180deg, #f8fbfd 0%, #fff 50%, #f8fbfd 100%)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div style={{ position: "absolute", top: 0, right: 0, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,185,216,0.04) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />

      {/* Section Header */}
      <div style={{ maxWidth: 750, margin: "0 auto 4rem", textAlign: "center", position: "relative", zIndex: 1 }}>
        <span style={{ display: "inline-block", color: "#00b9d8", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, padding: "5px 16px", background: "rgba(0,185,216,0.06)", borderRadius: 20, border: "1px solid rgba(0,185,216,0.1)" }}>
          What We Offer
        </span>
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", color: "#003e5b", fontWeight: 800, marginTop: 10, marginBottom: 14 }}>
          Our <span style={{ background: "linear-gradient(120deg, #00b9d8, #00D1FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Services</span>
        </h2>
      </div>

      {/* Services Grid */}
      <div
        className="services-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {servicesData.map(({ id, icon, title, description }) => {
          const isExpanded = expandedId === id;
          return (
            <article
              key={id}
              className="service-card"
              style={{
                background: "#fff",
                borderRadius: 18,
                padding: "2rem 1.8rem",
                border: "1px solid rgba(0,185,216,0.06)",
                boxShadow: "0 2px 10px rgba(0,62,91,0.04)",
                transition: "all 0.35s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 300,
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
              onClick={() => toggleExpand(id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 18px 45px rgba(0,62,91,0.1)";
                e.currentTarget.style.borderColor = "#00b9d8";
                e.currentTarget.querySelector(".card-top-line").style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,62,91,0.04)";
                e.currentTarget.style.borderColor = "rgba(0,185,216,0.06)";
                e.currentTarget.querySelector(".card-top-line").style.opacity = "0";
              }}
            >
              {/* Top gradient line */}
              <div
                className="card-top-line"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: "linear-gradient(90deg, #003e5b, #00b9d8, #00D1FF)",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
              />

              {/* Icon */}
              <div style={{ width: 58, height: 58, borderRadius: 16, background: "linear-gradient(135deg, #f0faff, #e0f4f8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.7rem", marginBottom: 18, transition: "transform 0.3s ease" }}
                className="card-icon"
              >
                {icon}
              </div>

              {/* Title */}
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#003e5b", marginBottom: 12, lineHeight: 1.3 }}>{title}</h3>

              {/* Description */}
              <p style={{ flexGrow: 1, fontSize: "0.93rem", lineHeight: 1.7, color: "#777", marginBottom: 18 }}>
                {isExpanded ? description : description.slice(0, 120) + "..."}
              </p>

              {/* Toggle */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleExpand(id); }}
                style={{
                  background: isExpanded ? "linear-gradient(135deg, #003e5b, #00b9d8)" : "transparent",
                  border: isExpanded ? "none" : "2px solid rgba(0,185,216,0.3)",
                  color: isExpanded ? "#fff" : "#00b9d8",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  padding: "9px 22px",
                  borderRadius: 25,
                  alignSelf: "flex-start",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
                onMouseEnter={(e) => {
                  if (!isExpanded) {
                    e.currentTarget.style.background = "#003e5b";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "#003e5b";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isExpanded) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#00b9d8";
                    e.currentTarget.style.borderColor = "rgba(0,185,216,0.3)";
                  }
                }}
              >
                {isExpanded ? "− Show Less" : "+ Show More"}
              </button>
            </article>
          );
        })}
      </div>

      <style>{`
        .service-card:hover .card-icon {
          transform: scale(1.1) rotate(-5deg) !important;
        }
        @media (max-width: 768px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 400px) {
          #services { padding: 3rem 1rem !important; }
        }
      `}</style>
    </section>
  );
}
