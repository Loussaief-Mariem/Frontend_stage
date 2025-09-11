import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-stage-xi.vercel.app/api/",
});
//import.meta.env.VITE_API_URL,
// // import.meta.env.VITE_API_URL,
//    "https://backend-stage-nacz9gcse-mariems-projects-43bec416.vercel.app/api",

//  Intercepteur : Ajouter Authorization: Bearer ${token} si disponible
// Ajouter le token JWT automatiquement dans chaque requête

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Récupère le token stocké
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Ajoute le token dans les headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//  Intercepteur : Gestion globale des erreurs
// Gérer les erreurs globalement (API ou réseau)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        "Erreur API :",
        error.response.data?.message || error.message
      );
    } else {
      console.error("Erreur réseau :", error.message);
    }
    // Laisser les composants gérer l’erreur si besoin
    return Promise.reject(error);
  }
);

export default api;
