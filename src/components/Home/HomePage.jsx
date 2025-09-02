import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import HeaderCarousel from "../Carousel/HeaderCarousel";
import ProductCard from "../ProductCard";
import { getProduitsPagines } from "../../services/produitService";
import { getBestSellers } from "../../services/produitService";
import Layout from "../Layout/Layout";

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
          getProduitsPagines(1, 4), // 4 nouveaux produits seulement
          getBestSellers(4), // 4 best-sellers
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
      <Layout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ my: 4 }}>
            {error}
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 6.25 }}> {/* 50px = 6.25 * 8px (theme spacing) */}
        {/* Niveau 1: Carousel Header */}
        <HeaderCarousel />

        {/* Niveau 2: Nouveaux Produits */}
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Box sx={{ textAlign: "left", mb: 6 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                color: "#5D4037",
                mb: 3,
                fontSize: { xs: "1.8rem", md: "2.2rem" },
              }}
            >
              Nouveautés
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: "600px",
                margin: "0",
                mb: 6,
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: 400,
              }}
            >
              Découvrez nos dernières arrivées et nouveautés exclusives
            </Typography>
          </Box>

          <Grid container spacing={2} justifyContent="center">
            {newProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Niveau 3: Best Sellers */}
        <Container maxWidth="xl" sx={{ py: 8, backgroundColor: "#f8f5f2" }}>
          <Box sx={{ textAlign: "left", mb: 6 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                color: "#5D4037",
                mb: 3,
                fontSize: { xs: "1.8rem", md: "2.2rem" },
              }}
            >
              Meilleures Ventes
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: "600px",
                margin: "0",
                mb: 6,
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: 400,
              }}
            >
              Découvrez nos produits les plus populaires et appréciés par nos
              clients
            </Typography>
          </Box>

          <Grid container spacing={2} justifyContent="center">
            {bestSellers.length > 0 ? (
              bestSellers.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign="center"
                >
                  Aucun best-seller disponible pour le moment.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default HomePage;
