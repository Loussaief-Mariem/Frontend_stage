import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  Grid,
} from "@mui/material";
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  getNombreArticles,
  getPanierActif,
  getPanierLocal,
  getTotalPanier,
  getNombreArticlesLocal,
} from "../../services/panierService";

const InsertPanierModal = ({ product, open, onClose }) => {
  const navigate = useNavigate();
  const [panierInfo, setPanierInfo] = useState({
    nombreArticles: 0,
    total: 0,
  });
  useEffect(() => {
    if (open && product) {
      fetchPanierInfo();
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    }
  }, [open, product]);

  const fetchPanierInfo = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (user._id) {
        // Utilisateur connecté - récupérer depuis l'API
        const panier = await getPanierActif(user._id);
        if (panier) {
          const articlesCount = await getNombreArticles(panier._id);
          const totalData = await getTotalPanier(panier._id);

          setPanierInfo({
            nombreArticles: articlesCount.nombreArticles,
            total: totalData.total,
          });
        }
      } else {
        // Visiteur - récupérer depuis le stockage local
        const panier = getPanierLocal();
        const count = getNombreArticlesLocal();

        setPanierInfo({
          nombreArticles: count,
          total: panier.total,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du panier:", error);
      // En cas d'erreur, utiliser le panier local
      const panier = getPanierLocal();
      const count = getNombreArticlesLocal();

      setPanierInfo({
        nombreArticles: count,
        total: panier.total,
      });
    }
  };
  if (!product) return null;

  const handleContinueShopping = () => {
    onClose();
  };

  const handleViewCart = () => {
    onClose();
    navigate("/panier");
  };

  // Formatage du prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-TN", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(price);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          margin: { xs: 1, sm: 2 },
          maxHeight: "90vh",
          overflow: "hidden",
        },
      }}
    >
      {/* En-tête avec titre et bouton de fermeture */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CheckCircleIcon sx={{ mr: 2, color: "#333", fontSize: 28 }} />
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              color: "#333",
              fontSize: "18px",
            }}
          >
            Produit ajouté au panier avec succès
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "#333" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Grid container>
          {/* Colonne gauche - Détails du produit */}
          <Grid item xs={12} md={6} sx={{ p: 3 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              {/* Image du produit */}
              <Box
                sx={{
                  width: "120px",
                  height: "120px",
                  margin: "0 auto 16px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #e0e0e0",
                }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.nom}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Image
                  </Typography>
                )}
              </Box>

              {/* Nom du produit */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#333",
                  mb: 1,
                  fontSize: "16px",
                }}
              >
                {product.nom}
              </Typography>

              {/* Volume du produit */}
              {product.volume && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    mb: 2,
                    fontSize: "14px",
                  }}
                >
                  {product.volume}
                </Typography>
              )}

              {/* Prix */}
              <Typography
                variant="body1"
                sx={{
                  color: "#333",
                  fontWeight: 600,
                  fontSize: "16px",
                }}
              >
                1 x {formatPrice(product.prix)} TND
              </Typography>
            </Box>
          </Grid>

          {/* Colonne droite - Résumé du panier */}
          <Grid item xs={12} md={6} sx={{ p: 3, backgroundColor: "#fafafa" }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  color: "#333",
                  mb: 2,
                  fontSize: "16px",
                }}
              >
                Il y a {panierInfo.nombreArticles} article
                {panierInfo.nombreArticles > 1 ? "s" : ""} dans votre panier.
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#333",
                    fontSize: "16px",
                  }}
                >
                  <strong>
                    {panierInfo.nombreArticles} article
                    {panierInfo.nombreArticles > 1 ? "s" : ""}
                  </strong>{" "}
                  : {formatPrice(panierInfo.total)} TND
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#333",
                  fontSize: "18px",
                }}
              >
                Total TTC : {formatPrice(panierInfo.total)} TND
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Actions - Les deux boutons */}
      <Box sx={{ p: 3, backgroundColor: "#ffffff" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleViewCart}
              fullWidth
              sx={{
                backgroundColor: "#E93E7F",
                color: "white",
                py: 1.5,
                fontWeight: 600,
                fontSize: "16px",
                textTransform: "none",
                borderRadius: "8px",
                mb: 2,
                "&:hover": {
                  backgroundColor: "#D6336C",
                },
              }}
            >
              Commander
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              onClick={handleContinueShopping}
              fullWidth
              sx={{
                borderColor: "#D3D3D3",
                color: "#333",
                py: 1.5,
                fontWeight: 600,
                fontSize: "16px",
                textTransform: "none",
                borderRadius: "8px",
                "&:hover": {
                  borderColor: "#333",
                  backgroundColor: "rgba(51, 51, 51, 0.04)",
                },
              }}
            >
              Continuer mes achats
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default InsertPanierModal;
