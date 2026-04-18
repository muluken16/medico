import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaTelegramPlane,
  FaYoutube, FaPinterestP, FaTiktok, FaTimes, FaComments, FaPaperPlane,
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowUp,
} from "react-icons/fa";

import logoImg from "../assets/logo.png";
import { api, fetchChatData } from "../api";

const socialLinks = [
  { icon: FaFacebookF, href: "https://web.facebook.com/profile.php?viewas=100000686899395&id=61559307036473" },
  { icon: FaInstagram, href: "https://www.instagram.com/medicodigitals/" },
  { icon: FaLinkedinIn, href: "https://www.linkedin.com/company/medico-digital-marketing/?viewAsMember=true" },
  { icon: FaTelegramPlane, href: "https://t.me/medicoadvert" },
  { icon: FaTiktok, href: "https://www.tiktok.com/@medicodigitals?_r=1&_t=ZS-95GXPTHSMcu" },
];

// Chatbot responses (frontend fallbacks)
const CHAT_RESPONSES = {
  "send email": "I'd be happy to help you! Please type your **Name, Contact Info, and Detailed Request** below. I will forward it directly to Medico's primary email (contact@medicodigitals.com) for an expert consultant to follow up.",
  "yes": "Excellent! Your inquiry is being sent to our marketing experts at Medico (contact@medicodigitals.com). We will get back to you shortly!",
  "services": "We offer a wide range of specialized healthcare services:\n- **Healthcare SEO**: Improving clinical trust online.\n- **Social Media**: Professional patient engagement.\n- **Content Creation**: Medically accurate blogs and patient education.\n- **Medical Branding**: Trust-centered visual identity for specialists.",
  "who are we": "We are Medico Digitals! A specialized agency of medical professionals, health communicators, and creative strategists dedicated strictly to healthcare brands.",
  "location": "You can visit us at Addis Ababa, Kirkos Sub-city, Aymen Building, 8th Floor, Office No. 804. We also operate digitally worldwide!",
  "mission": "Our mission is to transform medical expertise into accessible community action, bridging the gap between clinical excellence and the patients who seek it.",
  "pricing": "Our pricing depends on the scale and strategy of your healthcare brand. Would you like to schedule a free consultation?",
  "contact": "You can email us at contact@medicodigitals.com or call us at +251 930 233 634 / +251 978 195 262.",
  "consultation": "We offer a free initial consultation to diagnose your communication gaps. Should I forward your contact info to our team to schedule one?",
  "clients": "We work exclusively with healthcare providers: hospitals, private clinics, specialized doctors, pharmaceuticals, and health NGOs. We have successfully served over 50+ clients!",
  "websites": "Yes! We build responsive, highly professional, patient-centered websites with SEO built-in to establish your clinical authority online.",
  "social media": "We design thumb-stopping, HIPAA-compliant social media campaigns to reach your patients securely across Meta, LinkedIn, and TikTok.",
  "seo": "We optimize your clinical presence online! Our customized medical SEO strategies ensure patients find your practice when searching for specialized care in your area.",
  "default": "Thank you for reaching out! I am a programmed Medico Assist bot. Would you like me to send your message as an inquiry to our human experts at Medico?",
};

async function fetchChatResponse(messages) {
  try {
    const data = await fetchChatData(messages);
    if (data?.choices?.[0]?.message?.content) return data.choices[0].message.content.trim();
    return CHAT_RESPONSES.default;
  } catch {
    // Fallback to local responses
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
    for (const key of Object.keys(CHAT_RESPONSES)) {
      if (key !== "default" && lastMsg.includes(key)) return CHAT_RESPONSES[key];
    }
    return CHAT_RESPONSES.default;
  }
}

export default function Footer() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "👋 Hi! I am Medico Assist. How can I help you with your healthcare marketing needs today?" },
  ]);
  const [input, setInput] = useState("");
  const [showGreetingTooltip, setShowGreetingTooltip] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-pop the chat for new users when they load the website
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreetingTooltip(true);
    }, 2000); // 2 second delay before popping up bubble
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (customMessage = null) => {
    const text = customMessage || input.trim();
    if (!text || loading) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);
    const chatHistory = [
      ...messages.map((m) => ({ role: m.role, content: m.text })),
      { role: "user", content: text },
    ];
    const reply = await fetchChatResponse(chatHistory);
    setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    setLoading(false);
  };

  const quickQuestions = [
    "Who are we?", "Location", "Mission", "Pricing", "Consultation",
    "Clients", "Websites", "Social Media", "SEO", "Send email"
  ];

  const footerLinks = {
    Services: ["Healthcare SEO", "Social Media", "Content Creation", "Video Marketing", "Website Development", "Branding"],
    "Our Clients": ["Hospitals", "Clinics", "Doctors", "Pharmaceuticals", "Health NGOs", "Specialists"],
    Resources: ["Blog", "Case Studies", "Academy", "Health Guides"],
  };

  return (
    <>
      {/* ===== FOOTER ===== */}
      <footer style={{ background: "linear-gradient(180deg, #002a42 0%, #001a2e 100%)", color: "#fff", fontFamily: "'Segoe UI', sans-serif", position: "relative", overflow: "hidden" }}>
        {/* Top pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,209,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,209,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

        {/* CTA Banner */}
        <div style={{ background: "linear-gradient(135deg, #003e5b, #00536e)", padding: "4rem 2rem", textAlign: "center", position: "relative", zIndex: 1 }}>
          <h3 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, marginBottom: 15, letterSpacing: "-0.02em" }}>
            Ready to Grow Your <span style={{ color: "#00D1FF" }}>Healthcare Brand</span>?
          </h3>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.1rem", marginBottom: 30, maxWidth: 600, margin: "0 auto 35px", lineHeight: 1.6 }}>
            Let us transform your medical expertise into community action. Join our network of clinicians and specialists today.
          </p>
          
          <div style={{ maxWidth: 550, margin: "0 auto" }}>
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const email = e.target.email.value;
                if (!email) return;
                try {
                  const btn = e.target.querySelector('button');
                  btn.disabled = true;
                  btn.innerText = "Joining...";
                  await api.newsletter.subscribe(email);
                  alert("Thank you! You've successfully subscribed to our clinical marketing updates.");
                  e.target.reset();
                } catch (err) {
                  alert(err.message || "Something went wrong. Please try again.");
                } finally {
                  const btn = e.target.querySelector('button');
                  btn.disabled = false;
                  btn.innerText = "Subscribe Now";
                }
              }}
              style={{ 
                display: "flex", 
                gap: 0, 
                background: "rgba(255,255,255,0.08)", 
                padding: 6, 
                borderRadius: 16, 
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.1)"
              }}
            >
              <input 
                name="email"
                type="email" 
                placeholder="Enter your professional email..." 
                required
                style={{
                  flexGrow: 1,
                  background: "transparent",
                  border: "none",
                  padding: "15px 20px",
                  color: "#fff",
                  fontSize: "1rem",
                  outline: "none",
                  width: "100%"
                }}
              />
              <button 
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #00D1FF, #00b9d8)",
                  color: "#003e5b",
                  border: "none",
                  padding: "0 30px",
                  borderRadius: 12,
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(0.98)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(0,209,255,0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                Subscribe Now
              </button>
            </form>
            <p style={{ marginTop: 15, fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
              Join 500+ healthcare professionals receiving our weekly clinical growth strategies.
            </p>
          </div>
        </div>

        {/* Main footer content */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 2rem 2rem", position: "relative", zIndex: 1 }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(3, 1fr) 1.2fr", gap: "2.5rem", marginBottom: "2.5rem" }}>
            <div>
              <div style={{ marginBottom: 20 }}>
                <img 
                  src={logoImg} 
                  alt="Medico Digital Marketing Logo" 
                  style={{ 
                    height: "60px", width: "60px", 
                    borderRadius: "50%", 
                    objectFit: "cover",
                    border: "2px solid #00b9d8" 
                  }} 
                />
              </div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: 20 }}>
                Specialized healthcare digital marketing agency transforming medical expertise into community action.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {socialLinks.map(({ icon: Icon, href }, i) => (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{
                    width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)",
                    transition: "all 0.3s ease", textDecoration: "none", fontSize: "0.85rem",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#00D1FF"; e.currentTarget.style.color = "#003e5b"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([title, items]) => (
              <div key={title}>
                <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 16, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {items.map((item, i) => (
                    <li key={i} style={{ marginBottom: 10 }}>
                      <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.88rem", cursor: "default", transition: "color 0.3s" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#00D1FF"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
                      >{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact info */}
            <div>
              <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 16, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>Contact</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { icon: <FaMapMarkerAlt />, text: "Kirkos Sub-city, Aymen Building, 8th Floor, Office No. 804" },
                  { icon: <FaEnvelope />, text: "contact@medicodigitals.com" },
                  { icon: <FaPhone />, text: "+251 930 233 634" },
                  { icon: <FaPhone />, text: "+251 978 195 262" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.45)", fontSize: "0.85rem" }}>
                    <span style={{ color: "#00D1FF", fontSize: "0.8rem" }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem" }}>© 2025 Medico Digital Marketing. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ===== FLOATING CHAT BUTTON & TOOLTIP ===== */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
        
        {/* Conditional Greeting Bubble */}
        {showGreetingTooltip && !chatOpen && (
          <div 
            onClick={() => { setChatOpen(true); setShowGreetingTooltip(false); }}
            style={{
              background: "#fff",
              padding: "14px 20px",
              borderRadius: "20px 20px 4px 20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              border: "1px solid rgba(0,185,216,0.1)",
              color: "#333",
              fontSize: "0.95rem",
              fontWeight: 500,
              cursor: "pointer",
              animation: "messagePop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both",
              maxWidth: 250,
              lineHeight: 1.5,
            }}
          >
            👋 Hi! I am Medico Assist. How can I help you?
          </div>
        )}

        <button 
          onClick={() => { setChatOpen((o) => !o); setShowGreetingTooltip(false); }} 
          style={{
            width: 56, height: 56, borderRadius: 16, border: "none",
            background: "linear-gradient(135deg, #00D1FF, #00b9d8)", color: "#003e5b", fontSize: 22,
            cursor: "pointer", boxShadow: "0 8px 24px rgba(0,209,255,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s ease",
            alignSelf: "flex-end"
          }}
        >
          {chatOpen ? <FaTimes /> : <FaComments />}
        </button>
      </div>

      {/* ===== CHAT WINDOW ===== */}
      {chatOpen && (
        <div style={{
          position: "fixed", bottom: 85, right: 20, width: 340,
          backgroundColor: "#fff", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 999,
          maxHeight: "60vh", border: "1px solid #e0e0e0",
        }}>
          {/* Header */}
          <div style={{ background: "#003e5b", color: "#fff", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0,185,216,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>💬</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Medico Expert Support</div>
              <div style={{ fontSize: "0.7rem", opacity: 0.7 }}>Healthcare Marketing Consultants</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flexGrow: 1, padding: "12px", overflowY: "auto", background: "#f9f9f9", display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  backgroundColor: msg.role === "user" ? "#003e5b" : "#fff",
                  color: msg.role === "user" ? "#fff" : "#333",
                  padding: "8px 12px",
                  borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                  maxWidth: "80%", fontSize: "0.85rem", lineHeight: 1.5,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  border: msg.role === "assistant" ? "1px solid #eee" : "none",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 3, padding: "6px 10px", background: "#fff", borderRadius: 10, width: "fit-content", border: "1px solid #eee" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#00b9d8", animation: `typingDot 1.2s infinite ease-in-out ${i * 0.2}s` }} />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <style>{`
            @keyframes typingDot { 0%, 80%, 100% { transform: scale(0); opacity:0.3; } 40% { transform: scale(1); opacity:1; } }
          `}</style>

          {/* Quick Questions */}
          <div style={{ padding: "8px 10px", borderTop: "1px solid #eee", background: "#fff", display: "flex", flexWrap: "wrap", gap: 6 }}>
            {quickQuestions.map((q, idx) => (
              <button key={idx} onClick={() => sendMessage(q)} style={{
                background: "#fff", border: "1px solid #00b9d8", borderRadius: 20,
                padding: "4px 10px", fontSize: "0.72rem", cursor: "pointer",
                color: "#003e5b", fontWeight: 600, transition: "all 0.2s",
              }}>{q}</button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} style={{ display: "flex", padding: "8px 10px", borderTop: "1px solid #eee", gap: 8, background: "#fff" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about healthcare marketing..."
              disabled={loading}
              style={{ flexGrow: 1, border: "1px solid #ddd", borderRadius: 20, padding: "7px 12px", fontSize: "0.82rem", outline: "none" }}
            />
            <button type="submit" disabled={loading} style={{
              background: "#00b9d8", border: "none", color: "#fff",
              borderRadius: "50%", width: 34, height: 34, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <FaPaperPlane size={13} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
