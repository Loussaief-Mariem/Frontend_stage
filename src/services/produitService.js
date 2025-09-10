import api from "./api";

// Obtenir le nombre total de produits
export const getProduitCount = async () => {
  try {
    const res = await api.get("/produits/count");
    return res.data.totalProduits;
  } catch (error) {
    console.error("Erreur récupération count produits:", error);
    throw error;
  }
};

// Produits paginés
export const getProduitsPagines = async (page = 1, limit = 4) => {
  try {
    const res = await api.get(`/produits/pagines?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("Erreur récupération produits paginés:", error);
    throw error;
  }
};

// Récupérer tous les produits
export const getAllProduits = async () => {
  try {
    const res = await api.get("/produits");
    return res.data;
  } catch (error) {
    console.error("Erreur récupération tous les produits:", error);
    throw error;
  }
};

// Récupérer un produit par ID
export const getProduitById = async (id) => {
  try {
    const res = await api.get(`/produits/${id}`);
    return res.data;
  } catch (error) {
    console.error("Erreur récupération produit:", error);
    throw error;
  }
};

// Ajouter produit
export const addProduit = async (prod) => {
  try {
    const res = await api.post("/produits", prod);
    return res.data;
  } catch (error) {
    console.error("Erreur ajout produit:", error);
    throw error;
  }
};

// Modifier produit
export const updateProduit = async (id, prod) => {
  try {
    const res = await api.put(`/produits/${id}`, prod);
    return res.data;
  } catch (error) {
    console.error("Erreur modification produit:", error);
    throw error;
  }
};

// Supprimer produit
export const deleteProduit = async (id) => {
  try {
    const res = await api.delete(`/produits/${id}`);
    return res.data;
  } catch (error) {
    console.error("Erreur suppression produit:", error);
    throw error;
  }
};

// Récupérer les best-sellers
// Récupérer les best-sellers
export const getBestSellers = async (limit = 4) => {
  try {
    const res = await api.get(`/produits/best-sellers?limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("Erreur récupération best-sellers:", error);

    try {
      // Si l'API des best-sellers échoue, on récupère des produits récents
      const res = await api.get(`/produits/pagines?page=1&limit=${limit}`);
      return res.data.produits || [];
    } catch (fallbackError) {
      console.error("Erreur fallback:", fallbackError);
      return [];
    }
  }
};

// Récupérer les best-sellers paginés
export const getBestSellersPaginated = async (page = 1, limit = 10) => {
  try {
    const res = await api.get(
      `/produits/best-sellers/paginated?page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    console.error("Erreur récupération best-sellers paginés:", error);
    throw error;
  }
};

// Récupérer les nouveaux produits (de cette année)
export const getNouveauxProduits = async () => {
  try {
    const res = await api.get("/produits/nouveaux");
    return res.data;
  } catch (error) {
    console.error("Erreur récupération nouveaux produits:", error);
    throw error;
  }
};
// Récupérer les produits par ID de catégorie (sans pagination)
export const getProduitsByCategorieId = async (categorieId) => {
  try {
    const res = await api.get(`/produits/categorie/${categorieId}`);
    return res.data;
  } catch (error) {
    console.error("Erreur récupération produits par catégorie:", error);
    throw error;
  }
};
export const getProduitsByCategorieIdPagination = async (
  categorieId,
  page = 1,
  limit = 12
) => {
  try {
    const res = await api.get(
      `/produits/categorie/${categorieId}/pagines?page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    console.error("Erreur récupération produits par catégorie paginés:", error);
    throw error;
  }
};
////////////::
// Rechercher des produits par nom
export const searchProducts = async (query, page = 1, limit = 12) => {
  try {
    const res = await api.get(
      `/produits/recherche?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    console.error("Erreur lors de la recherche:", error);

    // Fallback: récupérer tous les produits en cas d'erreur
    try {
      const allProducts = await getProduitsPagines(page, limit);
      return {
        produits: allProducts.produits || [],
        pagination: {
          page,
          limit,
          totalProduits: allProducts.totalProduits || 0,
          totalPages: allProducts.totalPages || 1,
          searchQuery: query,
          exactMatch: false,
        },
      };
    } catch (fallbackError) {
      console.error("Erreur fallback:", fallbackError);
      throw error;
    }
  }
};
