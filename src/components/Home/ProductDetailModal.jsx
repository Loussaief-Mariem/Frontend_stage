// components/ProductDetailModal.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  Grid,
  IconButton,
  Rating,
} from "@mui/material";
import {
  Close as CloseIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { ajouterArticleLocal } from "../../services/panierService";

const ProductDetailModal = ({ product, open, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();

  if (!product) return null;

  // Vérifier si le produit est en stock
  const isOutOfStock = product.stock <= 0;
  const isLowStock =
    product.stock > 0 && product.stock <= product.seuilAlertStock;
  const shouldDisableButton = isOutOfStock || isLowStock;

  // Formatage du prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-TN", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(price);
  };

  // Ajouter au panier depuis le modal
  const handleAddToCart = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (user._id) {
        // Utilisateur connecté - ouvrir le modal d'insertion panier
        // Vous devrez gérer cela via un état parent ou un contexte
        enqueueSnackbar(
          "Fonctionnalité pour utilisateurs connectés à implémenter",
          {
            variant: "info",
          }
        );
      } else {
        // Visiteur - utiliser le stockage local
        ajouterArticleLocal(product, 1);

        enqueueSnackbar(`${product.nom} ajouté au panier!`, {
          variant: "success",
          autoHideDuration: 2000,
        });

        // Déclencher la mise à jour du compteur
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      enqueueSnackbar("Erreur lors de l'ajout au panier", { variant: "error" });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          margin: { xs: 1, sm: 2 },
          maxHeight: "95vh",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* En-tête avec bouton de fermeture */}
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
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 600,
            color: "#333",
            fontSize: "1.1rem",
          }}
        >
          Détails du produit
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "#666",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Grid container>
          {/* Colonne gauche - Image du produit */}
          <Grid item xs={12} md={6} sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "350px",
                  height: "300px",
                  margin: "0 auto",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #e9ecef",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.nom}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      padding: "16px",
                    }}
                  />
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.9rem" }}
                  >
                    Image non disponible
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Colonne droite - Détails du produit */}
          <Grid item xs={12} md={6} sx={{ p: 4, backgroundColor: "#fafafa" }}>
            {/* Badges de statut */}
            <Box sx={{ mb: 2 }}>
              {isOutOfStock && (
                <Chip
                  label="Rupture de stock"
                  color="error"
                  size="small"
                  sx={{
                    mr: 1,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              )}
              {isLowStock && !isOutOfStock && (
                <Chip
                  label="Stock bas"
                  color="warning"
                  size="small"
                  sx={{
                    mr: 1,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              )}
              {product.totalVentes > 50 && (
                <Chip
                  label="Best Seller"
                  color="success"
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              )}
            </Box>

            {/* Nom du produit */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#333",
                mb: 1.5,
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                lineHeight: 1.3,
              }}
            >
              {product.nom}
            </Typography>

            {/* Catégorie */}
            {product.categorieId && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                Catégorie: {product.categorieId.nom}
              </Typography>
            )}

            {/* Prix */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#5D4037",
                mb: 2,
                fontSize: { xs: "1.4rem", md: "1.6rem" },
              }}
            >
              {formatPrice(product.prix)} TND
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Description */}
            {product.description && (
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: "#333",
                    fontSize: "0.9rem",
                  }}
                >
                  Description
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1.6,
                    color: "#666",
                    fontSize: "0.85rem",
                  }}
                >
                  {product.description}
                </Typography>
              </Box>
            )}

            {/* Volume */}
            {product.volume && (
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: "#333",
                    fontSize: "0.9rem",
                  }}
                >
                  Volume
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    fontSize: "0.85rem",
                  }}
                >
                  {product.volume}
                </Typography>
              </Box>
            )}

            {/* Stock */}
            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: "#333",
                  fontSize: "0.9rem",
                }}
              >
                Stock disponible
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isOutOfStock
                    ? "error.main"
                    : isLowStock
                    ? "warning.main"
                    : "success.main",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                {isOutOfStock
                  ? "Rupture de stock"
                  : `${product.stock} unités disponibles`}
              </Typography>
            </Box>

            {/* Référence */}
            {product.reference && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "0.8rem" }}
                >
                  Référence: {product.reference}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      {/* Actions */}
      <Box
        sx={{
          p: 4,
          backgroundColor: "#ffffff",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              onClick={onClose}
              fullWidth
              sx={{
                borderColor: "#D3D3D3",
                color: "#333",
                py: 1.5,
                fontWeight: 600,
                fontSize: "0.9rem",
                textTransform: "none",
                borderRadius: "8px",
                "&:hover": {
                  borderColor: "#333",
                  backgroundColor: "rgba(51, 51, 51, 0.04)",
                },
              }}
            >
              Retour aux produits
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              onClick={handleAddToCart}
              disabled={shouldDisableButton}
              fullWidth
              startIcon={<ShoppingCartIcon />}
              sx={{
                backgroundColor: "#5D4037",
                color: "white",
                py: 1.5,
                fontWeight: 600,
                fontSize: "0.9rem",
                textTransform: "none",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#4E342E",
                },
                "&:disabled": {
                  backgroundColor: "grey.300",
                  color: "grey.500",
                },
              }}
            >
              {shouldDisableButton
                ? "Produit indisponible"
                : "Ajouter au panier"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default ProductDetailModal;
