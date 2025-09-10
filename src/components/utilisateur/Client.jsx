import React, { useState, useEffect } from "react";
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
  Avatar,
  Tooltip,
  Chip,
  styled,
  CircularProgress,
  Pagination,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { getClientsPagines, deleteClient } from "../../services/clientService";
import AfficheDetailClient from "./AfficheDetailClient";
import EditClient from "./EditClient";

const StatusChip = styled(Chip)(({ status }) => ({
  backgroundColor: status === "active" ? "#E8F5E9" : "#FFEBEE",
  color: status === "active" ? "#2E7D32" : "#C62828",
  fontWeight: 600,
}));

function Client() {
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClients(page, searchTerm);
  }, [page, searchTerm]);

  const fetchClients = async (pageNum, search) => {
    try {
      setLoading(true);
      const data = await getClientsPagines(pageNum, 5, search);
      setClients(data.clients || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      setClients([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleOpenDetail = (client) => {
    setSelectedClient(client);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedClient(null);
  };

  const handleOpenEdit = (client) => {
    setSelectedClient(client);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedClient(null);
  };

  const handleDeleteClient = async (clientId) => {
    const previousClients = [...clients];
    setClients((prev) => prev.filter((c) => c._id !== clientId));

    try {
      await deleteClient(clientId);
    } catch (error) {
      alert("Erreur lors de la suppression. Annulation...");
      setClients(previousClients);
    }
  };

  const handleUpdateClientState = (updatedClient) => {
    setClients((prev) =>
      prev.map((client) =>
        client._id === updatedClient._id ? updatedClient : client
      )
    );
  };

  return (
    <Box sx={{ width: "100%", px: 0, mx: 0 }}>
      <Paper
        sx={{
          p: 3,
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        {/* En-tête */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#5D4037" }}>
            Gestion des Clients
          </Typography>
        </Box>

        {/* Recherche */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Rechercher un client..."
            size="small"
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>

        {/* Table */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress color="primary" size={60} />
          </Box>
        ) : clients.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 2 }}>Aucun client trouvé</Box>
        ) : (
          <>
            <TableContainer>
              <Table
                sx={{
                  minWidth: "max-content",
                  "& .MuiTableHead-root": { backgroundColor: "#F8F5F2" },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Adresse</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clients.map((client) => {
                    // Vérifier si utilisateurId existe
                    if (!client.utilisateurId) {
                      return null; // Ne pas afficher les clients sans utilisateurId
                    }
                    
                    return (
                      <TableRow key={client._id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              src={`https://ui-avatars.com/api/?name=${client.utilisateurId.nom}+${client.utilisateurId.prenom}`}
                              sx={{ width: 40, height: 40, mr: 2 }}
                            />
                            <Box>
                              <Typography fontWeight={600}>
                                {client.utilisateurId.nom}{" "}
                                {client.utilisateurId.prenom}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Inscrit le{" "}
                                {new Date(
                                  client.dateInscription
                                ).toLocaleDateString("fr-FR")}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography>{client.utilisateurId.email}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {client.telephone}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {client.adresse || "Non renseignée"}
                        </TableCell>
                        <TableCell>
                          <StatusChip
                            label={
                              client.utilisateurId.isActive ? "Actif" : "Inactif"
                            }
                            status={
                              client.utilisateurId.isActive
                                ? "active"
                                : "inactive"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Voir détails">
                            <IconButton onClick={() => handleOpenDetail(client)}>
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Modifier">
                            <IconButton
                              onClick={() => handleOpenEdit(client)}
                              sx={{ color: "#1976D2" }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton
                              onClick={() => handleDeleteClient(client._id)}
                              sx={{ color: "#D32F2F" }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </>
        )}

        {/* Modales */}
        {selectedClient && (
          <>
            <AfficheDetailClient
              open={openDetail}
              onClose={handleCloseDetail}
              client={selectedClient}
            />
            <EditClient
              open={openEdit}
              onClose={handleCloseEdit}
              client={selectedClient}
              onSave={handleUpdateClientState}
            />
          </>
        )}
      </Paper>
    </Box>
  );
}

export default Client;
