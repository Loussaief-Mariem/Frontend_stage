import { useState } from "react";
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
function App() {
  const [role, setRole] = useState("user"); // "admin" ou "user"
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(3);

  return (
    <Router>
      {/* Structure conditionnelle pour admin vs client */}
      {role === "admin" ? (
        <Box sx={{ display: "flex" }}>
          <Menu
            role={role}
            isAuthenticated={isAuthenticated}
            cartItemCount={cartItemCount}
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
            }}
          >
            {/* Ajout d'espace à gauche et à droite pour l'admin */}
            <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
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
            </Container>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Menu
            role={role}
            isAuthenticated={isAuthenticated}
            cartItemCount={cartItemCount}
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
            {/* Ajout d'espace à gauche et à droite pour le client */}
            <Container
              maxWidth="xl"
              sx={{ px: { xs: 2, sm: 3, md: 4, lg: 4 } }}
            >
              <Routes>
                {/* Routes User */}
                {/* Exemple : tu peux ajouter tes pages client */}
                {/* <Route path="/" element={<HomePage />} /> */}
              </Routes>
            </Container>
          </Box>
          {/* <Footer /> */}
        </Box>
      )}
    </Router>
  );
}

export default App;
