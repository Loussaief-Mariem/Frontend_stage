import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import HeaderCarousel from "../Carousel/HeaderCarousel";
import ProductCard from "../ProductCard";
import { getProduitsPagines } from "../../services/produitService";
import { getBestSellers } from "../../services/produitService"; // Correction: utiliser produitService

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newProducts, setNewProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        // Charger les données en parallèle
        const [newProductsData, bestSellersData] = await Promise.all([
          getProduitsPagines(1, 8), // 8 nouveaux produits
          getBestSellers(8), // 8 best-sellers
        ]);

        setNewProducts(newProductsData.produits || []);
        setBestSellers(bestSellersData || []);
      } catch (err) {
        console.error("Erreur chargement page d'accueil:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ my: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box>
      {/* Niveau 1: Carousel Header */}
      <HeaderCarousel />

      {/* Niveau 2: Nouveaux Produits */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              color: "#5D4037",
              mb: 2,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            🆕 Nouveaux Produits
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "600px", margin: "0 auto", mb: 4 }}
          >
            Découvrez nos dernières arrivées et nouveautés exclusives
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {newProducts.slice(0, 4).map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product._id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>

        {newProducts.length > 4 && (
          <Box textAlign="center" mt={4}>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate("/produits")}
              sx={{
                color: "#5D4037",
                borderColor: "#5D4037",
                "&:hover": {
                  backgroundColor: "#5D4037",
                  color: "white",
                },
              }}
            >
              Voir tous les nouveaux produits
            </Button>
          </Box>
        )}
      </Container>

      {/* Niveau 3: Best Sellers */}
      <Box sx={{ backgroundColor: "#f8f5f2", py: 6 }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                color: "#5D4037",
                mb: 2,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              🏆 Best Sellers
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: "600px", margin: "0 auto" }}
            >
              Les produits les plus populaires et les mieux notés par nos
              clients
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {bestSellers.slice(0, 4).map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {bestSellers.length > 4 && (
            <Box textAlign="center" mt={4}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate("/best-sellers")}
                sx={{
                  backgroundColor: "#5D4037",
                  "&:hover": {
                    backgroundColor: "#4E342E",
                  },
                }}
              >
                Voir tous les best-sellers
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* Section CTA */}
      <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
        <Typography
          variant="h4"
          component="h3"
          sx={{ fontWeight: 700, color: "#5D4037", mb: 2 }}
        >
          Prêt à découvrir plus ?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Explorez notre catalogue complet de produits naturels et biologiques
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/produits")}
          sx={{
            backgroundColor: "#5D4037",
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
            "&:hover": {
              backgroundColor: "#4E342E",
            },
          }}
        >
          Explorer tous les produits
        </Button>
      </Container>
    </Box>
  );
};

export default HomePage;
