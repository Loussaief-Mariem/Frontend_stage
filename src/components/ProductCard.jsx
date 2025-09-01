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
  Rating,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Visibility,
  LocalMall,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const ProductCard = ({ product, showActions = true }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Vérifier si le produit est en stock
  const isOutOfStock = product.stock <= 0;
  const isLowStock =
    product.stock > 0 && product.stock <= product.seuilAlertStock;

  // Gestion des favoris
  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    enqueueSnackbar(!isFavorite ? "Ajouté aux favoris" : "Retiré des favoris", {
      variant: "success",
    });
  };

  // Ajouter au panier
  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Logique d'ajout au panier
    enqueueSnackbar("Produit ajouté au panier", { variant: "success" });
  };

  // Voir les détails
  const handleViewDetails = () => {
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
      onClick={handleViewDetails}
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

      {/* Bouton favori */}
      {showActions && (
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
            backgroundColor: "white",
            "&:hover": { backgroundColor: "grey.50" },
          }}
          onClick={handleToggleFavorite}
        >
          {isFavorite ? (
            <Favorite color="error" />
          ) : (
            <FavoriteBorder color="disabled" />
          )}
        </IconButton>
      )}

      {/* Image du produit */}
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <CardMedia
          component="img"
          height="250"
          image={
            imageError || !product.image
              ? "https://via.placeholder.com/300x300?text=Image+Non+Disponible"
              : product.image
          }
          alt={product.nom}
          onError={handleImageError}
          className="product-image"
          sx={{
            transition: "transform 0.3s ease",
            objectFit: "cover",
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

            <Tooltip title="Ajouter au panier">
              <span>
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255,255,255,0.2)",
                  }}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  <ShoppingCart fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* Contenu de la carte */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Catégorie */}
        {product.categorieId && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.5 }}
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
            mb: 1,
            height: "48px",
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
              mb: 2,
              height: "40px",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.description}
          </Typography>
        )}

        {/* Rating */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Rating value={4.5} size="small" readOnly precision={0.5} />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            (128 avis)
          </Typography>
        </Box>

        {/* Prix */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography
            variant="h5"
            color="#5D4037"
            sx={{ fontWeight: 700, mr: 1 }}
          >
            {formatPrice(product.prix)} TND
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textDecoration: "line-through" }}
          >
            {formatPrice(product.prix * 1.2)} TND
          </Typography>
        </Box>

        {/* Informations stock */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {isOutOfStock ? "Rupture de stock" : `${product.stock} en stock`}
          </Typography>
          {product.volume && (
            <Typography variant="caption" color="text.secondary">
              {product.volume}
            </Typography>
          )}
        </Box>

        {/* Bouton d'action principal */}
        {showActions && (
          <Button
            variant="contained"
            fullWidth
            startIcon={<LocalMall />}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            sx={{
              backgroundColor: "#5D4037",
              "&:hover": { backgroundColor: "#4E342E" },
              "&:disabled": { backgroundColor: "grey.300" },
            }}
          >
            {isOutOfStock ? "Rupture" : "Ajouter au panier"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
