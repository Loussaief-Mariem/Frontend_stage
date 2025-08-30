import api from "./api";
// Récupérer tous les categories
export const getAllCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// Produits paginés
export const getCategoriesPagines = async (page = 1, limit = 5) => {
  const res = await api.get(`/categories/pagines?page=${page}&limit=${limit}`);
  return res.data;
};
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// Récupérer une categorie par ID
export const getCategorieById = async (id) => {
  const res = await api.get(`/categories/${id}`);
  return res.data;
};

// Ajouter une categorie
export const addCategorie = async (cat) => {
  const res = await api.post("/categories", cat);
  return res.data;
};
// modifier une categorie
export const updateCategorie = async (id, cat) => {
  const res = await api.put(`/categories/${id}`, cat);
  return res.data;
};
// supprimer une categorie
export const deleteCategorie = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};
// Obtenir le nombre total de categories
export const getCategorieCount = async () => {
  const res = await api.get("/categories/count");
  return res.data.totalCategories;
};
