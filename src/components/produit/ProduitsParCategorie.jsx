import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Pagination,
  Breadcrumbs,
  Link,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Home, Category } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProduitsByCategorieIdPagination,
  getProduitsByCategorieId,
} from "../../services/produitService";
import { getCategorieById } from "../../services/categorieService";
import ProductCard from "../ProductCard";

const ProduitsParCategorie = () => {
  const { categorieId } = useParams();
  const navigate = useNavigate();
  const [produits, setProduits] = useState([]);
  const [categorie, setCategorie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProduits, setTotalProduits] = useState(0);
  const limit = 12;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const primaryColor = theme.palette?.primary?.main || "#5D4037";
  const primaryDarker = theme.palette?.primary?.dark || "#4E342E";
  const softBg = theme.palette?.action?.hover || "#f8f5f2";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Récupérer les informations de la catégorie
        const categorieData = await getCategorieById(categorieId);
        setCategorie(categorieData);

        // Récupérer les produits avec pagination
        const produitsData = await getProduitsByCategorieIdPagination(
          categorieId,
          page,
          limit
        );

        setProduits(produitsData.produits || []);
        setTotalPages(produitsData.pagination?.totalPages || 1);
        setTotalProduits(produitsData.pagination?.totalProduits || 0);
      } catch (err) {
        console.error("Erreur lors du chargement des produits:", err);
        setError("Erreur lors du chargement des produits. Veuillez réessayer.");

        // Fallback: essayer sans pagination
        try {
          const produitsFallback = await getProduitsByCategorieId(categorieId);
          setProduits(produitsFallback.produits || []);
          setTotalProduits(produitsFallback.count || 0);
        } catch (fallbackError) {
          console.error("Erreur fallback:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    if (categorieId) {
      fetchData();
    }
  }, [categorieId, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          <CircularProgress size={60} sx={{ color: primaryColor }} />
        </Box>
      </Container>
    );
  }

  if (error && produits.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, mt: 15 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 3, sm: 4 },
        mt: { xs: 12, sm: 14, md: 15 },
      }}
    >
      {/* Fil d'Ariane */}
      <Breadcrumbs sx={{ mb: 2, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}>
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
        <Link
          color="inherit"
          href="/categories"
          onClick={(e) => {
            e.preventDefault();
            navigate("/categories");
          }}
          sx={{ display: "flex", alignItems: "center", fontSize: "0.9rem" }}
        >
          <Category sx={{ mr: 0.5, fontSize: 18 }} />
          Catégories
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center", fontSize: "0.9rem" }}
        >
          {categorie?.nom || "Catégorie"}
        </Typography>
      </Breadcrumbs>

      {/* En-tête de la catégorie */}
      <Box
        sx={{
          mb: { xs: 3, sm: 4 },
          textAlign: "center",
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          backgroundColor: softBg,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            color: primaryColor,
            fontWeight: 700,
            fontSize: { xs: "1.6rem", sm: "1.9rem", md: "2.2rem" },
          }}
        >
          {categorie?.nom || "Produits"}
        </Typography>

        {categorie?.description && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: "600px",
              mx: "auto",
              mb: 2,
              fontSize: isMobile ? "0.9rem" : "1rem",
            }}
          >
            {categorie.description}
          </Typography>
        )}

        {categorie?.famille && (
          <Chip
            label={categorie.famille.toUpperCase()}
            color="primary"
            variant="outlined"
            sx={{
              backgroundColor: softBg,
              color: primaryColor,
              fontWeight: 600,
              fontSize: "0.8rem",
              borderColor: primaryColor,
            }}
          />
        )}

        {/* Intentionally removed total products count display */}
      </Box>

      {/* Liste des produits */}
      {produits.length > 0 ? (
        <>
          <Grid container spacing={{ xs: 1, sm: 2 }}>
            {produits.map((produit) => (
              <Grid
                item
                xs={6}
                sm={4}
                md={3}
                key={produit._id}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: { xs: 240, sm: 260, md: 280 },
                    transition: "transform 180ms ease, box-shadow 180ms ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <ProductCard product={produit} />
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: { xs: 3, sm: 4 },
                mb: { xs: 1, sm: 2 },
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "small" : "medium"}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: primaryColor,
                    borderRadius: 8,
                    minWidth: 34,
                    height: 34,
                    mx: 0.25,
                  },
                  "& .Mui-selected": {
                    backgroundColor: primaryColor,
                    color: "#fff",
                    "&:hover": { backgroundColor: primaryDarker },
                  },
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <Box textAlign="center" py={8}>
          <Typography
            variant="h6"
            color="text.secondary"
            gutterBottom
            sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
          >
            Aucun produit trouvé dans cette catégorie
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.85rem", md: "0.95rem" } }}
          >
            Découvrez nos autres catégories pour trouver des produits
            similaires.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ProduitsParCategorie;
