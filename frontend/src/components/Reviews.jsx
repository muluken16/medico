import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaStar, FaRegStar, FaQuoteLeft } from "react-icons/fa";
import { fetchReviews, fetchClients, GET_MEDIA_URL } from "../api";

export default function ReviewsAndClients() {
  // ======== Reviews ========
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    fetchReviews()
      .then((data) => setReviews(data))
      .catch((err) => console.error("Failed to fetch reviews:", err));
  }, []);

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) =>
      i < count ? (
        <FaStar key={i} style={{ color: "#FFB800" }} />
      ) : (
        <FaRegStar key={i} style={{ color: "#ddd" }} />
      )
    );
  };

  // ======== Clients ========
  const scrollRef = useRef(null);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchClients()
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Failed to fetch clients:", err));
  }, []);

  return (
    <>
      {/* ====== Reviews Section ====== */}
      <section
        id="reviews"
        style={{
          padding: "3rem 1.5rem",
          background: "linear-gradient(180deg, #f8fbfd 0%, #fff 100%)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto 3rem", textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              color: "#00b9d8",
              fontWeight: 700,
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 8,
              padding: "4px 14px",
              background: "rgba(0,185,216,0.08)",
              borderRadius: 20,
            }}
          >
            Testimonials
          </span>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 2.8rem)",
              fontWeight: 800,
              color: "#003e5b",
              marginTop: 8,
              marginBottom: 12,
            }}
          >
            What Our <span style={{ color: "#00b9d8" }}>Clients Say</span>
          </h2>
          <p style={{ color: "#666", fontSize: "1.05rem", lineHeight: 1.7 }}>
            Hear from healthcare professionals who trust us with their digital growth.
          </p>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Swiper
            modules={[Autoplay, Pagination]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            spaceBetween={24}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            style={{ paddingBottom: "3rem" }}
          >
            {reviews.map(({ id, name, photo, message, rating }) => (
              <SwiperSlide key={id}>
                <div
                  style={{
                    backgroundColor: "#fff",
                    padding: "2rem",
                    borderRadius: 16,
                    boxShadow: "0 2px 12px rgba(0,62,91,0.06)",
                    border: "1px solid rgba(0,185,216,0.08)",
                    minHeight: 280,
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    transition: "all 0.35s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,62,91,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,62,91,0.06)";
                  }}
                >
                  {/* Quote */}
                  <FaQuoteLeft
                    style={{
                      color: "rgba(0,185,216,0.15)",
                      fontSize: "2rem",
                      marginBottom: 12,
                    }}
                  />

                  {/* Message */}
                  <p
                    style={{
                      fontSize: "0.95rem",
                      fontStyle: "italic",
                      color: "#555",
                      lineHeight: 1.7,
                      flexGrow: 1,
                      marginBottom: 20,
                    }}
                  >
                    "{message}"
                  </p>

                  {/* Author row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      borderTop: "1px solid #f0f0f0",
                      paddingTop: 16,
                    }}
                  >
                    <img
                      src={GET_MEDIA_URL(photo) || "https://ui-avatars.com/api/?name=" + encodeURIComponent(name) + "&background=00b9d8&color=fff"}
                      alt={name}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #00b9d8",
                      }}
                    />
                    <div>
                      <h4
                        style={{
                          color: "#003e5b",
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          margin: 0,
                        }}
                      >
                        {name}
                      </h4>
                      <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
                        {renderStars(rating)}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ====== Clients Section ====== */}
      <section
        id="clients"
        style={{
          padding: "4rem 1.5rem",
          background: "#fff",
          textAlign: "center",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto 2.5rem" }}>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
              fontWeight: 800,
              color: "#003e5b",
              marginBottom: 8,
            }}
          >
            Trusted by <span style={{ color: "#00b9d8" }}>Leading Healthcare Brands</span>
          </h2>
          <p style={{ color: "#888", fontSize: "1rem" }}>
            We're proud to partner with top healthcare organizations.
          </p>
        </div>

        <div
          ref={scrollRef}
          className="clients-scroll"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "2.5rem",
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {companies.map(({ id, name, logo_url }) => (
            <div
              key={id}
              style={{
                width: 120,
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                filter: "grayscale(80%)",
                opacity: 0.6,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "grayscale(0%)";
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "grayscale(80%)";
                e.currentTarget.style.opacity = "0.6";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <img
                src={GET_MEDIA_URL(logo_url)}
                alt={name}
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Swiper custom pagination */}
      <style>{`
        .swiper-pagination-bullet {
          background: #00b9d8 !important;
          opacity: 0.3;
        }
        .swiper-pagination-bullet-active {
          opacity: 1 !important;
        }
      `}</style>
    </>
  );
}
