import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { updateClient } from "../../services/clientService";
import { updateUtilisateur } from "../../services/utilisateur";

function EditClient({ open, onClose, client, onSave }) {
  const [editedClient, setEditedClient] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (client) setEditedClient(client);
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["nom", "prenom", "email"].includes(name)) {
      setEditedClient((prev) => ({
        ...prev,
        utilisateurId: {
          ...prev.utilisateurId,
          [name]: value,
        },
      }));
    } else {
      setEditedClient((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    if (!editedClient) return;
    setSaving(true);

    try {
      // 1️⃣ Mise à jour Utilisateur
      await updateUtilisateur(editedClient.utilisateurId._id, {
        nom: editedClient.utilisateurId.nom,
        prenom: editedClient.utilisateurId.prenom,
        email: editedClient.utilisateurId.email,
      });

      // 2️⃣ Mise à jour Client
      const updatedClient = await updateClient(editedClient._id, {
        telephone: editedClient.telephone,
        adresse: editedClient.adresse,
        genre: editedClient.genre,
      });

      onSave({ ...updatedClient, utilisateurId: editedClient.utilisateurId });
      onClose();
    } catch (err) {
      console.error("Erreur mise à jour :", err.response?.data || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!editedClient) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Modifier le Client</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Nom"
            name="nom"
            value={editedClient.utilisateurId.nom || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Prénom"
            name="prenom"
            value={editedClient.utilisateurId.prenom || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={editedClient.utilisateurId.email || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Téléphone"
            name="telephone"
            value={editedClient.telephone || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Adresse"
            name="adresse"
            value={editedClient.adresse || ""}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            label="Genre"
            name="genre"
            value={editedClient.genre || ""}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{
            backgroundColor: "#C29788",
            "&:hover": { backgroundColor: "#A57F72" },
          }}
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditClient;
