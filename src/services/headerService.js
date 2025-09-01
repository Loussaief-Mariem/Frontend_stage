import api from "./api";

// Créer un header
export const createHeader = async (headerData) => {
  try {
    const res = await api.post("/headers", headerData);
    return res.data;
  } catch (error) {
    console.error("Erreur création header:", error);
    throw error;
  }
};

// Récupérer tous les headers
export const getAllHeaders = async () => {
  try {
    const res = await api.get("/headers");
    return res.data;
  } catch (error) {
    console.error("Erreur récupération headers:", error);
    throw error;
  }
};

// Récupérer les headers actifs
export const getActiveHeaders = async () => {
  try {
    const res = await api.get("/headers/active");
    return res.data;
  } catch (error) {
    console.error("Erreur récupération headers actifs:", error);
    throw error;
  }
};

// Récupérer un header par ID
export const getHeaderById = async (id) => {
  try {
    const res = await api.get(`/headers/${id}`);
    return res.data;
  } catch (error) {
    console.error("Erreur récupération header:", error);
    throw error;
  }
};

// Modifier un header
export const updateHeader = async (id, headerData) => {
  try {
    const res = await api.put(`/headers/${id}`, headerData);
    return res.data;
  } catch (error) {
    console.error("Erreur modification header:", error);
    throw error;
  }
};

// Supprimer un header
export const deleteHeader = async (id) => {
  try {
    const res = await api.delete(`/headers/${id}`);
    return res.data;
  } catch (error) {
    console.error("Erreur suppression header:", error);
    throw error;
  }
};

// Mettre à jour l'ordre des headers
export const updateHeaderOrder = async (headersOrder) => {
  try {
    const res = await api.put("/headers/order/update", {
      headers: headersOrder,
    });
    return res.data;
  } catch (error) {
    console.error("Erreur modification ordre headers:", error);
    throw error;
  }
};
