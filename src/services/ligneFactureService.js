import api from "./api"; // ton axios instance

// Récupérer toutes les lignes de factures
export const getAllLignesFacture = async () => {
  const response = await api.get("/ligne_factures");
  return response.data;
};

// Récupérer une ligne de facture par ID
export const getLigneFactureById = async (id) => {
  const response = await api.get(`/ligne_factures/${id}`);
  return response.data;
};

// Mettre à jour une ligne de facture
export const updateLigneFacture = async (id, ligneData) => {
  const response = await api.put(`/ligne_factures/${id}`, ligneData);
  return response.data;
};

// Supprimer/annuler toutes les lignes d’une facture
export const annulerLignesFacture = async (factureId) => {
  const response = await api.delete(`/ligne_factures/annuler/${factureId}`);
  return response.data;
};
