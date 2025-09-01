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
function App() {
  const [role, setRole] = useState("user"); // "admin" ou "user"
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(3);

  // Vérifier l'authentification et le rôle au chargement de l'app
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        const userData = JSON.parse(user);
        setIsAuthenticated(true);
        setRole(userData.role || "user");
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Fonction pour gérer la connexion réussie
  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setRole(userData.role || "user");
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setRole("user");
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

                {/* <Route path="/" element={<HomePage />} /> */}
                {/* Routes User */}
                <Route path="/contact" element={<ContactClient />} />

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
                {/* Ajoutez une route par défaut */}
                {/* <Route path="/" element=votre composant HomePage ici /> */}
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
