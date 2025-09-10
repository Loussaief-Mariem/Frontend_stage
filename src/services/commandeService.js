import api from "./api";

// Obtenir le nombre total de Commandes
export const getCommandeCount = async () => {
  const res = await api.get("/commandes/count");
  return res.data.totalCommandes;
};
//
export const getDailySales = async () => {
  const res = await api.get("/commandes/daily-sales");
  return res.data;
};
//  Créer une commande à partir d’un panier
export const createCommande = async (panierId, data) => {
  const res = await api.post(`/commandes/${panierId}`, data);
  return res.data;
};

//  Récupérer toutes les commandes
export const getAllCommandes = async () => {
  const res = await api.get("/commandes");
  return res.data;
};

//  Récupérer une commande par ID
export const getCommandeById = async (id) => {
  const res = await api.get(`/commandes/${id}`);
  return res.data;
};

//  Mettre à jour une commande
export const updateCommande = async (id, data) => {
  const res = await api.put(`/commandes/${id}`, data);
  return res.data;
};

//  Supprimer une commande
export const deleteCommande = async (id) => {
  const res = await api.delete(`/commandes/${id}`);
  return res.data;
};

//  Obtenir commandes paginées
export const getCommandesPagines = async (page, limit) => {
  const res = await api.get(`/commandes/pagines?page=${page}&limit=${limit}`);
  return res.data;
};

//  Mettre à jour le total d’une commande
export const updateTotalCommande = async (commandeId, data) => {
  const res = await api.put(
    `/commandes/commande/update-total/${commandeId}`,
    data
  );
  return res.data;
};
// annuler  facture , commande , panier , lignepanier , ligneCommande et ligneFacture
export const annulerCommandeGlobale = async (id) => {
  const res = await api.put(`/commandes/${id}/annuler`);
  return res.data;
};
// Récupérer les commandes d’un client triées par date (récentes d’abord)
export const getCommandesByClient = async (clientId) => {
  const res = await api.get(`/commandes/client/${clientId}`);
  return res.data;
};
