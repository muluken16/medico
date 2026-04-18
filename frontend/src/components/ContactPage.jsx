import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import { createContactMessage } from "../api";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ loading: false, ok: null, msg: "" });
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, ok: null, msg: "" });
    try {
      await createContactMessage({ ...form, sent_at: new Date().toISOString() });
      setForm({ name: "", email: "", subject: "", message: "" });
      setStatus({ loading: false, ok: true, msg: "Message sent successfully!" });
    } catch (err) {
      setStatus({ loading: false, ok: false, msg: err.message || "Error sending message" });
    }
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "14px 16px",
    fontSize: "0.95rem",
    border: `2px solid ${focusedField === field ? "#00b9d8" : "rgba(0,62,91,0.12)"}`,
    borderRadius: 12,
    background: "#fff",
    color: "#003e5b",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "'Segoe UI', sans-serif",
    boxShadow: focusedField === field ? "0 0 0 4px rgba(0,185,216,0.08)" : "none",
  });

  const contactInfo = [
    { icon: <FaMapMarkerAlt />, title: "Visit Us", text: "Addis Ababa, Kirkos Sub-city, Aymen Building, 8th Floor, Office No. 804" },
    { icon: <FaEnvelope />, title: "Email Us", text: "contact@medicodigitals.com" },
    { icon: <FaPhone />, title: "Call Us", text: "+251 930 233 634" },
  ];

  return (
    <section
      id="contact"
      style={{
        padding: "3rem 1.5rem",
        background: "linear-gradient(180deg, #fff 0%, #f8fbfd 100%)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,185,216,0.05), transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ maxWidth: 700, margin: "0 auto 4rem", textAlign: "center", position: "relative", zIndex: 1 }}>
        <span style={{ display: "inline-block", color: "#00b9d8", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, padding: "5px 16px", background: "rgba(0,185,216,0.06)", borderRadius: 20, border: "1px solid rgba(0,185,216,0.1)" }}>
          Get In Touch
        </span>
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 800, color: "#003e5b", marginTop: 10, marginBottom: 14 }}>
          Contact <span style={{ color: "#00b9d8" }}>Us</span>
        </h2>
        <p style={{ color: "#777", fontSize: "1.05rem", lineHeight: 1.7 }}>
          Have questions about healthcare marketing? We'd love to hear from you.
        </p>
      </div>

      <div className="contact-layout" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "3rem", position: "relative", zIndex: 1 }}>
        {/* LEFT: Info cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {contactInfo.map((info, i) => (
            <div
              key={i}
              style={{
                background: "#fff", borderRadius: 16, padding: "1.5rem", display: "flex", alignItems: "center", gap: 16,
                border: "1px solid rgba(0,185,216,0.08)", boxShadow: "0 2px 10px rgba(0,62,91,0.04)",
                transition: "all 0.3s ease", cursor: "default",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,62,91,0.08)"; e.currentTarget.style.borderColor = "#00b9d8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,62,91,0.04)"; e.currentTarget.style.borderColor = "rgba(0,185,216,0.08)"; }}
            >
              <div style={{ width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg, #f0faff, #e0f4f8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00b9d8", fontSize: "1.2rem", flexShrink: 0 }}>
                {info.icon}
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "#00b9d8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{info.title}</div>
                <div style={{ fontSize: "0.95rem", color: "#003e5b", fontWeight: 500 }}>{info.text}</div>
              </div>
            </div>
          ))}

          {/* Trust card */}
          <div style={{
            background: "linear-gradient(135deg, #003e5b, #002a42)", borderRadius: 18, padding: "2rem",
            color: "#fff", marginTop: 8,
          }}>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 14 }}>Why Choose Us?</h4>
            {["Healthcare-specialized agency", "Clinically accurate messaging", "Data-driven strategies", "300+ satisfied clients"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>
                <FaCheckCircle style={{ color: "#00D1FF", flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Form */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "2.5rem", border: "1px solid rgba(0,185,216,0.08)",
          boxShadow: "0 4px 20px rgba(0,62,91,0.04)",
        }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#003e5b", marginBottom: 24 }}>Send us a message</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <input type="text" name="name" required placeholder="Your Name" value={form.name} onChange={handleChange}
                style={inputStyle("name")}
                onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)}
              />
              <input type="email" name="email" required placeholder="Your Email" value={form.email} onChange={handleChange}
                style={inputStyle("email")}
                onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
              />
            </div>
            <input type="text" name="subject" required placeholder="Subject" value={form.subject} onChange={handleChange}
              style={inputStyle("subject")}
              onFocus={() => setFocusedField("subject")} onBlur={() => setFocusedField(null)}
            />
            <textarea name="message" rows="5" required placeholder="Your Message..." value={form.message} onChange={handleChange}
              style={{ ...inputStyle("message"), resize: "vertical", minHeight: 120 }}
              onFocus={() => setFocusedField("message")} onBlur={() => setFocusedField(null)}
            />

            <button
              type="submit"
              disabled={status.loading}
              style={{
                padding: "14px 32px", border: "none", borderRadius: 12, fontSize: "1rem", fontWeight: 700, cursor: status.loading ? "not-allowed" : "pointer",
                background: "linear-gradient(135deg, #003e5b, #00b9d8)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: "0 6px 20px rgba(0,62,91,0.2)", transition: "all 0.3s ease",
                opacity: status.loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => { if (!status.loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,62,91,0.3)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,62,91,0.2)"; }}
            >
              <FaPaperPlane />
              {status.loading ? "Sending..." : "Send Message"}
            </button>

            {status.msg && (
              <div style={{
                padding: "12px 16px", borderRadius: 10, fontSize: "0.9rem", fontWeight: 600,
                background: status.ok ? "rgba(0,185,130,0.08)" : "rgba(220,50,50,0.08)",
                color: status.ok ? "#00b982" : "#dc3232",
                border: `1px solid ${status.ok ? "rgba(0,185,130,0.2)" : "rgba(220,50,50,0.2)"}`,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                {status.ok ? <FaCheckCircle /> : "⚠️"} {status.msg}
              </div>
            )}
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-layout { grid-template-columns: 1fr !important; }
          .contact-layout > div:last-child { order: -1; }
        }
      `}</style>
    </section>
  );
};

export default ContactPage;
