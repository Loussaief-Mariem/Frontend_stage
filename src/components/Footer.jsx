import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Facebook,
  Instagram,
  Twitter,
} from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const openFacebook = () => {
    window.open("https://www.facebook.com/?locale=fr_FR", "_blank");
  };
  const openInstagram = () => {
    window.open("https://www.instagram.com/", "_blank");
  };
  const openTwitter = () => {
    window.open("https://x.com/?lang=fr", "_blank");
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#FDF2F8",
        color: "#5D4037",
        py: 6,
        mt: "auto",
        borderTop: "1px solid #EDE7E3",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo et description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <img
                src="https://res.cloudinary.com/dx90dxjb0/image/upload/v1754422758/Capture_d_%C3%A9cran_2025-08-05_203339_tx4rmd.png"
                alt="Nawara Logo"
                style={{ width: 70, height: 70, marginRight: 10 }}
              />
              <Typography variant="h6" fontWeight="bold">
                Nawara
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Vente de produits cosmétiques naturels et de qualité pour prendre
              soin de votre peau.
            </Typography>
            <Box>
              <IconButton
                aria-label="Facebook"
                sx={{ color: "#5D4037" }}
                onClick={openFacebook}
              >
                <Facebook />
              </IconButton>
              <IconButton
                aria-label="Instagram"
                sx={{ color: "#5D4037" }}
                onClick={openInstagram}
              >
                <Instagram />
              </IconButton>
              <IconButton
                aria-label="Twitter"
                sx={{ color: "#5D4037" }}
                onClick={openTwitter}
              >
                <Twitter />
              </IconButton>
            </Box>
          </Grid>

          {/* Liens rapides et Contact côte à côte */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {/* Liens rapides */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Liens Rapides
                </Typography>
                <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
                  <Typography variant="body2">Accueil</Typography>
                </Link>
                <Link
                  href="/panier"
                  color="inherit"
                  display="block"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2">Mon Panier</Typography>
                </Link>
                <Link
                  href="/commandes"
                  color="inherit"
                  display="block"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2">Mes Commandes</Typography>
                </Link>
              </Grid>

              {/* Informations de contact */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Contact
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    Sfax, Route Gremda Km 10
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PhoneIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">+216 44 123 432</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">contact@nawara.tn</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: "1px solid #EDE7E3",
            pt: 3,
            mt: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} Nawara - Tous droits réservés
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Merci pour votre confiance !
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
