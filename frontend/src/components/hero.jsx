import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  useMediaQuery,
  CircularProgress,
  IconButton
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ReactTyped } from "react-typed";
import { fetchVideoPosts } from "../api";
import { VolumeUp, VolumeOff } from "@mui/icons-material";
import heroImg from "../assets/hero.jpg";
import bgVideoMarkup from "../assets/digital-earth-background-marketing.mov";

const Hero = () => {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Video playlist logic
  const [videos, setVideos] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const bgVideoRef = useRef(null);

  useEffect(() => {
    // 1. Fetch videos
    fetchVideoPosts().then(data => {
      if (data && data.length > 0) setVideos(data);
    }).catch(console.error);

    // 2. Wait 3 seconds then show video
    const timer = setTimeout(() => setShowVideo(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Set background video speed
  useEffect(() => {
    if (bgVideoRef.current) {
      bgVideoRef.current.playbackRate = 0.5; // Slow down the earth rotation by 50%
    }
  }, []);

  const handleVideoEnd = () => {
    setCurrentIdx((prev) => (prev + 1) % videos.length);
  };

  return (
    <Box
      component="section"
      id="hero"
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: "auto", md: "100vh" },
        display: "flex",
        alignItems: "center",
        backgroundColor: "#001a2e",
        pt: "72px",
      }}
    >
      {/* Background Video */}
      <video
        ref={bgVideoRef}
        src={bgVideoMarkup}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          top: 0,
          left: 0,
          zIndex: 0,
          opacity: 0.85 
        }}
      />
      {/* Lighter overlay to let the video shine while keeping text readable */}
      <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,26,46,0.7) 0%, rgba(0,26,46,0.2) 100%)", zIndex: 1 }} />

      <Box sx={{
        position: "absolute", top: "10%", right: "-5%",
        width: "50%", height: "80%",
        background: "radial-gradient(circle, rgba(0,209,255,0.06) 0%, transparent 70%)",
        filter: "blur(60px)", zIndex: 1,
      }} />

      <Box
        sx={{
          position: "relative", zIndex: 2,
          maxWidth: 1320, mx: "auto", width: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: { xs: 6, md: 4 },
          px: { xs: 2.5, sm: 4, md: 6 },
          py: { xs: 8, md: 0 },
        }}
      >
          {/* Content Side */}
        <Box sx={{ flex: "1 1 50%", textAlign: { xs: "center", md: "left" } }}>
          <Box
            sx={{
              display: "inline-flex", alignItems: "center", gap: 1,
              px: 2, py: 0.6, mb: 3, borderRadius: "50px",
              background: "rgba(0,209,255,0.08)",
              border: "1px solid rgba(0,209,255,0.15)",
              backdropFilter: "blur(4px)",
              animation: "fadeUp 0.6s ease-out both",
            }}
          >
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#00D1FF" }} />
            <Typography sx={{ color: "#00D1FF", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Healthcare Specialized Agency
            </Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.4rem)",
              color: "#fff", lineHeight: 1.2, mb: 2.5, letterSpacing: "-0.01em",
              animation: "fadeUp 0.8s ease-out 0.1s both",
              "@keyframes fadeUp": {
                from: { opacity: 0, transform: "translateY(20px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              }
            }}
          >
            Empowering Your <br/>
            <Box component="span" sx={{
              background: "linear-gradient(120deg, #00b9d8, #00D1FF)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              <ReactTyped
                strings={["Amplifying Impact", "Medical Marketing", "Bridging the Gap", "Healthcare Growth"]}
                typeSpeed={50} backSpeed={30} loop
              />
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: "clamp(0.95rem, 1.1vw, 1.1rem)", color: "rgba(255,255,255,0.7)",
              lineHeight: 1.7, mb: 4.5, maxWidth: 580,
              mx: { xs: "auto", md: "0" },
              animation: "fadeUp 0.8s ease-out 0.2s both",
            }}
          >
            Transforming medical expertise into community action. We blend professional clinical growth with data-driven communication for healthcare leaders.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent={{ xs: "center", md: "flex-start" }}
            sx={{ animation: "fadeUp 0.8s ease-out 0.3s both" }}
          >
            <Button
              href="#services"
              variant="contained"
              sx={{
                px: 4, py: 1.6, borderRadius: "50px", fontWeight: 700,
                background: "linear-gradient(135deg, #00b9d8, #00D1FF)",
                boxShadow: "0 8px 18px rgba(0,185,216,0.2)",
                "&:hover": { background: "linear-gradient(135deg, #00D1FF, #00b9d8)" },
                transition: "all 0.35s ease",
              }}
            >
              Our Services
            </Button>
            <Button
              href="#contact"
              variant="outlined"
              sx={{
                px: 4, py: 1.6, borderRadius: "50px", fontWeight: 700,
                color: "#fff", borderColor: "rgba(255,255,255,0.15)",
                "&:hover": { borderColor: "#00D1FF", background: "rgba(0,209,255,0.04)" },
                transition: "all 0.35s ease",
              }}
            >
              Consult Now
            </Button>
          </Stack>
        </Box>

        {/* Media Side (Portrait Video Container) */}
        <Box sx={{
          flex: "1 1 45%", position: "relative",
          display: "flex", justifyContent: "center", alignItems: "center",
          animation: "fadeUp 1s ease-out 0.4s both",
        }}>
          <Box sx={{
            position: "relative", width: "100%", maxWidth: 440,
            aspectRatio: "4/5", // Shorter portrait
            borderRadius: "40px", overflow: "hidden",
            boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
            border: "1px solid rgba(0,209,255,0.1)",
            background: "#000",
          }}>
            {/* Initial Hero Image (Visible first 3 seconds) */}
            <Box 
              component="img" 
              src={heroImg} 
              sx={{
                width: "100%", height: "100%", objectFit: "cover", display: "block",
                position: "absolute", inset: 0,
                zIndex: (showVideo && videos.length > 0) ? 0 : 2,
                opacity: (showVideo && videos.length > 0) ? 0 : 1,
                transition: "opacity 1.5s ease",
              }} 
            />

            {/* Transitioning Video Player */}
            {videos.length > 0 && (
              <Box sx={{
                 position: "absolute", inset: 0, zIndex: 1,
                 opacity: showVideo ? 1 : 0, transition: "opacity 1.5s ease"
              }}>
                <video
                  ref={videoRef}
                  key={videos[currentIdx]?.id}
                  src={videos[currentIdx]?.video_full_url || videos[currentIdx]?.video_url}
                  autoPlay
                  muted={isMuted}
                  playsInline
                  onEnded={handleVideoEnd}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {/* Sound Toggle Button */}
                <IconButton 
                  onClick={() => setIsMuted(!isMuted)}
                  sx={{ 
                    position: "absolute", top: 15, left: 15, 
                    bgcolor: "rgba(0,0,0,0.5)", color: "#fff",
                    backdropFilter: "blur(4px)",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                    transition: "all 0.3s ease",
                    zIndex: 10
                  }}
                >
                  {isMuted ? <VolumeOff />: <VolumeUp />}
                </IconButton>
                {/* AI Label overlay */}
                {videos[currentIdx]?.is_ai_generated && (
                   <Typography sx={{
                     position: "absolute", top: 20, right: 20,
                     bgcolor: "#00D1FF", color: "#000", px: 1, py: 0.5, borderRadius: 1,
                     fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase"
                   }}>
                     AI Insights
                   </Typography>
                )}
                <Box sx={{
                  position: "absolute", bottom: 0, left: 0, right: 0, p: 3,
                  background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                  color: "#fff"
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{videos[currentIdx]?.title}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>{videos[currentIdx]?.description}</Typography>
                </Box>
              </Box>
            )}

            <Box sx={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,26,46,0.2) 0%, transparent 40%)",
              pointerEvents: "none"
            }} />
          </Box>
          
          {/* Decorative spinning ring */}
          <Box sx={{
            position: "absolute", top: -30, right: -10,
            width: 140, height: 140,
            borderRadius: "50%", border: "2px dashed rgba(0,209,255,0.15)",
            animation: "spinSlow 30s linear infinite",
            zIndex: -1,
            "@keyframes spinSlow": { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } }
          }} />
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
