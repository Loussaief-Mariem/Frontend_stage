import api from "./api";
// Récupérer tous les clients
export const getAllClients = async () => {
  const res = await api.get("/clients");
  return res.data;
};
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// Produits paginés
export const getClientsPagines = async (page = 1, limit = 5) => {
  const res = await api.get(`/clients/pagines?page=${page}&limit=${limit}`);
  return res.data;
};
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// Récupérer une client par ID
export const getClientById = async (id) => {
  const res = await api.get(`/clients/${id}`);
  return res.data;
};

// Ajouter une client
export const addClient = async (cat) => {
  const res = await api.post("/clients", cat);
  return res.data;
};
// modifier une client
export const updateClient = async (id, cat) => {
  const res = await api.put(`/clients/${id}`, cat);
  return res.data;
};
// supprimer une client
export const deleteClient = async (id) => {
  const res = await api.delete(`/clients/${id}`);
  return res.data;
};
// Obtenir le nombre total de clients
export const getClientCount = async () => {
  const res = await api.get("/clients/count");
  return res.data.totalclients;
};

//
export const updateUtilisateur = async (id, data) => {
  const res = await api.put(`/utilisateurs/${id}`, data);
  return res.data;
};
