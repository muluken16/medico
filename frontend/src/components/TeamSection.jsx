import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { fetchTeam, GET_MEDIA_URL } from "../api";
import { FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

export default function TeamSection() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam()
      .then((data) => {
        setTeam(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return null;
  if (team.length === 0) return null;

  return (
    <section
      id="team"
      style={{
        padding: "6rem 0",
        background: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem", maxWidth: 700, margin: "0 auto 4rem" }}>
          <span
            style={{
              display: "inline-block",
              color: "#00b9d8",
              fontWeight: 700,
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: 12,
              padding: "5px 16px",
              background: "rgba(0,185,216,0.06)",
              borderRadius: 30,
            }}
          >
            Our Experts
          </span>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              color: "#003e5b",
              marginTop: 10,
              marginBottom: 15,
            }}
          >
            Meet the <span style={{ color: "#00b9d8" }}>Team</span>
          </h2>
          <p style={{ color: "#666", fontSize: "1.1rem", lineHeight: 1.8 }}>
            A world-class team of healthcare marketing specialists, developers, and designers working to grow your clinical presence.
          </p>
        </div>
      </div>

      <div style={{ width: "100%", padding: "20px 0" }}>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="team-swiper"
          data-testid="team-swiper"
        >
          {team.map((member) => (
            <SwiperSlide key={member.id} style={{ height: 'auto' }}>
              <div
                className="team-card"
                style={{
                  background: "#fff",
                  borderRadius: 32,
                  padding: "2.5rem 1.5rem",
                  textAlign: "center",
                  boxShadow: "0 10px 30px rgba(0,62,91,0.05)",
                  border: "1px solid rgba(0,185,216,0.05)",
                  transition: "all 0.4s ease",
                  position: "relative",
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  margin: "15px 5px",
                }}
              >
                {/* Background Shape */}
                <div 
                  style={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 150,
                    height: 150,
                    background: 'rgba(0,185,216,0.03)',
                    borderRadius: '50%',
                    zIndex: 0
                  }}
                />

                <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 130,
                      height: 130,
                      borderRadius: "50%",
                      margin: "0 auto 1.5rem",
                      padding: 5,
                      background: "linear-gradient(135deg, #00b9d8 0%, #003e5b 100%)",
                      boxShadow: "0 8px 20px rgba(0,185,216,0.15)",
                    }}
                  >
                    <img
                      src={GET_MEDIA_URL(member.image_url || member.image) || "https://via.placeholder.com/150"}
                      alt={member.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "4px solid #fff",
                      }}
                    />
                  </div>

                  <h3 style={{ color: "#003e5b", fontSize: "1.25rem", fontWeight: 800, marginBottom: 5 }}>
                    {member.name}
                  </h3>
                  <p
                    style={{
                      color: "#00b9d8",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: 15,
                    }}
                  >
                    {member.role}
                  </p>
                  <p style={{ color: "#777", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 20, flexGrow: 1 }}>
                    {member.description}
                  </p>

                  <div style={{ display: "flex", justifyContent: "center", gap: "0.8rem", marginTop: 'auto' }}>
                    {member.linkedin_url && <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" style={socialIconStyle}><FaLinkedin /></a>}
                    {member.twitter_url && <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" style={socialIconStyle}><FaTwitter /></a>}
                    {member.email && <a href={`mailto:${member.email}`} style={socialIconStyle}><FaEnvelope /></a>}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .team-swiper {
          padding: 20px 30px 60px !important;
          max-width: 1450px;
          margin: 0 auto;
        }
        
        .team-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,62,91,0.12);
          border-color: rgba(0,185,216,0.2);
        }

        .swiper-pagination-bullet {
           background: rgba(0,62,91,0.1) !important;
           opacity: 1 !important;
        }
        
        .swiper-pagination-bullet-active {
          background: #00b9d8 !important;
          width: 25px !important;
          border-radius: 5px !important;
        }
      `}</style>
    </section>
  );
}

const socialIconStyle = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f0f7fa",
  color: "#003e5b",
  fontSize: "1.1rem",
  transition: "all 0.3s ease",
  cursor: "pointer",
  textDecoration: 'none'
};
