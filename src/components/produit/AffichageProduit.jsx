import { useState, useEffect } from "react";
import {
  getProduitsPagines,
  deleteProduit,
  updateProduit,
  addProduit,
} from "../../services/produitService";
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
  Pagination,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditProduit from "./EditProduit";
import InsertProduit from "./InsertProduit";

function AffichageProduit() {
  const [produits, setProduits] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const [showEdit, setShowEdit] = useState(false);
  const [selectedProd, setSelectedProd] = useState(null);

  const [showInsert, setShowInsert] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadProduits(page);
  }, [page]);

  const loadProduits = async (currentPage) => {
    try {
      setIsPending(true);
      const data = await getProduitsPagines(currentPage, 4);
      setProduits(data.produits);
      setTotalPages(data.totalPages);
      setIsPending(false);
    } catch (err) {
      setError("Erreur lors du chargement des produits");
      setIsPending(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce produit ?")) {
      setProduits((prev) => prev.filter((prod) => prod._id !== id));
      try {
        await deleteProduit(id);
      } catch {
        alert("Erreur lors de la suppression !");
        loadProduits(page);
      }
    }
  };

  const handleEdit = (prod) => {
    setSelectedProd(prod);
    setShowEdit(true);
  };

  const handleUpdateProduit = async (updatedProd) => {
    const payload = {
      nom: updatedProd.nom,
      description: updatedProd.description,
      prix: updatedProd.prix,
      volume: updatedProd.volume,
      categorieId: updatedProd.categorieId,
      image: updatedProd.image,
      TVA: updatedProd.TVA,
    };

    try {
      await updateProduit(updatedProd._id, payload);
      setProduits((prev) =>
        prev.map((prod) => (prod._id === updatedProd._id ? updatedProd : prod))
      );
      setShowEdit(false);
    } catch {
      alert("Erreur lors de la mise à jour !");
      loadProduits(page);
    }
  };

  const handleAddProduit = async (newProd) => {
    const tempId = Date.now().toString();
    const prodTemp = { ...newProd, _id: tempId };
    setProduits((prev) => [...prev, prodTemp]);
    setShowInsert(false);

    try {
      const savedProd = await addProduit(newProd);
      setProduits((prev) =>
        prev.map((prod) => (prod._id === tempId ? savedProd : prod))
      );
    } catch {
      alert("Erreur lors de l'ajout !");
      setProduits((prev) => prev.filter((prod) => prod._id !== tempId));
    }
  };

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
          p: 3,
          width: "100%",
          minWidth: "100%",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          mx: 0,
        }}
      >
        {/* En-tête modifié */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#5D4037" }}>
            Gestion des Produits
          </Typography>

          <Button
            variant="contained"
            onClick={() => setShowInsert(true)}
            sx={{
              backgroundColor: "#C29788",
              "&:hover": {
                backgroundColor: "#A57F72",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              },
              borderRadius: "8px",
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Ajouter un produit
          </Button>
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
              <Table
                sx={{
                  minWidth: "max-content",
                  "& .MuiTableHead-root": {
                    backgroundColor: "#F8F5F2",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: "#5D4037" }}>
                      Nom
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#5D4037" }}>
                      Prix
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#5D4037" }}>
                      Stock
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#5D4037" }}>
                      Stock d’Alerte
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
                  {produits.map((prod) => (
                    <TableRow key={prod._id} hover>
                      <TableCell>{prod.nom}</TableCell>
                      <TableCell>{prod.prix} TND</TableCell>
                      <TableCell align="center">{prod.stock}</TableCell>
                      <TableCell align="center">
                        {prod.seuilAlertStock}
                      </TableCell>
                      <TableCell>
                        <img
                          src={prod.image}
                          alt={prod.nom}
                          width={50}
                          style={{ borderRadius: 5 }}
                          align="center"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(prod)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDelete(prod._id)}
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

        {selectedProd && (
          <EditProduit
            show={showEdit}
            handleClose={() => setShowEdit(false)}
            prod={selectedProd}
            handleSave={handleUpdateProduit}
          />
        )}

        {showInsert && (
          <InsertProduit
            show={showInsert}
            handleClose={() => setShowInsert(false)}
            handleSave={handleAddProduit}
          />
        )}
      </Paper>
    </Box>
  );
}

export default AffichageProduit;
