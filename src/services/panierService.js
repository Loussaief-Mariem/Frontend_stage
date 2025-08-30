import api from "./api"; // ton instance axios configurée

// Créer un panier
export const createPanier = async (panierData) => {
  const res = await api.post("/paniers", panierData);
  return res.data;
};

export const getPaniersPagines = async (page = 1, limit = 4) => {
  const res = await api.get(`/paniers/pagines?page=${page}&limit=${limit}`);
  return res.data;
};

// Obtenir tous les paniers
export const getAllPaniers = async () => {
  const res = await api.get("/paniers");
  return res.data;
};

// Obtenir un panier par ID
export const getPanierById = async (id) => {
  const res = await api.get(`/paniers/${id}`);
  return res.data;
};

// Mettre à jour un panier
export const updatePanier = async (id, panierData) => {
  const res = await api.put(`/paniers/${id}`, panierData);
  return res.data;
};

// Supprimer un panier
export const deletePanier = async (id) => {
  const res = await api.delete(`/paniers/${id}`);
  return res.data;
};

// Obtenir le total d’un panier
export const getTotalPanier = async (id) => {
  const res = await api.get(`/paniers/${id}/total`);
  return res.data;
};
