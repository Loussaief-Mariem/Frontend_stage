import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";

function EditLignePanier({ open, onClose, ligne, onSave }) {
  const [formData, setFormData] = useState({
    quantite: 1,
    prixUnitaire: 0,
  });

  useEffect(() => {
    if (ligne) {
      setFormData({
        quantite: ligne.quantite,
        prixUnitaire: ligne.prixUnitaire,
      });
    }
  }, [ligne]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(ligne._id, {
      quantite: Number(formData.quantite),
      prixUnitaire: Number(formData.prixUnitaire),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier la ligne du panier</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          Produit : {ligne?.produitId?.nom}
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Quantité"
            name="quantite"
            type="number"
            value={formData.quantite}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Prix unitaire (DT)"
            name="prixUnitaire"
            type="number"
            value={formData.prixUnitaire}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditLignePanier;
