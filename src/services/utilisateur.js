import api from "./api";
// Récupérer tous les utilisateurs
export const getAllUtilisateurs = async () => {
  const res = await api.get("/utilisateurs");
  return res.data;
};
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// // Produits paginés
// export const getUtilisateursPagines = async (page = 1, limit = 5) => {
//   const res = await api.get(`/utilisateurs/pagines?page=${page}&limit=${limit}`);
//   return res.data;
// };
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// Récupérer une utilisateur par ID
export const getUtilisateurById = async (id) => {
  const res = await api.get(`/utilisateurs/${id}`);
  return res.data;
};

// Ajouter une utilisateur
export const addUtilisateur = async (cat) => {
  const res = await api.post("/utilisateurs", cat);
  return res.data;
};
// modifier une utilisateur
export const updateUtilisateur = async (id, cat) => {
  const res = await api.put(`/utilisateurs/${id}`, cat);
  return res.data;
};
// supprimer une utilisateur
export const deleteUtilisateur = async (id) => {
  const res = await api.delete(`/utilisateurs/${id}`);
  return res.data;
};

// // Obtenir le nombre total de utilisateurs
// export const getUtilisateurCount = async () => {
//   const res = await api.get("/utilisateurs/count");
//   return res.data.totalutilisateurs;
// };
