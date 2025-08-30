import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

export default function AfficheDetailClient({ open, onClose, client }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Détails du client</DialogTitle>
      <DialogContent dividers>
        {client ? (
          <>
            <Typography>
              <strong>Nom :</strong> {client.utilisateurId?.nom || "N/A"}
            </Typography>
            <Typography>
              <strong>Prénom :</strong> {client.utilisateurId?.prenom || "N/A"}
            </Typography>
            <Typography>
              <strong>Email :</strong> {client.utilisateurId?.email || "N/A"}
            </Typography>
            <Typography>
              <strong>Téléphone :</strong> {client.telephone || "N/A"}
            </Typography>
            <Typography>
              <strong>Adresse :</strong> {client.adresse || "Non renseignée"}
            </Typography>
            <Typography>
              <strong>Genre :</strong> {client.genre || "Non renseigné"}
            </Typography>
            <Typography>
              <strong>Inscrit le :</strong>{" "}
              {client.dateInscription
                ? new Date(client.dateInscription).toLocaleDateString("fr-FR")
                : "N/A"}
            </Typography>
          </>
        ) : (
          <Typography>Aucun client sélectionné.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}
