import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, Container } from "@mui/material";

// ... vos imports ...

function App() {
  const [role, setRole] = useState("user");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  // ... vos fonctions existantes (updateCartItemCount, useEffect, etc.) ...

  return (
    <Router>
      {/* Layout conditionnel */}
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

                {/* Catch-all - Doit être la DERNIÈRE route */}
                <Route path="*" element={<Dashboard />} />
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

                {/* Catch-all - Doit être la DERNIÈRE route */}
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
