import React, { useState, useEffect } from "react";
import { addContact } from "../../services/contactService";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  CheckCircle,
  Lock,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";

const ContactClient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    sujet: "service client",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Vérifier si l'utilisateur est connecté au chargement du composant
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Pré-remplir l'email si l'utilisateur est connecté
        setFormData((prev) => ({
          ...prev,
          email: parsedUser.email || "",
        }));
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur:", error);
      }
    }
    setIsCheckingAuth(false);
  }, []);

  // Rediriger automatiquement si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isCheckingAuth && !user) {
      // Afficher un message d'alerte avant la redirection
      alert("Vous devez être connecté pour accéder à la page de contact.");
      navigate("/connexion", {
        state: {
          from: "/contact",
          message: "Vous devez être connecté pour nous contacter.",
        },
      });
    }
  }, [isCheckingAuth, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "L'adresse e-mail est requise";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'adresse e-mail est invalide";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Préparer les données à envoyer avec le clientId
      const contactData = {
        email: formData.email,
        sujet: formData.sujet,
        message: formData.message,
        clientId: user._id, // Utiliser l'ID de l'utilisateur connecté
      };

      await addContact(contactData);
      setSubmitStatus("success");
      setFormData({
        email: user.email || "", // Garder l'email de l'utilisateur
        sujet: "service client",
        message: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (isCheckingAuth) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Vérification de l'authentification...
          </Typography>
        </Container>
      </Layout>
    );
  }

  // Ne rien afficher si l'utilisateur n'est pas connecté (la redirection se fera automatiquement)
  if (!user) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
          <Typography variant="h6">
            Redirection vers la page de connexion...
          </Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "#5D4037",
            textAlign: "center",
            mb: 6,
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          Contactez-nous
        </Typography>

        <Grid container spacing={6}>
          {/* Section Informations de l'entreprise */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                backgroundColor: "#f8f5f2",
                borderRadius: 2,
                height: "100%",
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 700,
                  color: "#5D4037",
                  mb: 3,
                }}
              >
                Nawara
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <LocationOn sx={{ color: "#5D4037", mr: 2, mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Adresse
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Sfax, Route Gremda Km 10
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Phone sx={{ color: "#5D4037", mr: 2 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Téléphone
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      +216 44 123 432
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Email sx={{ color: "#5D4037", mr: 2 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Email
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      contact@nawara.tn
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Liste avec checkmarks */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Pourquoi nous choisir :
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <CheckCircle
                    sx={{ color: "#4CAF50", fontSize: "1rem", mr: 1.5 }}
                  />
                  <Typography variant="body2">
                    Service client exceptionnel
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <CheckCircle
                    sx={{ color: "#4CAF50", fontSize: "1rem", mr: 1.5 }}
                  />
                  <Typography variant="body2">
                    Produits de haute qualité
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <CheckCircle
                    sx={{ color: "#4CAF50", fontSize: "1rem", mr: 1.5 }}
                  />
                  <Typography variant="body2">Livraison rapide</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckCircle
                    sx={{ color: "#4CAF50", fontSize: "1rem", mr: 1.5 }}
                  />
                  <Typography variant="body2">Support 24/7</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Section Formulaire de contact */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 700,
                  color: "#5D4037",
                  mb: 3,
                }}
              >
                Envoyez-nous un message
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="sujet-label">Sujet</InputLabel>
                  <Select
                    labelId="sujet-label"
                    id="sujet"
                    name="sujet"
                    value={formData.sujet}
                    onChange={handleChange}
                    label="Sujet"
                  >
                    <MenuItem value="service client">Service client</MenuItem>
                    <MenuItem value="webmaster">Webmaster</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Adresse e-mail"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#C29788" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  multiline
                  rows={5}
                  id="message"
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  error={!!errors.message}
                  helperText={errors.message}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    mt: 2,
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
                  {isSubmitting ? "Envoi en cours..." : "Envoyer"}
                </Button>

                {submitStatus === "success" && (
                  <Alert severity="success" sx={{ mt: 3 }}>
                    Votre message a été envoyé avec succès!
                  </Alert>
                )}

                {submitStatus === "error" && (
                  <Alert severity="error" sx={{ mt: 3 }}>
                    Une erreur s'est produite lors de l'envoi. Veuillez
                    réessayer.
                  </Alert>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default ContactClient;
