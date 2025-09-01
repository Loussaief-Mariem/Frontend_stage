import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  InputAdornment,
  MenuItem,
  Grid,
  IconButton,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Wc as WcIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { register } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    telephone: "",
    genre: "",
    adresse: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fonction de validation des champs
  const validateForm = () => {
    const errors = {};

    if (!formData.nom.trim()) errors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) errors.prenom = "Le prénom est requis";

    if (!formData.email.trim()) errors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email invalide";

    if (!formData.password) errors.password = "Le mot de passe est requis";
    else if (formData.password.length < 6)
      errors.password = "Le mot de passe doit contenir au moins 6 caractères";

    if (!formData.telephone.trim())
      errors.telephone = "Le téléphone est requis";
    else if (!/^\d{8}$/.test(formData.telephone))
      errors.telephone = "Le téléphone doit contenir exactement 8 chiffres";

    if (!formData.genre) errors.genre = "Le genre est requis";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation des champs
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      setSuccess(
        "Inscription réussie ! Vous pouvez maintenant vous connecter."
      );
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        telephone: "",
        genre: "",
        adresse: "",
      });

      // Redirection automatique après 2 secondes
      setTimeout(() => {
        navigate("/connexion");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation en temps réel pour le téléphone (uniquement des chiffres)
    if (name === "telephone") {
      // Autoriser uniquement les chiffres
      const numericValue = value.replace(/\D/g, "");
      // Limiter à 8 chiffres maximum
      const limitedValue = numericValue.slice(0, 8);

      setFormData({
        ...formData,
        [name]: limitedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Effacer l'erreur du champ quand l'utilisateur commence à taper
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: "",
      });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Layout>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, py: 4 }}>
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
          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 3, fontWeight: 700, color: "#5D4037" }}
          >
            Créer un compte
          </Typography>

          <Typography
            variant="body2"
            sx={{ mb: 3, color: "#795548", textAlign: "center" }}
          >
            Rejoignez la communauté Nawara
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="prenom"
                  label="Prénom"
                  name="prenom"
                  autoComplete="given-name"
                  value={formData.prenom}
                  onChange={handleChange}
                  error={!!fieldErrors.prenom}
                  helperText={fieldErrors.prenom}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "#C29788" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="nom"
                  label="Nom"
                  name="nom"
                  autoComplete="family-name"
                  value={formData.nom}
                  onChange={handleChange}
                  error={!!fieldErrors.nom}
                  helperText={fieldErrors.nom}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "#C29788" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Adresse email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "#C29788" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="telephone"
                  label="Numéro de téléphone"
                  name="telephone"
                  autoComplete="tel"
                  value={formData.telephone}
                  onChange={handleChange}
                  error={!!fieldErrors.telephone}
                  helperText={fieldErrors.telephone}
                  placeholder="12345678"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: "#C29788" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  select
                  id="genre"
                  label="Genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  error={!!fieldErrors.genre}
                  helperText={fieldErrors.genre}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WcIcon sx={{ color: "#C29788" }} />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="">Sélectionnez votre genre</MenuItem>
                  <MenuItem value="M">Masculin</MenuItem>
                  <MenuItem value="F">Féminin</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="adresse"
                  label="Adresse"
                  name="adresse"
                  autoComplete="street-address"
                  value={formData.adresse}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon sx={{ color: "#C29788" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password}
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
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                backgroundColor: "#5D4037",
                "&:hover": { backgroundColor: "#4E342E" },
                "&:disabled": { backgroundColor: "#C29788" },
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {loading ? "Inscription en cours..." : "S'inscrire"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button
                variant="text"
                onClick={() => navigate("/connexion")}
                sx={{
                  color: "#5D4037",
                  textTransform: "none",
                  "&:hover": {
                    textDecoration: "underline",
                    backgroundColor: "transparent",
                  },
                }}
              >
                ← Déjà un compte ? Se connecter
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default Register;
