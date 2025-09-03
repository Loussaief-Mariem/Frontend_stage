import api from "./api";

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

// Obtenir le panier actif d'un client
export const getPanierActif = async (clientId) => {
  try {
    const res = await api.get(`/paniers/client/${clientId}/actif`);
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // Aucun panier actif trouvé
    }
    throw error;
  }
};

// Obtenir le nombre d'articles dans un panier
export const getNombreArticles = async (panierId) => {
  try {
    const res = await api.get(`/paniers/${panierId}/nombre-articles`);
    return res.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du nombre d'articles:",
      error
    );
    throw error;
  }
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

// Obtenir le total d'un panier
export const getTotalPanier = async (id) => {
  const res = await api.get(`/paniers/${id}/total`);
  return res.data;
};

// Gestion du panier local (session)
export const getPanierLocal = () => {
  const panierStr = sessionStorage.getItem("panierLocal");
  return panierStr ? JSON.parse(panierStr) : { articles: [], total: 0 };
};

export const savePanierLocal = (panier) => {
  sessionStorage.setItem("panierLocal", JSON.stringify(panier));
  return panier;
};

export const ajouterArticleLocal = (produit, quantite = 1) => {
  const panier = getPanierLocal();
  const articleIndex = panier.articles.findIndex(
    (article) => article.produitId === produit._id
  );

  if (articleIndex !== -1) {
    // Article existe déjà, mise à jour de la quantité
    panier.articles[articleIndex].quantite += quantite;
  } else {
    // Nouvel article
    panier.articles.push({
      produitId: produit._id,
      nom: produit.nom,
      prix: produit.prix,
      image: produit.image,
      quantite: quantite,
    });
  }

  // Recalculer le total
  panier.total = panier.articles.reduce(
    (total, article) => total + article.prix * article.quantite,
    0
  );

  return savePanierLocal(panier);
};

export const getNombreArticlesLocal = () => {
  const panier = getPanierLocal();
  return panier.articles.reduce(
    (total, article) => total + article.quantite,
    0
  );
};

// Mettre à jour la quantité d'un article dans le panier local
export const updateQuantiteArticleLocal = (produitId, nouvelleQuantite) => {
  const panier = getPanierLocal();
  const articleIndex = panier.articles.findIndex(
    (article) => article.produitId === produitId
  );

  if (articleIndex !== -1) {
    if (nouvelleQuantite <= 0) {
      // Supprimer l'article si la quantité est 0 ou moins
      panier.articles.splice(articleIndex, 1);
    } else {
      // Mettre à jour la quantité
      panier.articles[articleIndex].quantite = nouvelleQuantite;
    }

    // Recalculer le total
    panier.total = panier.articles.reduce(
      (total, article) => total + article.prix * article.quantite,
      0
    );

    return savePanierLocal(panier);
  }

  return panier;
};

// Supprimer un article du panier local
export const supprimerArticleLocal = (produitId) => {
  const panier = getPanierLocal();
  const articleIndex = panier.articles.findIndex(
    (article) => article.produitId === produitId
  );

  if (articleIndex !== -1) {
    panier.articles.splice(articleIndex, 1);

    // Recalculer le total
    panier.total = panier.articles.reduce(
      (total, article) => total + article.prix * article.quantite,
      0
    );

    return savePanierLocal(panier);
  }

  return panier;
};

// Fonctions pour les lignes de panier (API)
export const ajouterArticlePanier = async (panierId, produitId, quantite) => {
  const res = await api.post("/ligne-panier", {
    panierId,
    produitId,
    quantite,
  });
  return res.data;
};

export const getArticlesPanier = async (panierId) => {
  const res = await api.get(`/ligne-panier/${panierId}`);
  return res.data;
};

export const updateQuantiteArticle = async (panierId, produitId, quantite) => {
  // Cette implémentation dépend de votre API
  // Vous devrez peut-être adapter selon votre structure de routes
  const res = await api.put(`/ligne-panier/${panierId}/${produitId}`, {
    quantite,
  });
  return res.data;
};

export const supprimerArticlePanier = async (panierId, produitId) => {
  // Cette implémentation dépend de votre API
  const res = await api.delete(`/ligne-panier/${panierId}/${produitId}`);
  return res.data;
};
