import { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
  Pagination,
} from "@mui/material";
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import {
  getContactsPagines,
  updateContact,
  deleteContact,
} from "../../services/contactService";

const statusColors = {
  "non lu": { bg: "#FFF8E1", color: "#FF8F00" },
  lu: { bg: "#E8F5E9", color: "#2E7D32" },
};

const sujetColors = {
  "service client": { bg: "#E3F2FD", color: "#1565C0" },
  webmaster: { bg: "#F3E5F5", color: "#7B1FA2" },
};

function ContactAdmin() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 5;

  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSujet, setFilterSujet] = useState("tous");
  const [filterStatut, setFilterStatut] = useState("tous");

  // Dialog
  const [selectedContact, setSelectedContact] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Snackbar
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchContacts(page);
  }, [page, searchTerm, filterSujet, filterStatut]);

  const fetchContacts = async (currentPage) => {
    try {
      setLoading(true);
      const data = await getContactsPagines(currentPage, rowsPerPage);

      let filteredContacts = data.contacts || [];

      if (searchTerm) {
        filteredContacts = filteredContacts.filter(
          (contact) =>
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (contact.clientId?.email &&
              contact.clientId.email
                .toLowerCase()
                .includes(searchTerm.toLowerCase()))
        );
      }

      if (filterSujet !== "tous") {
        filteredContacts = filteredContacts.filter(
          (contact) => contact.sujet === filterSujet
        );
      }

      if (filterStatut !== "tous") {
        filteredContacts = filteredContacts.filter(
          (contact) => contact.statut === filterStatut
        );
      }

      setContacts(filteredContacts);
      setTotalPages(data.totalPages || 1);
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des contacts");
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const toggleStatut = async (contactId, currentStatut) => {
    try {
      const newStatut = currentStatut === "non lu" ? "lu" : "non lu";
      setContacts((prev) =>
        prev.map((c) =>
          c._id === contactId
            ? { ...c, statut: currentStatut === "non lu" ? "lu" : "non lu" }
            : c
        )
      );
      await updateContact(contactId, { statut: newStatut });
      fetchContacts(page);
    } catch (error) {
      console.error("Error updating contact status:", error);
    }
  };

  const handleArchive = async (contactId) => {
    try {
      setContacts((prev) => prev.filter((c) => c._id !== contactId));
      await updateContact(contactId, { isArchived: true });
      setSnackbarMessage("Le message a été archivé.");
      setShowSnackbar(true);
      fetchContacts(page);
    } catch (error) {
      console.error("Error archiving contact:", error);
    }
  };

  const handleDelete = async (contactId) => {
    try {
      setContacts((prev) => prev.filter((c) => c._id !== contactId));
      await deleteContact(contactId);
      fetchContacts(page);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
    setOpenDialog(false);
  };

  const handleOpenDialog = (contact) => {
    setSelectedContact(contact);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedContact(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, color: "#5D4037", mb: 3 }}
      >
        Gestion des Messages
      </Typography>

      {/* Filtres */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          variant="outlined"
          placeholder="Rechercher par email..."
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <FormControl sx={{ minWidth: 180 }} size="small">
          <Select
            value={filterSujet}
            onChange={(e) => setFilterSujet(e.target.value)}
          >
            <MenuItem value="tous">Tous les sujets</MenuItem>
            <MenuItem value="service client">Service client</MenuItem>
            <MenuItem value="webmaster">Webmaster</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }} size="small">
          <Select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
          >
            <MenuItem value="tous">Tous les statuts</MenuItem>
            <MenuItem value="non lu">Non lus</MenuItem>
            <MenuItem value="lu">Lus</MenuItem>
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
                <TableCell sx={{ fontWeight: 600 }}>Expéditeur</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Sujet</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress color="primary" size={60} />
                  </TableCell>
                </TableRow>
              ) : contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    Aucun message trouvé
                  </TableCell>
                </TableRow>
              ) : error ? (
                <Box sx={{ color: "red", textAlign: "center", py: 2 }}>
                  {error}
                </Box>
              ) : (
                contacts.map((contact) => (
                  <TableRow key={contact._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={`https://ui-avatars.com/api/?name=${
                            contact.email.split("@")[0]
                          }&background=F8F5F2&color=5D4037`}
                          sx={{ width: 36, height: 36, mr: 2 }}
                        />
                        <Box>
                          <Typography>{contact.email}</Typography>
                          {contact.clientId && (
                            <Typography variant="body2" color="text.secondary">
                              {contact.clientId.nom} {contact.clientId.prenom}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={contact.sujet}
                        size="small"
                        sx={{
                          backgroundColor: sujetColors[contact.sujet].bg,
                          color: sujetColors[contact.sujet].color,
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ maxWidth: 200 }}>
                        {contact.message.substring(0, 60)}
                        {contact.message.length > 60 ? "..." : ""}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={contact.statut}
                        size="small"
                        sx={{
                          backgroundColor: statusColors[contact.statut].bg,
                          color: statusColors[contact.statut].color,
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(contact.dateCreation).toLocaleDateString(
                        "fr-FR"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Voir le message">
                        <IconButton
                          onClick={() => handleOpenDialog(contact)}
                          sx={{ color: "#5D4037" }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={
                          contact.statut === "non lu"
                            ? "Marquer comme lu"
                            : "Marquer comme non lu"
                        }
                      >
                        <IconButton
                          onClick={() =>
                            toggleStatut(contact._id, contact.statut)
                          }
                          sx={{
                            color:
                              contact.statut === "non lu"
                                ? "#2E7D32"
                                : "#FF8F00",
                          }}
                        >
                          {contact.statut === "non lu" ? (
                            <CheckCircleIcon />
                          ) : (
                            <RefreshIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Archiver">
                        <IconButton
                          onClick={() => handleArchive(contact._id)}
                          sx={{ color: "#D32F2F" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Paper>

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedContact && (
          <>
            <DialogTitle sx={{ fontWeight: 600 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EmailIcon color="primary" sx={{ mr: 1 }} />
                Message de {selectedContact.email}
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Sujet:
                </Typography>
                <Chip
                  label={selectedContact.sujet}
                  sx={{
                    backgroundColor: sujetColors[selectedContact.sujet].bg,
                    color: sujetColors[selectedContact.sujet].color,
                    fontWeight: 500,
                    mb: 2,
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Statut:
                </Typography>
                <Chip
                  label={selectedContact.statut}
                  sx={{
                    backgroundColor: statusColors[selectedContact.statut].bg,
                    color: statusColors[selectedContact.statut].color,
                    fontWeight: 500,
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Date:
                </Typography>
                <Typography>
                  {new Date(selectedContact.dateCreation).toLocaleString(
                    "fr-FR"
                  )}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Message:
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: "#FAFAFA",
                    borderRadius: 1,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedContact.message}
                </Paper>
              </Box>

              {selectedContact.clientId && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                      Informations client:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar
                        src={`https://ui-avatars.com/api/?name=${selectedContact.clientId.nom}+${selectedContact.clientId.prenom}&background=F8F5F2&color=5D4037`}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                      <Box>
                        <Typography>
                          {selectedContact.clientId.nom}{" "}
                          {selectedContact.clientId.prenom}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedContact.clientId.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography>
                      Téléphone: {selectedContact.clientId.telephone}
                    </Typography>
                  </Box>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                startIcon={
                  selectedContact.statut === "non lu" ? (
                    <CheckCircleIcon />
                  ) : (
                    <RefreshIcon />
                  )
                }
                onClick={() => {
                  toggleStatut(selectedContact._id, selectedContact.statut);
                  handleCloseDialog();
                }}
              >
                {selectedContact.statut === "non lu"
                  ? "Marquer comme lu"
                  : "Marquer comme non lu"}
              </Button>
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                onClick={() => handleDelete(selectedContact._id)}
              >
                Supprimer
              </Button>
              <Button onClick={handleCloseDialog}>Fermer</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="info"
          onClose={() => setShowSnackbar(false)}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ContactAdmin;
