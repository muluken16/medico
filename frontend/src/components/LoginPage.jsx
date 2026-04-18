import React, { useState, useEffect } from "react";
import { 
  Box, Container, Typography, TextField, Button, Paper, Alert,
  InputAdornment, IconButton, CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined, PersonOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("adminToken")) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(username, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.");
    }
    setLoading(false);
  };

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      background: "linear-gradient(135deg, #001a2e 0%, #003e5b 100%)",
      py: 10
    }}>
      <Container maxWidth="xs">
        <Paper elevation={24} sx={{ p: 4, borderRadius: 4, textAlign: "center", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)" }}>
          <Box sx={{ 
            width: 60, height: 60, borderRadius: "50%", bgcolor: "#00D1FF", 
            display: "flex", alignItems: "center", justifyContent: "center", 
            mx: "auto", mb: 2, boxShadow: "0 8px 20px rgba(0,209,255,0.3)" 
          }}>
            <LockOutlined sx={{ color: "#fff" }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: "#003e5b" }}>
            Admin Portal
          </Typography>
          <Typography variant="body2" sx={{ color: "#666", mb: 4 }}>
            Enter your superuser credentials to manage Medico Marketing content.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3, textAlign: "left" }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline sx={{ color: "#00b9d8" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "#00b9d8" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 4 }}
            />
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ 
                py: 1.5, borderRadius: 2, fontWeight: 700,
                background: "linear-gradient(135deg, #00D1FF, #00b9d8)",
                boxShadow: "0 10px 25px rgba(0,209,255,0.3)",
                "&:hover": { transform: "translateY(-2px)", boxShadow: "0 15px 35px rgba(0,209,255,0.4)" },
                transition: "all 0.3s ease",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
