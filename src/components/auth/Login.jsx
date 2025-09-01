import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout"; // IMPORT AJOUTÉ

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login({ email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (onLoginSuccess) {
        onLoginSuccess(res.data.user);
      }

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Layout>
      {" "}
      {/* AJOUT DU LAYOUT */}
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4, py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 2,
          }}
        >
          {/* Logo */}
          <Avatar
            src="https://res.cloudinary.com/dx90dxjb0/image/upload/v1754422758/Capture_d_%C3%A9cran_2025-08-05_203339_tx4rmd.png"
            alt="Nawara"
            sx={{
              width: 80,
              height: 80,
              mb: 2,
              border: "2px solid #f8f5f2",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />

          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 700,
              color: "#5D4037",
              textAlign: "center",
            }}
          >
            Connexion
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: "#795548",
              textAlign: "center",
            }}
          >
            Connectez-vous à votre compte Nawara
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#C29788" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#C29788",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5D4037",
                  },
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#C29788" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 1,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#C29788",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5D4037",
                  },
                },
              }}
            />

            {/* Lien mot de passe oublié */}
            <Box sx={{ textAlign: "right", width: "100%", mb: 2 }}>
              <Button
                variant="text"
                onClick={() => navigate("/forgot-password")}
                sx={{
                  fontSize: "0.85rem",
                  color: "#795548",
                  textTransform: "none",
                  "&:hover": {
                    textDecoration: "underline",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Mot de passe oublié ?
              </Button>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1,
                mb: 2,
                py: 1.5,
                backgroundColor: "#5D4037",
                "&:hover": {
                  backgroundColor: "#4E342E",
                },
                "&:disabled": {
                  backgroundColor: "#C29788",
                },
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>

            {/* Lien inscription */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" sx={{ color: "#795548" }}>
                Pas encore de compte ?{" "}
                <Button
                  variant="text"
                  onClick={() => navigate("/register")}
                  sx={{
                    color: "#5D4037",
                    textTransform: "none",
                    fontWeight: 600,
                    p: 0,
                    minWidth: "auto",
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Créer un compte
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default Login;
