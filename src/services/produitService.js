import api from "./api";
// Obtenir le nombre total de produits
export const getProduitCount = async () => {
  const res = await api.get("/produits/count");
  return res.data.totalProduits;
};

// Produits paginés
export const getProduitsPagines = async (page = 1, limit = 4) => {
  const res = await api.get(`/produits/pagines?page=${page}&limit=${limit}`);
  return res.data;
};

// Récupérer tous les produits
export const getAllProduits = async () => {
  const res = await api.get("/produits");
  return res.data;
};

// Récupérer un produit par ID
export const getProduitById = async (id) => {
  const res = await api.get(`/produits/${id}`);
  return res.data;
};

// Ajouter produit
export const addProduit = async (prod) => {
  const res = await api.post("/produits", prod);
  return res.data;
};

// Modifier produit
export const updateProduit = async (id, prod) => {
  const res = await api.put(`/produits/${id}`, prod);
  return res.data;
};

// Supprimer produit
export const deleteProduit = async (id) => {
  const res = await api.delete(`/produits/${id}`);
  return res.data;
};
