import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { api, GET_MEDIA_URL } from "../api";

export default function GallerySection() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.gallery.list()
      .then((data) => {
        setImages(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gallery Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <section id="gallery" style={{ 
      padding: "6rem 0", 
      background: "#fff",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      overflow: "hidden"
    }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Gallery Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ 
            display: "inline-block", color: "#00b9d8", fontWeight: 700, fontSize: "0.85rem", 
            textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12, 
            padding: "5px 16px", background: "rgba(0,185,216,0.06)", borderRadius: 30 
          }}>
            Portfolio
          </span>
          <h2 style={{ 
            fontSize: "clamp(2.2rem, 6vw, 3.5rem)", 
            fontWeight: 900, 
            color: "#003e5b", 
            marginTop: 10, 
            marginBottom: 15,
            letterSpacing: "-0.02em"
          }}>
            A Glimpse Into <span style={{ color: "#00b9d8", position: 'relative' }}>
              Excellence
              <span style={{ 
                position: 'absolute', bottom: 5, left: 0, width: '100%', height: '8px', 
                background: 'rgba(0,185,216,0.1)', zIndex: -1 
              }}></span>
            </span>
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#666", maxWidth: 700, margin: "0 auto", lineHeight: 1.8 }}>
            Discover our latest transformations and healthcare marketing success stories through our premium clinical carousel.
          </p>
        </div>
      </div>

      <div style={{ width: "100%", padding: "20px 0" }}>
        {images.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", background: "#f8fbfd", borderRadius: 32, margin: "0 1.5rem" }}>
            <p style={{ color: "#999", fontSize: "1.1rem" }}>Our collection of excellence starts here.</p>
          </div>
        ) : (
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="gallery-swiper"
            data-testid="gallery-swiper"
          >
            {images.map((image) => (
              <SwiperSlide key={image.id}>
                <div 
                  className="gallery-card"
                  style={{
                    height: 450,
                    borderRadius: 32,
                    overflow: "hidden",
                    position: "relative",
                    background: "#f0f0f0",
                    transition: "all 0.4s ease",
                    cursor: "pointer",
                    boxShadow: "0 15px 45px rgba(0,62,91,0.08)"
                  }}
                >
                  <img 
                    src={GET_MEDIA_URL(image.image_url || image.image)} 
                    alt={image.title || "Gallery Item"} 
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover",
                      transition: "transform 0.8s ease" 
                    }}
                    className="gallery-img"
                  />
                  <div className="gallery-overlay">
                    <div className="overlay-content">
                      {image.title && <h3 className="overlay-title">{image.title}</h3>}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <style>{`
        .gallery-swiper {
          padding: 30px 0 60px !important;
          width: 100% !important;
          max-width: 1400px;
          margin: 0 auto;
        }

        .swiper-slide {
          opacity: 1 !important;
          transform: none !important;
        }

        .gallery-card:hover .gallery-img {
          transform: scale(1.05);
        }

        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,62,91,0.7) 0%, transparent 70%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 2.5rem;
          opacity: 0;
          transition: all 0.4s ease;
          backdrop-filter: blur(2px);
        }

        .gallery-card:hover .gallery-overlay {
          opacity: 1;
        }

        .overlay-title {
          margin: 0;
          color: #fff;
          font-weight: 800;
          font-size: 1.4rem;
          transform: translateY(15px);
          transition: transform 0.4s ease;
        }

        .gallery-card:hover .overlay-title {
          transform: translateY(0);
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

        @media (max-width: 768px) {
          .gallery-card { height: 350px !important; }
        }
      `}</style>
    </section>
  );
}
