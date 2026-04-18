import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Container, CircularProgress } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { fetchVideoPosts } from "../api";

const VideoCard = ({ video }) => {
  const [isReady, setIsReady] = useState(false);
  const isExternal = !!video.video_url;

  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const vid = url.split("v=")[1] || url.split("/").pop();
      return `https://www.youtube.com/embed/${vid}?autoplay=1&mute=1&loop=1&playlist=${vid}`;
    }
    if (url.includes("tiktok.com")) {
      const parts = url.split("/");
      const tid = parts[parts.length - 1].split("?")[0];
      return `https://www.tiktok.com/embed/v2/${tid}`;
    }
    return url;
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {!isReady && (
        <Box 
          sx={{ 
            position: "absolute", inset: 0, zIndex: 1, 
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#001a30",
          }}
        >
          <CircularProgress size={40} sx={{ color: "#00D1FF" }} />
        </Box>
      )}

      {isExternal ? (
        <iframe
          src={getEmbedUrl(video.video_url)}
          onLoad={() => setIsReady(true)}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: isReady ? "block" : "none"
          }}
          allow="autoplay; encrypted-media; fullscreen"
        />
      ) : (
        <video
          src={video.video_full_url}
          onLoadedData={() => setIsReady(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isReady ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
          loop
          playsInline
          muted
          autoPlay
        />
      )}
      
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 3,
          zIndex: 2,
          background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
          color: "#fff",
          pointerEvents: "none"
        }}
      >
        {video.is_ai_generated && (
          <Typography
            sx={{
              display: "inline-block",
              bgcolor: "#00D1FF",
              color: "#000",
              px: 1,
              py: 0.5,
              borderRadius: "4px",
              fontSize: "0.7rem",
              fontWeight: 800,
              mb: 1,
              textTransform: "uppercase",
            }}
          >
            AI Generated
          </Typography>
        )}
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {video.title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {video.description}
        </Typography>
      </Box>
    </Box>
  );
};

const VideoSection = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideoPosts()
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#00D1FF" }} />
      </Box>
    );
  }

  if (videos.length === 0) return null;

  return (
    <Box
      id="videos"
      component="section"
      sx={{
        py: 10,
        backgroundColor: "#001a30",
        color: "#fff",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontWeight: 900,
            mb: 6,
            background: "linear-gradient(120deg, #fff, #00D1FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Featured Video Insights
        </Typography>

        <Box
          sx={{
            height: { xs: "600px", md: "750px" },
            maxWidth: "420px",
            mx: "auto",
            position: "relative",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            borderRadius: "24px",
            border: "4px solid #002b3d",
            overflow: "hidden",
          }}
        >
          <Swiper
            direction={"vertical"}
            pagination={{ clickable: true }}
            modules={[Pagination, Mousewheel]}
            mousewheel={true}
            style={{ width: "100%", height: "100%" }}
            onSlideChange={(swiper) => {
                const allVideos = document.querySelectorAll('video');
                allVideos.forEach(v => v.pause());
                const activeSlide = swiper.slides[swiper.activeIndex];
                const activeVideo = activeSlide.querySelector('video');
                if (activeVideo) activeVideo.play();
            }}
          >
            {videos.map((v) => (
              <SwiperSlide key={v.id}>
                <VideoCard video={v} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Container>
    </Box>
  );
};

export default VideoSection;
