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
  const res = await api.put(`/ligne-panier/modifier/${id}`, ligneData);
  return res.data;
};

// Supprimer un produit du panier
export const supprimerLignePanier = async (panierId, ligneId) => {
  try {
    const res = await api.delete(`/ligne-panier/${panierId}/${ligneId}`);
    return res.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    throw error.response?.data || { message: "Erreur serveur" };
  }
};
