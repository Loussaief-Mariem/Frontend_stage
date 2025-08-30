import api from "./api";

// Créer une facture
export const creerFacture = async (factureData) => {
  const response = await api.post("/factures", factureData);
  return response.data;
};

// Récupérer toutes les factures
export const getFactures = async () => {
  const response = await api.get("/factures");
  return response.data;
};

// Récupérer une facture par ID
export const getFactureById = async (id) => {
  const response = await api.get(`/factures/${id}`);
  return response.data;
};

// Mettre à jour une facture
export const updateFacture = async (id, factureData) => {
  const response = await api.put(`/factures/${id}`, factureData);
  return response.data;
};

// Supprimer/annuler une facture
export const annulerFacture = async (id) => {
  const response = await api.delete(`/factures/${id}`);
  return response.data;
};
