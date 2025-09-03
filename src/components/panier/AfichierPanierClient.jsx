// components/panier/AfichierPanierClient.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  TextField,
  Divider,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  getPanierActif,
  getArticlesPanier,
  updateQuantiteArticle,
  supprimerArticlePanier,
  getTotalPanier,
} from "../../services/panierService";
import {
  getPanierLocal,
  updateQuantiteArticleLocal,
  supprimerArticleLocal,
} from "../../services/panierService";
import Layout from "../Layout/Layout"; // IMPORT DU LAYOUT

const AfichierPanierClient = () => {
  const [panier, setPanier] = useState({ articles: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    chargerPanier();
  }, []);

  const chargerPanier = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (user._id) {
        // Utilisateur connecté - charger depuis l'API
        const panierActif = await getPanierActif(user._id);
        if (panierActif) {
          const articles = await getArticlesPanier(panierActif._id);
          const totalData = await getTotalPanier(panierActif._id);

          setPanier({
            articles: articles,
            total: totalData.total,
          });
        } else {
          setPanier({ articles: [], total: 0 });
        }
      } else {
        // Visiteur - charger depuis le stockage local
        const panierLocal = getPanierLocal();
        setPanier(panierLocal);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error);
    } finally {
      setLoading(false);
    }
  };

  const mettreAJourQuantite = async (produitId, nouvelleQuantite) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (user._id) {
        // Utilisateur connecté - mise à jour via API
        const panierActif = await getPanierActif(user._id);
        if (panierActif) {
          await updateQuantiteArticle(
            panierActif._id,
            produitId,
            nouvelleQuantite
          );
        }
      } else {
        // Visiteur - mise à jour locale
        updateQuantiteArticleLocal(produitId, nouvelleQuantite);
      }

      // Recharger le panier
      await chargerPanier();

      // Déclencher la mise à jour du compteur
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la quantité:", error);
    }
  };

  const supprimerArticle = async (produitId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (user._id) {
        // Utilisateur connecté - suppression via API
        const panierActif = await getPanierActif(user._id);
        if (panierActif) {
          await supprimerArticlePanier(panierActif._id, produitId);
        }
      } else {
        // Visiteur - suppression locale
        supprimerArticleLocal(produitId);
      }

      // Recharger le panier
      await chargerPanier();

      // Déclencher la mise à jour du compteur
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
    }
  };

  const passerCommande = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user._id) {
      // Utilisateur connecté - passer à l'étape de paiement
      navigate("/commande");
    } else {
      // Visiteur - rediriger vers la connexion/inscription
      navigate("/connexion", {
        state: {
          message:
            "Veuillez vous connecter ou créer un compte pour finaliser votre commande",
          redirectTo: "/panier",
        },
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  if (panier.articles.length === 0) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Votre panier est vide
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}
          >
            Continuer vos achats
          </Button>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#333",
            mb: 3,
          }}
        >
          Votre panier
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {panier.articles.map((article) => (
              <Card
                key={article.produitId || article._id}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={3}>
                      <CardMedia
                        component="img"
                        image={
                          article.image || "https://via.placeholder.com/100"
                        }
                        alt={article.nom}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: "contain",
                          borderRadius: 1,
                          border: "1px solid #e0e0e0",
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: "#333",
                          mb: 1,
                          lineHeight: 1.3,
                        }}
                      >
                        {article.nom}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: 500,
                        }}
                      >
                        {new Intl.NumberFormat("fr-TN", {
                          minimumFractionDigits: 3,
                        }).format(article.prix)}{" "}
                        TND
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            mettreAJourQuantite(
                              article.produitId || article._id,
                              article.quantite - 1
                            )
                          }
                          disabled={article.quantite <= 1}
                          sx={{
                            border: "1px solid #e0e0e0",
                            "&:hover": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <TextField
                          value={article.quantite}
                          size="small"
                          sx={{
                            width: 60,
                            mx: 1,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1,
                              "& fieldset": {
                                borderColor: "#e0e0e0",
                              },
                            },
                          }}
                          inputProps={{
                            style: {
                              textAlign: "center",
                              fontSize: "0.9rem",
                              fontWeight: 500,
                            },
                            min: 1,
                          }}
                          onChange={(e) => {
                            const nouvelleQuantite =
                              parseInt(e.target.value) || 1;
                            mettreAJourQuantite(
                              article.produitId || article._id,
                              nouvelleQuantite
                            );
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() =>
                            mettreAJourQuantite(
                              article.produitId || article._id,
                              article.quantite + 1
                            )
                          }
                          sx={{
                            border: "1px solid #e0e0e0",
                            "&:hover": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={2} textAlign="right">
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: "#333",
                          mb: 1,
                        }}
                      >
                        {new Intl.NumberFormat("fr-TN", {
                          minimumFractionDigits: 3,
                        }).format(article.prix * article.quantite)}{" "}
                        TND
                      </Typography>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() =>
                          supprimerArticle(article.produitId || article._id)
                        }
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(244, 67, 54, 0.1)",
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#333",
                  mb: 2,
                }}
              >
                Récapitulatif de la commande
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography sx={{ fontSize: "0.95rem", color: "#666" }}>
                  Sous-total
                </Typography>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                  {new Intl.NumberFormat("fr-TN", {
                    minimumFractionDigits: 3,
                  }).format(panier.total)}{" "}
                  TND
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography sx={{ fontSize: "0.95rem", color: "#666" }}>
                  Frais de livraison
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#4caf50",
                  }}
                >
                  Gratuit
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  Total
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  {new Intl.NumberFormat("fr-TN", {
                    minimumFractionDigits: 3,
                  }).format(panier.total)}{" "}
                  TND
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={passerCommande}
                sx={{
                  py: 1.5,
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  borderRadius: 1,
                }}
              >
                Commander
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default AfichierPanierClient;
