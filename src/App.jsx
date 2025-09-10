import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, Container } from "@mui/material";

import Menu from "./components/menu/Menu";
import Footer from "./components/Footer";

import Dashboard from "./page/admin/Dashboard";
import AffichierCategorie from "./components/categorie/AffichierCategorie";
import AffichageProduit from "./components/produit/AffichageProduit";
import Client from "./components/utilisateur/Client";
import ContactAdmin from "./components/contact/ContactAdmin";
import Panier from "./components/panier/Panier";
import Commandes from "./components/commande/GestionCommandes";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

import HomePage from "./components/Home/HomePage";
import ContactClient from "./components/contact/ContactClient";
import AfichierPanierClient from "./components/panier/AfichierPanierClient";
import ProduitsParCategorie from "./components/produit/ProduitsParCategorie";
import ProductDetail from "./components/produit/ProductDetail";
import MesCommandes from "./components/commande/MesCommande";
import RechercheProduit from "./components/produit/RechercheProduit";

import { getNombreArticlesLocal } from "./services/panierService";

function App() {
  const [role, setRole] = useState("user");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // ← Ajout d'un état de chargement

  const updateCartItemCount = async () => {
    try {
      const count = getNombreArticlesLocal();
      setCartItemCount(count);
    } catch (error) {
      console.error("Erreur lors de la récupération du panier:", error);
      setCartItemCount(0);
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        console.log("Token:", token);
        console.log("User data:", user);

        if (token && user) {
          const userData = JSON.parse(user);
          setIsAuthenticated(true);
          setRole(userData.role || "user");
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'auth:", error);
        // Nettoyage des données corrompues
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setRole("user");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
    updateCartItemCount();
  }, []);

  useEffect(() => {
    const handleCartUpdate = () => updateCartItemCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const handleLoginSuccess = async (userData) => {
    setIsAuthenticated(true);
    setRole(userData.role || "user");
    updateCartItemCount();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setRole("user");
    updateCartItemCount();
    window.location.href = "/";
  };

  // Afficher un loader pendant l'initialisation
  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Router>
      {/* Admin Layout */}
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
              pr: 3,
              mt: "64px",
              minHeight: "100vh",
              backgroundColor: "#fafafa",
            }}
          >
            <Box
              sx={{
                pt: 3,
                pb: 3,
                width: "100%",
                maxWidth: "1400px",
                ml: 0,
                mr: "auto",
                px: 0,
              }}
            >
              <Routes>
                {/* Route racine EXPLICITE */}
                <Route path="/" element={<Dashboard />} />

                {/* Routes admin */}
                <Route
                  path="/admin/categories"
                  element={<AffichierCategorie />}
                />
                <Route path="/admin/produits" element={<AffichageProduit />} />
                <Route path="/admin/clients" element={<Client />} />
                <Route path="/admin/messages" element={<ContactAdmin />} />
                <Route path="/admin/paniers" element={<Panier />} />
                <Route path="/admin/commandes" element={<Commandes />} />

                {/* Routes publiques */}
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

                {/* Catch-all - DOIT ÊTRE LA DERNIÈRE ROUTE */}
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      ) : (
        // Layout User
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Menu
            role={role}
            isAuthenticated={isAuthenticated}
            cartItemCount={cartItemCount}
            onLogout={handleLogout}
          />
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 0, width: "100%", mt: 0 }}
          >
            <Container
              maxWidth="xl"
              sx={{ px: { xs: 2, sm: 3, md: 4, lg: 4 }, py: 2 }}
            >
              <Routes>
                {/* Route racine EXPLICITE */}
                <Route path="/" element={<HomePage />} />

                {/* Routes utilisateurs */}
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
                <Route path="/contact" element={<ContactClient />} />
                <Route path="/panier" element={<AfichierPanierClient />} />
                <Route path="/commandes" element={<MesCommandes />} />
                <Route path="/recherche" element={<RechercheProduit />} />
                <Route
                  path="/categorie/:categorieId"
                  element={<ProduitsParCategorie />}
                />
                <Route path="/produit/:productId" element={<ProductDetail />} />

                {/* Catch-all - DOIT ÊTRE LA DERNIÈRE ROUTE */}
                <Route path="/" element={<HomePage />} />
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
