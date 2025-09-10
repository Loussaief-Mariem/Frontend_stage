import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
  Avatar,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  getLignesByPanier,
  modifierLigne,
  supprimerLignePanier,
} from "../../services/lignePanierService";
import EditLignePanier from "./EditLignePanier";

function AfficherDetailPanier({ open, onClose, panier }) {
  const [lignes, setLignes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ligneToEdit, setLigneToEdit] = useState(null);

  useEffect(() => {
    if (open && panier) {
      fetchLignes();
    }
  }, [open, panier]);

  const fetchLignes = async () => {
    try {
      setLoading(true);
      const res = await getLignesByPanier(panier._id);
      setLignes(res);
      setLoading(false);
    } catch (err) {
      console.error("Erreur récupération lignes:", err);
      setLoading(false);
    }
  };

  const handleDeleteLigne = async (panierId, ligneId) => {
    try {
      await supprimerLignePanier(panierId, ligneId);
      fetchLignes();
    } catch (err) {
      console.error("Erreur suppression ligne:", err);
    }
  };

  const handleUpdateLigne = async (ligneId, updatedData) => {
    try {
      await modifierLigne(ligneId, updatedData);
      fetchLignes();
    } catch (err) {
      console.error("Erreur modification ligne:", err);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Détail du panier - {panier?.clientId?.nom} {panier?.clientId?.prenom}
        </DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <Typography>Chargement...</Typography>
          ) : lignes.length === 0 ? (
            <Typography>Aucune ligne dans ce panier.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Produit</TableCell>
                    <TableCell>Quantité</TableCell>
                    <TableCell>Prix unitaire</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lignes.map((ligne) => (
                    <TableRow key={ligne._id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            src={ligne.produitId?.image || ""}
                            alt={ligne.produitId?.nom}
                            sx={{ mr: 2 }}
                          />
                          <Typography>{ligne.produitId?.nom}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{ligne.quantite}</TableCell>
                      <TableCell>{ligne.prixUnitaire} DT</TableCell>
                      <TableCell>
                        {(ligne.quantite * ligne.prixUnitaire).toFixed(2)} DT
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            onClick={() => setLigneToEdit(ligne)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleDeleteLigne(panier._id, ligne._id)
                            }
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Total panier */}
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="right"
                      sx={{ fontWeight: "bold" }}
                    >
                      Total
                    </TableCell>
                    <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>
                      {lignes
                        .reduce(
                          (acc, l) => acc + l.quantite * l.prixUnitaire,
                          0
                        )
                        .toFixed(2)}{" "}
                      DT
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="secondary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/*  Dialog de modification */}
      <EditLignePanier
        open={!!ligneToEdit}
        ligne={ligneToEdit}
        onClose={() => setLigneToEdit(null)}
        onSave={handleUpdateLigne}
      />
    </>
  );
}

export default AfficherDetailPanier;
