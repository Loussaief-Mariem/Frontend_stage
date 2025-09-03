import { useState, useEffect } from "react";
import Menu from "./components/menu/Menu";
import AffichierCategorie from "./components/categorie/AffichierCategorie";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./page/admin/Dashboard";
import AffichageProduit from "./components/produit/AffichageProduit";
import { Box, Container } from "@mui/material";
import Client from "./components/utilisateur/Client";
import ContactAdmin from "./components/contact/ContactAdmin";
import Panier from "./components/panier/Panier";
import Commandes from "./components/commande/GestionCommandes";
import Footer from "./components/Footer";
import ContactClient from "./components/contact/ContactClient";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import HomePage from "./components/Home/HomePage";
import {
  getPanierActif,
  getNombreArticles,
  getNombreArticlesLocal,
  getPanierLocal,
  savePanierLocal,
  createPanier,
  ajouterArticlePanier,
} from "./services/panierService";
import AfichierPanierClient from "./components/panier/AfichierPanierClient";

function App() {
  const [role, setRole] = useState("user");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Fonction pour mettre à jour le compteur du panier
  const updateCartItemCount = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (user._id && isAuthenticated) {
        // Utilisateur connecté - récupérer depuis l'API
        const panier = await getPanierActif(user._id);
        if (panier) {
          const articlesCount = await getNombreArticles(panier._id);
          setCartItemCount(articlesCount.nombreArticles || 0);
        } else {
          setCartItemCount(0);
        }
      } else {
        // Visiteur - récupérer depuis le stockage local
        const count = getNombreArticlesLocal();
        setCartItemCount(count);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du panier:", error);
      // En cas d'erreur, utiliser le panier local
      const count = getNombreArticlesLocal();
      setCartItemCount(count);
    }
  };

  // Vérifier l'authentification et le panier au chargement de l'app
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        const userData = JSON.parse(user);
        setIsAuthenticated(true);
        setRole(userData.role || "user");
        updateCartItemCount();
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Utiliser le panier local après déconnexion
        updateCartItemCount();
      }
    } else {
      // Utiliser le panier local pour les visiteurs
      updateCartItemCount();
    }
  }, []);

  // Écouter les événements de mise à jour du panier
  useEffect(() => {
    const handleCartUpdate = () => {
      updateCartItemCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // Fonction pour gérer la connexion réussie
  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setRole(userData.role || "user");

    // Après connexion, migrer le panier local vers le panier de l'utilisateur
    const panierLocal = getPanierLocal();
    if (panierLocal.articles.length > 0) {
      // Ici, vous devriez ajouter une fonction pour migrer le panier local vers le panier API
      migrerPanierVersAPI(userData._id, panierLocal);
    }

    updateCartItemCount();
  };

  // Fonction pour migrer le panier local vers l'API
  const migrerPanierVersAPI = async (userId, panierLocal) => {
    try {
      // Récupérer ou créer un panier actif pour l'utilisateur
      let panier = await getPanierActif(userId);
      if (!panier) {
        panier = await createPanier({ clientId: userId, statut: "actif" });
      }

      // Ajouter chaque article du panier local au panier API
      for (const article of panierLocal.articles) {
        await ajouterArticlePanier(
          panier._id,
          article.produitId,
          article.quantite
        );
      }

      // Vider le panier local après migration réussie
      savePanierLocal({ articles: [], total: 0 });

      // Déclencher une mise à jour du compteur
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error) {
      console.error("Erreur lors de la migration du panier:", error);
    }
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setRole("user");

    // Mettre à jour le compteur avec le panier local
    updateCartItemCount();

    window.location.href = "/";
  };
  return (
    <Router>
      {/* Structure conditionnelle pour admin vs client */}
      {role === "admin" ? (
        <Box sx={{ display: "flex" }}>
          <Menu
            role={role}
            isAuthenticated={isAuthenticated}
            cartItemCount={cartItemCount}
            onLogout={handleLogout}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 0,
              width: `calc(100% - 240px)`,
              ml: "240px",
              mt: "64px",
              maxWidth: "none",
              minHeight: "100vh",
              backgroundColor: "#fafafa",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* Contenu principal pour l'admin */}
            <Box sx={{ p: 3, width: "100%", maxWidth: "1400px" }}>
              <Routes>
                <Route path="/admin" element={<Dashboard />} />
                <Route
                  path="/admin/categories"
                  element={<AffichierCategorie />}
                />
                <Route path="/admin/produits" element={<AffichageProduit />} />
                <Route path="/admin/clients" element={<Client />} />
                <Route path="/admin/messages" element={<ContactAdmin />} />
                <Route path="/admin/paniers" element={<Panier />} />
                <Route path="/admin/commandes" element={<Commandes />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Menu
            role={role}
            isAuthenticated={isAuthenticated}
            cartItemCount={cartItemCount}
            onLogout={handleLogout}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 0,
              width: "100%",
              mt: 0,
              maxWidth: "none",
            }}
          >
            <Container
              maxWidth="xl"
              sx={{ px: { xs: 2, sm: 3, md: 4, lg: 4 } }}
            >
              <Routes>
                {/* Routes User */}
                <Route path="/contact" element={<ContactClient />} />
                <Route path="/panier" element={<AfichierPanierClient />} />
                <Route
                  path="/connexion"
                  element={<Login onLoginSuccess={handleLoginSuccess} />}
                />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/reset-password/:id/:token"
                  element={<ResetPassword />}
                />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Container>
          </Box>
          <Footer />
        </Box>
      )}
    </Router>
  );
}

export default App;
