import api from "./api";

// Obtenir le nombre total de produits
export const getProduitCount = async () => {
  try {
    const res = await api.get("/produits/count");
    return res.data.totalProduits;
  } catch (error) {
    console.error("Erreur récupération count produits:", error);
    throw error;
  }
};

// Produits paginés
export const getProduitsPagines = async (page = 1, limit = 4) => {
  try {
    const res = await api.get(`/produits/pagines?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("Erreur récupération produits paginés:", error);
    throw error;
  }
};

// Récupérer tous les produits
export const getAllProduits = async () => {
  try {
    const res = await api.get("/produits");
    return res.data;
  } catch (error) {
    console.error("Erreur récupération tous les produits:", error);
    throw error;
  }
};

// Récupérer un produit par ID
export const getProduitById = async (id) => {
  try {
    const res = await api.get(`/produits/${id}`);
    return res.data;
  } catch (error) {
    console.error("Erreur récupération produit:", error);
    throw error;
  }
};

// Ajouter produit
export const addProduit = async (prod) => {
  try {
    const res = await api.post("/produits", prod);
    return res.data;
  } catch (error) {
    console.error("Erreur ajout produit:", error);
    throw error;
  }
};

// Modifier produit
export const updateProduit = async (id, prod) => {
  try {
    const res = await api.put(`/produits/${id}`, prod);
    return res.data;
  } catch (error) {
    console.error("Erreur modification produit:", error);
    throw error;
  }
};

// Supprimer produit
export const deleteProduit = async (id) => {
  try {
    const res = await api.delete(`/produits/${id}`);
    return res.data;
  } catch (error) {
    console.error("Erreur suppression produit:", error);
    throw error;
  }
};

// Récupérer les best-sellers
export const getBestSellers = async (limit = 10) => {
  try {
    const res = await api.get(`/produits/best-sellers?limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("Erreur récupération best-sellers:", error);
    throw error;
  }
};

// Récupérer les best-sellers paginés
export const getBestSellersPaginated = async (page = 1, limit = 10) => {
  try {
    const res = await api.get(
      `/produits/best-sellers/paginated?page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    console.error("Erreur récupération best-sellers paginés:", error);
    throw error;
  }
};

// Récupérer les nouveaux produits (de cette année)
export const getNouveauxProduits = async () => {
  try {
    const res = await api.get("/produits/nouveaux");
    return res.data;
  } catch (error) {
    console.error("Erreur récupération nouveaux produits:", error);
    throw error;
  }
};
