import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Pagination,
  Chip,
  Breadcrumbs,
  Link,
  Button,
} from "@mui/material";
import { Home, Search as SearchIcon, ArrowBack } from "@mui/icons-material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchProducts, getAllProduits } from "../../services/produitService";
import ProductCard from "../ProductCard";
import Layout from "../Layout/Layout";

const RechercheProduit = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalProduits: 0,
    totalPages: 1,
    exactMatch: false,
  });
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setShowAllProducts(false);

        const searchData = await searchProducts(
          query,
          pagination.page,
          pagination.limit
        );

        setResults(searchData.produits || []);
        setPagination(searchData.pagination);

        // Si aucun résultat n'est trouvé et que ce n'est pas une correspondance exacte,
        // afficher tous les produits
        if (
          searchData.produits.length === 0 &&
          !searchData.pagination.exactMatch
        ) {
          const allProductsData = await getAllProduits();
          setResults(allProductsData || []);
          setPagination((prev) => ({
            ...prev,
            totalProduits: allProductsData.length,
            totalPages: 1,
          }));
          setShowAllProducts(true);
        }
      } catch (err) {
        console.error("Erreur lors de la recherche:", err);

        // En cas d'erreur, afficher tous les produits
        try {
          const allProductsData = await getAllProduits();
          setResults(allProductsData || []);
          setPagination((prev) => ({
            ...prev,
            totalProduits: allProductsData.length,
            totalPages: 1,
          }));
          setShowAllProducts(true);
          setError(
            "Erreur lors de la recherche. Affichage de tous les produits."
          );
        } catch (fallbackError) {
          console.error("Erreur fallback:", fallbackError);
          setError("Erreur lors de la recherche. Veuillez réessayer.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, pagination.page]);

  const handlePageChange = (event, value) => {
    setPagination((prev) => ({ ...prev, page: value }));
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4, mt: 15 }}>
        {/* Bouton retour */}
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mb: 3, color: "#5D4037" }}
        >
          Retour
        </Button>

        {/* Fil d'Ariane */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            color="inherit"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Home sx={{ mr: 0.5, fontSize: 18 }} />
            Accueil
          </Link>
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <SearchIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Recherche
          </Typography>
        </Breadcrumbs>

        {/* Titre et résultats */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: "#5D4037", fontWeight: 700, mb: 2 }}
          >
            {showAllProducts ? "Tous nos produits" : "Résultats de recherche"}
          </Typography>

          {showAllProducts && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Aucun résultat trouvé pour "{query}". Voici tous nos produits:
              </Typography>
              <Typography variant="body1">
                ({pagination.totalProduits} produit
                {pagination.totalProduits !== 1 ? "s" : ""})
              </Typography>
            </Box>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!query.trim() ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            Veuillez entrer un terme de recherche.
          </Alert>
        ) : results.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            Aucun produit trouvé dans notre catalogue.
          </Alert>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {results.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#5D4037",
                      borderColor: "#5D4037",
                    },
                    "& .MuiPaginationItem-root.Mui-selected": {
                      backgroundColor: "#5D4037",
                      color: "white",
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Layout>
  );
};

export default RechercheProduit;
