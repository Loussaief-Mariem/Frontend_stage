import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Visibility,
  Cancel,
  ShoppingBag,
  CalendarToday,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import {
  getCommandesByClient,
  annulerCommandeGlobale,
} from "../../services/commandeService";
import { getLignesCommandeActives } from "../../services/ligneCommandeService";
import Layout from "../Layout/Layout";

const MesCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [lignesCommande, setLignesCommande] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = async () => {
    try {
      setLoading(true);

      // 🔹 Récupérer l'utilisateur connecté
      const user = localStorage.getItem("user");
      if (!user) {
        setError("Utilisateur non connecté");
        setLoading(false);
        return;
      }

      const userData = JSON.parse(user);

      // ✅ Correction ici
      const clientId = userData.clientId || userData.clientInfo?._id;

      if (!clientId) {
        setError("Client non trouvé");
        setLoading(false);
        return;
      }

      // 🔹 Charger les commandes du client connecté
      const commandesData = await getCommandesByClient(clientId);
      setCommandes(commandesData);
    } catch (err) {
      console.error("Erreur lors du chargement des commandes:", err);
      setError("Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  };

  const fetchLignesCommande = async (commandeId) => {
    try {
      const lignes = await getLignesCommandeActives();

      if (!lignes || !Array.isArray(lignes)) {
        throw new Error("Format de données invalide");
      }

      const lignesFiltrees = lignes.filter(
        (ligne) => ligne.commandeId && ligne.commandeId._id === commandeId
      );

      setLignesCommande(lignesFiltrees);
    } catch (err) {
      console.error("Erreur lors du chargement des lignes de commande:", err);
      enqueueSnackbar("Erreur lors du chargement des détails", {
        variant: "error",
      });
      setLignesCommande([]);
    }
  };

  const handleCancelClick = (commande) => {
    setSelectedCommande(commande);
    setCancelDialogOpen(true);
  };

  const handleViewDetails = async (commande) => {
    setSelectedCommande(commande);
    await fetchLignesCommande(commande._id);
    setDetailDialogOpen(true);
  };

  const confirmCancel = async () => {
    try {
      await annulerCommandeGlobale(selectedCommande._id);

      enqueueSnackbar("Commande annulée avec succès", { variant: "success" });

      setCommandes((prev) =>
        prev.map((cmd) =>
          cmd._id === selectedCommande._id ? { ...cmd, statut: "Annulé" } : cmd
        )
      );

      setCancelDialogOpen(false);
      setSelectedCommande(null);
    } catch (err) {
      console.error("Erreur lors de l'annulation:", err);
      enqueueSnackbar("Erreur lors de l'annulation de la commande", {
        variant: "error",
      });
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case "Livree":
        return "success";
      case "Annulé":
        return "error";
      case "EnAttente":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case "Livree":
        return "Livrée";
      case "Annulé":
        return "Annulée";
      case "EnAttente":
        return "En attente";
      default:
        return statut;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-TN", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(price);
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
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

  if (error) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            color: "#5D4037",
            fontWeight: 700,
            mb: 4,
            textAlign: "center",
          }}
        >
          Mes Commandes
        </Typography>

        {commandes.length === 0 ? (
          <Box textAlign="center" py={8}>
            <ShoppingBag
              sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucune commande trouvée
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vous n'avez pas encore passé de commande.
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Numéro</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {commandes.map((commande) => (
                  <TableRow key={commande._id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {commande.numcmd}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarToday
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {formatDate(commande.createdAt)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatPrice(commande.total || 0)} TND
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(commande.statut)}
                        color={getStatusColor(commande.statut)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => handleViewDetails(commande)}
                          sx={{ minWidth: "auto" }}
                        >
                          Détails
                        </Button>
                        {commande.statut === "EnAttente" && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Cancel />}
                            onClick={() => handleCancelClick(commande)}
                            sx={{ minWidth: "auto" }}
                          >
                            Annuler
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Dialog d'annulation */}
        <Dialog
          open={cancelDialogOpen}
          onClose={() => setCancelDialogOpen(false)}
        >
          <DialogTitle>Confirmer l'annulation</DialogTitle>
          <DialogContent>
            <Typography>
              Êtes-vous sûr de vouloir annuler la commande{" "}
              {selectedCommande?.numcmd} ?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCancelDialogOpen(false)}>Non</Button>
            <Button onClick={confirmCancel} color="error" variant="contained">
              Oui, annuler
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de détails */}
        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Détails de la commande {selectedCommande?.numcmd}
          </DialogTitle>
          <DialogContent>
            {selectedCommande && (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date de commande
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedCommande.createdAt)}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date de livraison prévue
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedCommande.dateLivraison)}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Statut
                  </Typography>
                  <Chip
                    label={getStatusText(selectedCommande.statut)}
                    color={getStatusColor(selectedCommande.statut)}
                  />
                </Box>

                <Typography variant="h6" sx={{ mb: 2 }}>
                  Articles
                </Typography>

                {lignesCommande.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Produit</TableCell>
                          <TableCell align="right">Quantité</TableCell>
                          <TableCell align="right">Prix unitaire</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {lignesCommande.map((ligne) => (
                          <TableRow key={ligne._id}>
                            <TableCell>
                              <Typography variant="body2">
                                {ligne.produitId?.nom ||
                                  "Produit non disponible"}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              {ligne.quantite}
                            </TableCell>
                            <TableCell align="right">
                              {formatPrice(ligne.prixUnitaire)} TND
                            </TableCell>
                            <TableCell align="right">
                              {formatPrice(ligne.prixUnitaire * ligne.quantite)}{" "}
                              TND
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Aucun détail disponible
                  </Typography>
                )}

                <Box sx={{ mt: 3, textAlign: "right" }}>
                  <Typography variant="h6">
                    Total: {formatPrice(selectedCommande.total || 0)} TND
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailDialogOpen(false)}>Fermer</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default MesCommandes;
