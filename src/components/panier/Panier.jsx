import React, { useState, useEffect } from "react";
import AfficherDetailPanier from "./AfficherDetailPanier";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Chip,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Pagination,
} from "@mui/material";
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import {
  getPaniersPagines,
  updatePanier,
  deletePanier,
  getTotalPanier,
} from "../../services/panierService";
import {
  getLignesByPanier,
  modifierLigne,
  supprimerLignePanier,
} from "../../services/lignePanierService";

const statusColors = {
  true: { bg: "#E8F5E9", color: "#2E7D32", label: "Actif" },
  false: { bg: "#FFEBEE", color: "#C62828", label: "Inactif" },
};

function Panier() {
  const [paniers, setPaniers] = useState([]);
  const [lignesPanier, setLignesPanier] = useState([]);
  const [selectedPanier, setSelectedPanier] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("tous");
  const [loading, setLoading] = useState(true);
  const [totalPanier, setTotalPanier] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPaniers();
  }, [page, searchTerm, filterStatut]);

  const fetchPaniers = async () => {
    try {
      setLoading(true);
      const data = await getPaniersPagines(page, rowsPerPage);

      // appliquer filtres frontend
      let filtered = data.paniers.filter((panier) => {
        const matchesSearch =
          panier.clientId?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          `${panier.clientId?.nom} ${panier.clientId?.prenom}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesStatut =
          filterStatut === "tous" ||
          (filterStatut === "actif" && panier.est_actif) ||
          (filterStatut === "inactif" && !panier.est_actif);

        return matchesSearch && matchesStatut;
      });

      setPaniers(filtered);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching paniers:", error);
      setLoading(false);
    }
  };

  const fetchLignesPanier = async (panierId) => {
    try {
      const lignes = await getLignesByPanier(panierId);
      setLignesPanier(lignes);
      const total = await getTotalPanier(panierId);
      setTotalPanier(total);
    } catch (error) {
      console.error("Error fetching lignes panier:", error);
    }
  };

  const togglePanierStatus = async (panierId, currentStatus) => {
    try {
      await updatePanier(panierId, { est_actif: !currentStatus });
      fetchPaniers();
      if (selectedPanier?._id === panierId) {
        setSelectedPanier({ ...selectedPanier, est_actif: !currentStatus });
      }
    } catch (error) {
      console.error("Error updating panier status:", error);
    }
  };

  const handleOpenDialog = (panier) => {
    setSelectedPanier(panier);
    fetchLignesPanier(panier._id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPanier(null);
  };

  const handleUpdateLigne = async (ligneId, updatedData) => {
    try {
      await modifierLigne(ligneId, updatedData);
      if (selectedPanier) {
        fetchLignesPanier(selectedPanier._id);
      }
    } catch (error) {
      console.error("Error updating ligne:", error);
    }
  };

  const handleDeleteLigne = async (panierId, numLigne) => {
    try {
      await supprimerLignePanier(panierId, numLigne);
      if (selectedPanier) {
        fetchLignesPanier(selectedPanier._id);
      }
    } catch (error) {
      console.error("Error deleting ligne:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, color: "#5D4037", mb: 3 }}
      >
        Gestion des Paniers Clients
      </Typography>

      {/* Filtres */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          variant="outlined"
          placeholder="Rechercher par client..."
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel>Statut</InputLabel>
          <Select
            value={filterStatut}
            label="Statut"
            onChange={(e) => setFilterStatut(e.target.value)}
          >
            <MenuItem value="tous">Tous les statuts</MenuItem>
            <MenuItem value="actif">Actifs</MenuItem>
            <MenuItem value="inactif">Inactifs</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tableau */}
      <Paper
        elevation={0}
        sx={{ borderRadius: 2, border: "1px solid #EDE7E3" }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F8F5F2" }}>
                <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date création</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Dernière modif.</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress color="primary" size={60} />
                  </TableCell>
                </TableRow>
              ) : paniers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    Aucun panier trouvé
                  </TableCell>
                </TableRow>
              ) : (
                paniers.map((panier) => (
                  <TableRow key={panier._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={`https://ui-avatars.com/api/?name=${panier.clientId?.nom}+${panier.clientId?.prenom}&background=F8F5F2&color=5D4037`}
                          sx={{ width: 36, height: 36, mr: 2 }}
                        />
                        <Box>
                          <Typography fontWeight={600}>
                            {panier.clientId?.nom} {panier.clientId?.prenom}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {panier.clientId?.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={panier.est_actif ? "Actif" : "Inactif"}
                        size="small"
                        sx={{
                          backgroundColor: statusColors[panier.est_actif].bg,
                          color: statusColors[panier.est_actif].color,
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(panier.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      {new Date(panier.updatedAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Voir le panier">
                        <IconButton
                          onClick={() => handleOpenDialog(panier)}
                          sx={{ color: "#5D4037" }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={panier.est_actif ? "Désactiver" : "Activer"}
                      >
                        <IconButton
                          onClick={() =>
                            togglePanierStatus(panier._id, panier.est_actif)
                          }
                          sx={{
                            color: panier.est_actif ? "#FF8F00" : "#2E7D32",
                          }}
                        >
                          {panier.est_actif ? (
                            <RefreshIcon />
                          ) : (
                            <CheckCircleIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination centrée */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Paper>

      {/* Dialog détails panier */}
      <Box sx={{ p: 3 }}>
        <AfficherDetailPanier
          open={openDialog}
          onClose={handleCloseDialog}
          panier={selectedPanier}
        />
      </Box>
    </Box>
  );
}

export default Panier;
