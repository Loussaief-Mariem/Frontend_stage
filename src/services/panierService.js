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
    console.log("Recherche du panier actif pour le client:", clientId);
    const res = await api.get(`/paniers/client/${clientId}/actif`);
    console.log("Panier actif trouvé:", res.data);
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log("Aucun panier actif trouvé pour le client", clientId);
      return null;
    }
    console.error("Erreur lors de la récupération du panier actif:", error);
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
export const updatePanier = async (panierId, data) => {
  try {
    const res = await api.put(`/paniers/${panierId}`, data); // <-- ajouter "s"
    return res.data;
  } catch (error) {
    console.error(
      "Erreur update panier:",
      error.response?.data || error.message
    );
    throw error;
  }
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
export const getArticlesPanier = async (panierId) => {
  try {
    const res = await api.get(`/ligne-panier/${panierId}`);
    return res.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des articles du panier:",
      error
    );
    throw error;
  }
};
// Ajouter un article au panier (API) et MAJ du stock produit
export const ajouterArticlePanier = async (panierId, produitId, quantite) => {
  try {
    // 1. Récupérer le produit pour obtenir son prix et stock actuel
    const produitResponse = await api.get(`/produits/${produitId}`);
    const produit = produitResponse.data;

    if (!produit) {
      throw new Error("Produit introuvable");
    }

    // Vérifier si le stock est suffisant
    if (produit.stock < quantite) {
      throw new Error("Stock insuffisant pour ce produit");
    }

    // 2. Ajouter la ligne de panier
    const res = await api.post("/ligne-panier", {
      panierId,
      produitId,
      quantite,
      prixUnitaire: produit.prix,
    });

    console.log("Article ajouté avec succès:", res.data);

    // 3. Mettre à jour uniquement le stock via la nouvelle API
    const nouveauStock = produit.stock - quantite;

    await api.put(`/produits/${produitId}/stock`, { stock: nouveauStock });

    console.log(
      `Stock mis à jour pour le produit ${produit.nom} : ${produit.stock} → ${nouveauStock}`
    );

    return res.data;
  } catch (error) {
    console.error(
      "Erreur lors de l'ajout d'article au panier:",
      error.response?.data || error.message
    );
    throw error;
  }
};
