import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Pagination,
  CircularProgress,
} from "@mui/material";

import {
  Email as EmailIcon,
  Receipt as ReceiptIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  getCommandesPagines,
  annulerCommandeGlobale,
} from "../../services/commandeService";
import { sendFactureEmail } from "../../services/emailService";
import { creerFacture } from "../../services/factureService";

const GestionCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [generatingFacture, setGeneratingFacture] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchCommandes();
  }, [page]);

  const fetchCommandes = async () => {
    try {
      setLoading(true);
      const response = await getCommandesPagines(page, 10);
      setCommandes(response.commandes);
      setTotalPages(response.totalPages);
    } catch (error) {
      showSnackbar("Erreur lors du chargement des commandes", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (commande) => {
    setSelectedCommande(commande);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCommande(null);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleGenerateFacture = async () => {
    if (!selectedCommande) return;

    try {
      setGeneratingFacture(true);
      const response = await creerFacture({ commandeId: selectedCommande._id });

      // Mettre à jour la commande sélectionnée avec la nouvelle facture
      setSelectedCommande((prev) => ({
        ...prev,
        factureId: response.facture,
      }));

      // Mettre à jour la liste des commandes
      setCommandes((prev) =>
        prev.map((cmd) =>
          cmd._id === selectedCommande._id
            ? { ...cmd, factureId: response.facture }
            : cmd
        )
      );

      showSnackbar("Facture générée avec succès", "success");
    } catch (error) {
      showSnackbar("Erreur lors de la génération de la facture", "error");
    } finally {
      setGeneratingFacture(false);
    }
  };

  const handleSendFactureEmail = async () => {
    if (!selectedCommande) return;

    try {
      setSendingEmail(true);
      // Envoyer l'ID de commande, pas l'ID de facture
      await sendFactureEmail(selectedCommande._id);
      showSnackbar("Facture envoyée par email avec succès", "success");

      // Rafraîchir les données pour voir le statut mis à jour
      fetchCommandes();
    } catch (error) {
      showSnackbar("Erreur lors de l'envoi de la facture", "error");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleGenerateAndSendFacture = async () => {
    if (!selectedCommande) return;

    try {
      setGeneratingFacture(true);

      // 1. Générer la facture
      const response = await creerFacture({ commandeId: selectedCommande._id });

      // 2. Envoyer l'email immédiatement après avec l'ID de commande
      await sendFactureEmail(selectedCommande._id);

      // 3. Mettre à jour l'état local
      setSelectedCommande((prev) => ({
        ...prev,
        factureId: response.facture,
      }));

      setCommandes((prev) =>
        prev.map((cmd) =>
          cmd._id === selectedCommande._id
            ? { ...cmd, factureId: response.facture }
            : cmd
        )
      );

      showSnackbar(
        "Facture générée et envoyée par email avec succès",
        "success"
      );
    } catch (error) {
      showSnackbar("Erreur lors de la génération/envoi de la facture", "error");
    } finally {
      setGeneratingFacture(false);
    }
  };

  const handleCancelCommande = async (commandeId) => {
    try {
      await annulerCommandeGlobale(commandeId);
      showSnackbar("Commande annulée avec succès", "success");
      fetchCommandes();
    } catch (error) {
      showSnackbar("Erreur lors de l'annulation de la commande", "error");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Livree":
      case "Reglee":
        return "success";
      case "EnAttente":
        return "warning";
      case "Annulé":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress sx={{ color: "#5D4037" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, color: "#5D4037", mb: 3 }}
      >
        Gestion des Commandes
      </Typography>

      <Paper
        elevation={0}
        sx={{ borderRadius: 2, border: "1px solid #EDE7E3" }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F8F5F2" }}>
                <TableCell sx={{ fontWeight: "bold", color: "#5D4037" }}>
                  N° Commande
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#5D4037" }}>
                  Client
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#5D4037" }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#5D4037" }}>
                  Total
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#5D4037" }}>
                  Statut
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#5D4037" }}>
                  Facture
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#5D4037" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {commandes.map((commande) => (
                <TableRow key={commande._id} hover>
                  <TableCell>{commande.numcmd}</TableCell>
                  <TableCell>
                    {commande.clientId?.utilisateurId?.nom}{" "}
                    {commande.clientId?.utilisateurId?.prenom}
                    <br />
                    <Typography variant="body2" color="textSecondary">
                      {commande.clientId?.utilisateurId?.email}
                    </Typography>
                  </TableCell>

                  <TableCell>{formatDate(commande.createdAt)}</TableCell>
                  <TableCell>{commande.total?.toFixed(3)} TND</TableCell>
                  <TableCell>
                    <Chip
                      label={commande.statut}
                      color={getStatusColor(commande.statut)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {commande.factureId ? (
                      <Chip
                        label={commande.factureId.statut}
                        color={getStatusColor(commande.factureId.statut)}
                        size="small"
                      />
                    ) : (
                      <Chip label="Non générée" color="error" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpenDialog(commande)}
                      sx={{ color: "#5D4037" }}
                    >
                      <ViewIcon />
                    </IconButton>
                    {commande.statut !== "Annulé" && (
                      <IconButton
                        onClick={() => handleCancelCommande(commande._id)}
                        sx={{ color: "#f44336" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" p={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: "#5D4037", fontWeight: 600 }}>
          Détails de la commande {selectedCommande?.numcmd}
        </DialogTitle>
        <DialogContent>
          {selectedCommande && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Client:</strong>{" "}
                  {selectedCommande.clientId?.utilisateurId?.nom}{" "}
                  {selectedCommande.clientId?.utilisateurId?.prenom}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Email:</strong>{" "}
                  {selectedCommande.clientId?.utilisateurId?.email}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Date de création:</strong>{" "}
                  {formatDate(selectedCommande.createdAt)}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Date de livraison prévue:</strong>{" "}
                  {formatDate(selectedCommande.dateLivraison)}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Total:</strong> {selectedCommande.total?.toFixed(3)}{" "}
                  TND
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Statut commande:</strong>{" "}
                  <Chip
                    label={selectedCommande.statut}
                    color={getStatusColor(selectedCommande.statut)}
                    size="small"
                  />
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Facture:</strong>{" "}
                  {selectedCommande.factureId ? (
                    <Chip
                      label={selectedCommande.factureId.statut}
                      color={getStatusColor(selectedCommande.factureId.statut)}
                      size="small"
                    />
                  ) : (
                    <Chip label="Non générée" color="error" size="small" />
                  )}
                </Typography>

                {selectedCommande.factureId && (
                  <>
                    <Typography variant="body2" sx={{ mt: 1, ml: 2 }}>
                      <strong>Numéro:</strong>{" "}
                      {selectedCommande.factureId.numFact}
                    </Typography>
                    {selectedCommande.factureId.estEnvoyee && (
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        <strong>Envoyée le:</strong>{" "}
                        {formatDate(selectedCommande.factureId.dateEnvoi)}
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fermer</Button>

          {selectedCommande?.statut !== "Annulé" &&
            !selectedCommande?.factureId && (
              <>
                <Button
                  onClick={handleGenerateFacture}
                  startIcon={<ReceiptIcon />}
                  disabled={generatingFacture}
                  sx={{ color: "#5D4037", mr: 1 }}
                >
                  {generatingFacture ? (
                    <CircularProgress size={16} />
                  ) : (
                    "Générer Facture"
                  )}
                </Button>
                <Button
                  onClick={handleGenerateAndSendFacture}
                  startIcon={<EmailIcon />}
                  disabled={generatingFacture}
                  sx={{ color: "#5D4037" }}
                >
                  {generatingFacture ? (
                    <CircularProgress size={16} />
                  ) : (
                    "Générer et Envoyer"
                  )}
                </Button>
              </>
            )}

          {selectedCommande?.factureId &&
            !selectedCommande.factureId.estEnvoyee && (
              <Button
                onClick={handleSendFactureEmail}
                startIcon={
                  sendingEmail ? <CircularProgress size={16} /> : <EmailIcon />
                }
                disabled={sendingEmail}
                sx={{ color: "#5D4037" }}
              >
                Envoyer par Email
              </Button>
            )}

          {selectedCommande?.factureId &&
            selectedCommande.factureId.estEnvoyee && (
              <Button
                startIcon={<EmailIcon />}
                disabled
                sx={{ color: "green" }}
              >
                Déjà envoyée
              </Button>
            )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GestionCommandes;
