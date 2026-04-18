import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaCalendarAlt } from "react-icons/fa";
import { fetchBlogPosts, GET_MEDIA_URL } from "../api";

export default function BlogCarousel() {
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  useEffect(() => {
    fetchBlogPosts()
      .then((data) => setPosts(data))
      .catch(console.error);
  }, []);

  const excerptLimit = 120;

  const togglePost = (postId) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev);
      newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
      return newSet;
    });
  };

  return (
    <section
      id="blog"
      style={{
        padding: "3rem 1.5rem",
        background: "linear-gradient(180deg, #fff 0%, #f8fbfd 100%)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem", maxWidth: 700, margin: "0 auto 3rem" }}>
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
          Insights & Tips
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
          Explore Our <span style={{ color: "#00b9d8" }}>Blog</span>
        </h2>
        <p style={{ color: "#666", fontSize: "1.05rem", lineHeight: 1.7 }}>
          Latest insights, tips & stories from our healthcare marketing experts.
        </p>
      </div>

      {/* Blog Grid */}
      {posts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999", fontSize: "1rem" }}>
          No posts yet. Check back soon!
        </p>
      ) : (
        <div
          className="blog-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {posts.map((post) => {
            const isExpanded = expandedPosts.has(post.id);
            const displayText = isExpanded
              ? post.content
              : post.excerpt?.length > excerptLimit
                ? post.excerpt.slice(0, excerptLimit) + "..."
                : post.excerpt;

            return (
              <article
                key={post.id}
                className="blog-card"
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 2px 12px rgba(0,62,91,0.06)",
                  border: "1px solid rgba(0,185,216,0.08)",
                  overflow: "hidden",
                  transition: "all 0.35s ease",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,62,91,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,62,91,0.06)";
                }}
              >
                {/* Post Image */}
                {post.image && (
                  <div style={{ width: "100%", height: 200, overflow: "hidden" }}>
                    <img
                      src={GET_MEDIA_URL(post.image_url || post.image)}
                      alt={post.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                      }}
                      className="blog-image"
                    />
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: "1.5rem", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  {/* Date */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "#00b9d8",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    <FaCalendarAlt size={12} />
                    {new Date(post.published).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>

                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "#003e5b",
                      marginBottom: 10,
                      lineHeight: 1.3,
                    }}
                  >
                    {post.title}
                  </h3>

                  <p
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: 1.7,
                      color: "#666",
                      flexGrow: 1,
                    }}
                  >
                    {displayText}
                  </p>

                  {post.content?.length > excerptLimit && (
                    <button
                      onClick={() => togglePost(post.id)}
                      style={{
                        marginTop: 12,
                        background: "none",
                        border: "none",
                        color: "#00b9d8",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: 0,
                        transition: "color 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#003e5b")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#00b9d8")}
                    >
                      {isExpanded ? (
                        <>Show Less <FaChevronUp size={12} /></>
                      ) : (
                        <>Read More <FaChevronDown size={12} /></>
                      )}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Styles */}
      <style>{`
        .blog-card:hover .blog-image {
          transform: scale(1.08) !important;
        }
        @media (max-width: 768px) {
          .blog-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
