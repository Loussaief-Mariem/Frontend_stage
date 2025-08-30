import api from "./api"; // axios instance configurée avec baseURL

// Ajouter une ligne au panier
export const ajouterLignePanier = async (ligneData) => {
  const res = await api.post("/ligne-panier", ligneData);
  return res.data;
};

// Obtenir toutes les lignes d'un panier
export const getLignesByPanier = async (panierId) => {
  const res = await api.get(`/ligne-panier/${panierId}`);
  return res.data;
};

// Modifier une ligne par son id
export const modifierLigne = async (id, ligneData) => {
  const res = await api.put(`/ligne-panier/${id}`, ligneData);
  return res.data;
};

// Supprimer une ligne dans un panier par panierId et numLigne
export const supprimerLignePanier = async (panierId, numLigne) => {
  const res = await api.delete(`/ligne-panier/${panierId}/${numLigne}`);
  return res.data;
};
