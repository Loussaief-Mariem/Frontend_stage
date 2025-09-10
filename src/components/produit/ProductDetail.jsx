import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Divider,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Home, Category, ShoppingCart, ArrowBack } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getProduitById } from "../../services/produitService";
import { ajouterArticleLocal } from "../../services/panierService";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError("");

        // Récupérer les détails du produit
        const productData = await getProduitById(productId);
        setProduct(productData);
      } catch (err) {
        console.error("Erreur lors du chargement du produit:", err);
        setError("Erreur lors du chargement du produit. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);

      // Utiliser le service panier local
      ajouterArticleLocal(product, 1);

      enqueueSnackbar(`${product.nom} ajouté au panier!`, {
        variant: "success",
        autoHideDuration: 2000,
      });

      // Mettre à jour le compteur
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      enqueueSnackbar("Erreur lors de l'ajout au panier", { variant: "error" });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-TN", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(price);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, mt: 15 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress size={60} sx={{ color: "#5D4037" }} />
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, mt: 15 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Produit non trouvé"}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ color: "#5D4037" }}
        >
          Retour
        </Button>
      </Container>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock =
    product.stock > 0 && product.stock <= product.seuilAlertStock;

  return (
    <Container maxWidth="xl" sx={{ py: 4, mt: 15 }}>
      {/* Fil d'Ariane */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
          sx={{ display: "flex", alignItems: "center", fontSize: "0.9rem" }}
        >
          <Home sx={{ mr: 0.5, fontSize: 18 }} />
          Accueil
        </Link>
        {product.categorieId && (
          <Link
            color="inherit"
            href={`/categorie/${product.categorieId._id}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/categorie/${product.categorieId._id}`);
            }}
            sx={{ display: "flex", alignItems: "center", fontSize: "0.9rem" }}
          >
            <Category sx={{ mr: 0.5, fontSize: 18 }} />
            {product.categorieId.nom}
          </Link>
        )}
        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center", fontSize: "0.9rem" }}
        >
          {product.nom}
        </Typography>
      </Breadcrumbs>

      {/* Bouton retour */}
      <Button
        startIcon={<ArrowBack />}
        onClick={handleBack}
        sx={{ mb: 3, color: "#5D4037" }}
      >
        Retour
      </Button>

      {/* Détails du produit */}
      <Grid container spacing={4}>
        {/* Image du produit */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f8f5f2",
              borderRadius: 2,
              p: 3,
              height: "400px",
              overflow: "hidden",
            }}
          >
            <img
              src={
                product.image ||
                "https://via.placeholder.com/400x400?text=Image+Non+Disponible"
              }
              alt={product.nom}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x400?text=Image+Non+Disponible";
              }}
            />
          </Box>
        </Grid>

        {/* Informations du produit */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            {product.categorieId && (
              <Chip
                label={product.categorieId.nom}
                sx={{
                  backgroundColor: "#f8f5f2",
                  color: "#5D4037",
                  fontWeight: 600,
                  mb: 2,
                }}
              />
            )}

            {isOutOfStock && (
              <Chip
                label="Rupture de stock"
                color="error"
                sx={{ mb: 2, ml: 1 }}
              />
            )}
            {isLowStock && !isOutOfStock && (
              <Chip label="Stock bas" color="warning" sx={{ mb: 2, ml: 1 }} />
            )}
          </Box>

          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: "#5D4037",
              fontWeight: 700,
              mb: 2,
              fontSize: isMobile ? "1.8rem" : "2.5rem",
            }}
          >
            {product.nom}
          </Typography>

          <Typography
            variant="h4"
            sx={{
              color: "#5D4037",
              fontWeight: 700,
              mb: 3,
            }}
          >
            {formatPrice(product.prix)} TND
          </Typography>

          {product.description && (
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                lineHeight: 1.6,
                color: "text.secondary",
              }}
            >
              {product.description}
            </Typography>
          )}

          {/* Informations supplémentaires */}
          <Box sx={{ mb: 3 }}>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Référence:</strong> {product.reference}
            </Typography>

            {product.volume && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Volume:</strong> {product.volume}
              </Typography>
            )}

            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Stock disponible:</strong> {product.stock} unité
              {product.stock !== 1 ? "s" : ""}
            </Typography>

            <Typography variant="body2">
              <strong>TVA:</strong> {product.TVA}%
            </Typography>
          </Box>

          {/* Bouton d'action */}
          <Button
            variant="contained"
            size="large"
            startIcon={
              addingToCart ? <CircularProgress size={20} /> : <ShoppingCart />
            }
            onClick={handleAddToCart}
            disabled={isOutOfStock || addingToCart}
            sx={{
              backgroundColor: "#5D4037",
              "&:hover": { backgroundColor: "#4E342E" },
              "&:disabled": { backgroundColor: "grey.300" },
              py: 1.5,
              px: 4,
              fontSize: "1.1rem",
            }}
          >
            {addingToCart
              ? "Ajout en cours..."
              : isOutOfStock
              ? "Rupture de stock"
              : "Ajouter au panier"}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
