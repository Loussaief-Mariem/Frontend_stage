import api from "./api";

// Récupérer toutes les lignes de commande
export const getAllLignesCommande = async () => {
  const res = await api.get("/ligne_commandes");
  return res.data;
};

// Récupérer une ligne de commande par ID
export const getLigneCommandeById = async (id) => {
  const res = await api.get(`/ligne_commandes/${id}`);
  return res.data;
};

// Mettre à jour une ligne de commande
export const updateLigneCommande = async (id, data) => {
  const res = await api.put(`/ligne_commandes/${id}`, data);
  return res.data;
};

// Annuler une ligne de commande par son ID
export const annulerLigneCommande = async (id) => {
  const res = await api.delete(`/ligne_commandes/${id}`);
  return res.data;
};

// Récupérer toutes les lignes actives
export const getLignesCommandeActives = async () => {
  const res = await api.get("/ligne_commandes/actives");
  return res.data;
};
