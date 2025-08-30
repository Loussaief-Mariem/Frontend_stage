import React, { useState, useEffect } from "react";
import {
  getCategoriesPagines,
  deleteCategorie,
  updateCategorie,
  addCategorie,
} from "../../services/categorieService";
import {
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  TextField,
  MenuItem,
  Pagination,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditCategorie from "./Editcategorie";
import InsertCategorie from "./InsertCategorie";

function AffichierCategorie() {
  const [categories, setCategories] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const [showEdit, setShowEdit] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);

  const [showInsert, setShowInsert] = useState(false);

  // États pour recherche et filtre
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFamille, setSelectedFamille] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCategories(page);
  }, [page]);

  const loadCategories = async (currentPage = 1) => {
    try {
      setIsPending(true);
      const data = await getCategoriesPagines(currentPage, 5); // 5 par page
      setCategories(data.categories);
      setTotalPages(data.totalPages);
      setIsPending(false);
    } catch (err) {
      setError("Erreur lors du chargement des catégories");
      setIsPending(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette catégorie ?")) {
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      try {
        await deleteCategorie(id);
      } catch {
        alert("Erreur lors de la suppression !");
        loadCategories(page);
      }
    }
  };

  const handleEdit = (cat) => {
    setSelectedCat(cat);
    setShowEdit(true);
  };
  const handleCloseEdit = () => {
    setShowEdit(false);
    setSelectedCat(null);
  };
  const handleUpdateCategorie = async (updatedCat) => {
    setCategories((prev) =>
      prev.map((cat) => (cat._id === updatedCat._id ? updatedCat : cat))
    );
    setShowEdit(false);
    try {
      await updateCategorie(updatedCat._id, updatedCat);
    } catch {
      alert("Erreur lors de la mise à jour !");
      loadCategories(page);
    }
  };

  const handleAddCategorie = async (newCat) => {
    const tempId = Date.now().toString();
    const catTemp = { ...newCat, _id: tempId };
    setCategories((prev) => [...prev, catTemp]);
    setShowInsert(false);

    try {
      const savedCat = await addCategorie(newCat);
      setCategories((prev) =>
        prev.map((cat) => (cat._id === tempId ? savedCat : cat))
      );
    } catch {
      alert("Erreur lors de l'ajout !");
      setCategories((prev) => prev.filter((cat) => cat._id !== tempId));
    }
  };

  // Filtrer selon nom et famille
  const filteredCategories = categories.filter((cat) => {
    return (
      cat.nom.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedFamille ? cat.famille === selectedFamille : true)
    );
  });

  return (
    <Box
      sx={{
        width: "100%",
        px: 0,
        mx: 0,
      }}
    >
      <Paper
        sx={{
          p: 2,
          width: "100%",
          minWidth: "100%",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          mx: 0,
        }}
      >
        {/* En-tête */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#5D4037" }}>
            Gestion des Catégories
          </Typography>

          {/* Barre de recherche et filtres */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Rechercher par nom"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 200 }}
            />
            <TextField
              select
              label="Filtrer par famille"
              variant="outlined"
              size="small"
              value={selectedFamille}
              onChange={(e) => setSelectedFamille(e.target.value)}
              sx={{ width: 200 }}
            >
              <MenuItem value="">Toutes</MenuItem>
              <MenuItem value="visage">Visage</MenuItem>
              <MenuItem value="cheveux">Cheveux</MenuItem>
              <MenuItem value="huile végétale">Huile végétale</MenuItem>
              <MenuItem value="homme">Homme</MenuItem>
            </TextField>
            <Button
              variant="contained"
              onClick={() => setShowInsert(true)}
              sx={{
                backgroundColor: "#C29788",
                "&:hover": { backgroundColor: "#A57F72" },
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Nouvelle catégorie
            </Button>
          </Box>
        </Box>

        {isPending ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress color="primary" size={60} />
          </Box>
        ) : error ? (
          <Box sx={{ color: "red", textAlign: "center", py: 2 }}>{error}</Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: "max-content" }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#F8F5F2" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#5D4037" }}>
                      Nom
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#5D4037" }}>
                      Description
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#5D4037" }}>
                      Famille
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#5D4037" }}>
                      Image
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 600, color: "#5D4037" }}
                      align="center"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCategories.map((cat) => (
                    <TableRow key={cat._id} hover>
                      <TableCell>{cat.nom}</TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        {cat.description}
                      </TableCell>
                      <TableCell>{cat.famille}</TableCell>
                      <TableCell>
                        <img
                          src={cat.image}
                          alt={cat.nom}
                          width={50}
                          style={{ borderRadius: 5 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(cat)}
                          sx={{ "&:hover": { backgroundColor: "#F8F5F2" } }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(cat._id)}
                          sx={{ "&:hover": { backgroundColor: "#F8F5F2" } }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
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

        {/* Modals */}
        {selectedCat && (
          <EditCategorie
            show={showEdit}
            handleClose={handleCloseEdit}
            cat={selectedCat}
            handleSave={handleUpdateCategorie}
          />
        )}
        {showInsert && (
          <InsertCategorie
            show={showInsert}
            handleClose={() => setShowInsert(false)}
            handleSave={handleAddCategorie}
          />
        )}
      </Paper>
    </Box>
  );
}
export default AffichierCategorie;
