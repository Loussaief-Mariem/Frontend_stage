// components/ProductCard.jsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Button,
  Chip,
  Tooltip,
} from "@mui/material";
import { ShoppingCart, Visibility, LocalMall } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import ProductDetailModal from "../components/Home/ProductDetailModal";
import { ajouterArticleLocal } from "../services/panierService";

const ProductCard = ({ product, showActions = true }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [imageError, setImageError] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Vérifier si le produit est en stock
  const isOutOfStock = product.stock <= 0;
  const isLowStock =
    product.stock > 0 && product.stock <= product.seuilAlertStock;
  const shouldDisableButton = isOutOfStock || isLowStock;

  // Ajouter au panier
  // Ajouter au panier - TOUJOURS utiliser le localStorage
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (shouldDisableButton) return;

    try {
      setIsAddingToCart(true);

      // TOUJOURS utiliser le stockage local, même pour les utilisateurs connectés
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
      setIsAddingToCart(false);
    }
  };

  // Ouvrir le modal de détail
  const handleViewDetails = (e) => {
    e.stopPropagation();
    setDetailModalOpen(true);
  };

  // Fermer le modal de détail
  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
  };

  // Voir les détails (navigation)
  const handleCardClick = () => {
    navigate(`/produit/${product._id}`);
  };

  // Formatage du prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-TN", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(price);
  };

  // Image de remplacement en cas d'erreur
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          cursor: "pointer",
          position: "relative",
          overflow: "visible",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            "& .product-image": {
              transform: "scale(1.05)",
            },
            "& .product-actions": {
              opacity: 1,
              transform: "translateY(0)",
            },
          },
        }}
        onClick={handleCardClick}
      >
        {/* Badges */}
        <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}>
          {isOutOfStock && (
            <Chip
              label="Rupture"
              size="small"
              color="error"
              sx={{ fontWeight: "bold", fontSize: "0.7rem" }}
            />
          )}
          {isLowStock && !isOutOfStock && (
            <Chip
              label="Stock bas"
              size="small"
              color="warning"
              sx={{ fontWeight: "bold", fontSize: "0.7rem" }}
            />
          )}
          {product.totalVentes > 50 && (
            <Chip
              label="Best Seller"
              size="small"
              color="success"
              sx={{ fontWeight: "bold", fontSize: "0.7rem", ml: 0.5 }}
            />
          )}
        </Box>

        {/* Image du produit */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            height: "160px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardMedia
            component="img"
            image={
              imageError || !product.image
                ? "https://via.placeholder.com/300x160?text=Image+Non+Disponible"
                : product.image
            }
            alt={product.nom}
            onError={handleImageError}
            className="product-image"
            sx={{
              transition: "transform 0.3s ease",
              objectFit: "contain",
              width: "100%",
              height: "100%",
              maxWidth: "100%",
              maxHeight: "100%",
              padding: "6px",
            }}
          />

          {/* Overlay actions */}
          {showActions && (
            <Box
              className="product-actions"
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "rgba(0,0,0,0.7)",
                padding: 1,
                opacity: 0,
                transform: "translateY(100%)",
                transition: "all 0.3s ease",
                display: "flex",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <Tooltip title="Voir détails">
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255,255,255,0.2)",
                  }}
                  onClick={handleViewDetails}
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip
                title={
                  shouldDisableButton
                    ? "Produit indisponible"
                    : "Ajouter au panier"
                }
              >
                <span>
                  <IconButton
                    size="small"
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255,255,255,0.2)",
                    }}
                    onClick={handleAddToCart}
                    disabled={shouldDisableButton || isAddingToCart}
                  >
                    <ShoppingCart fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* Contenu de la carte */}
        <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
          {/* Catégorie */}
          {product.categorieId && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.5, fontSize: "0.65rem" }}
            >
              {product.categorieId.nom}
            </Typography>
          )}

          {/* Nom du produit */}
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              fontSize: "0.85rem",
              height: "32px",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.nom}
          </Typography>

          {/* Description */}
          {product.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                height: "24px",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                fontSize: "0.7rem",
              }}
            >
              {product.description}
            </Typography>
          )}

          {/* Prix */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography
              variant="h5"
              color="#5D4037"
              sx={{ fontWeight: 700, mr: 1, fontSize: "1rem" }}
            >
              {formatPrice(product.prix)} TND
            </Typography>
          </Box>

          {/* Bouton d'action principal */}
          {showActions && (
            <Button
              variant="contained"
              fullWidth
              startIcon={<LocalMall />}
              onClick={handleAddToCart}
              disabled={shouldDisableButton || isAddingToCart}
              size="small"
              sx={{
                backgroundColor: "#5D4037",
                "&:hover": { backgroundColor: "#4E342E" },
                "&:disabled": { backgroundColor: "grey.300" },
                fontSize: "0.75rem",
                py: 0.5,
              }}
            >
              {isAddingToCart
                ? "Ajout en cours..."
                : shouldDisableButton
                ? "Rupture de stock"
                : "Ajouter au panier"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Modal de détail du produit */}
      <ProductDetailModal
        product={product}
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </>
  );
};

export default ProductCard;
