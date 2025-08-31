import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Collapse,
  TextField,
  InputAdornment,
  Paper,
  Container,
  Typography,
  Avatar,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../../services/categorieService";

const ClientMenu = ({ isAuthenticated = false, cartItemCount = 0, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [openSubMenu, setOpenSubMenu] = useState({});
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [subMenuAnchor, setSubMenuAnchor] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    handleMenuClose();
    navigate("/connexion");
  };

  const handleLogout = () => {
    handleMenuClose();
    if (onLogout) {
      onLogout();
    }
  };

  const handleCartClick = () => {
    navigate("/panier");
  };

  const handleSubMenuClick = (famille, event) => {
    setSubMenuAnchor((prev) => ({
      ...prev,
      [famille]: event.currentTarget,
    }));
    setOpenSubMenu((prev) => ({
      ...prev,
      [famille]: !prev[famille],
    }));
  };

  const handleSubMenuClose = (famille) => {
    setOpenSubMenu((prev) => ({
      ...prev,
      [famille]: false,
    }));
  };

  const toggleMobileDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setMobileDrawerOpen(open);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Grouper les catégories par famille
  const categoriesByFamily = categories.reduce((acc, category) => {
    if (!acc[category.famille]) {
      acc[category.famille] = [];
    }
    acc[category.famille].push(category);
    return acc;
  }, {});

  const familyNames = {
    visage: "VISAGE",
    cheveux: "CHEVEUX",
    "huile végétale": "HUILE VÉGÉTALE",
    homme: "HOMME",
  };

  const topLevelFamilies = ["visage", "cheveux", "huile végétale", "homme"];

  const renderSearchBar = () => (
    <Paper
      component="form"
      onSubmit={handleSearchSubmit}
      sx={{
        display: "flex",
        alignItems: "center",
        width: { xs: 200, md: 400 },
        height: 40,
        borderRadius: 0,
        boxShadow: "none",
        border: "1px solid #e0e0e0",
        mx: { md: 4 },
      }}
    >
      <TextField
        placeholder="Rechercher dans notre catalogue"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          ml: 1,
          flex: 1,
          "& .MuiInputBase-root": {
            height: 38,
            fontSize: "0.9rem",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
        variant="outlined"
        size="small"
      />
      <InputAdornment position="end">
        <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </InputAdornment>
    </Paper>
  );

  const renderMobileMenu = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={toggleMobileDrawer(false)}
      sx={{
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ width: 280, p: 2 }} role="presentation">
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Rechercher..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearchSubmit}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <List>
          <ListItem
            button
            onClick={() => {
              navigate("/contact");
              toggleMobileDrawer(false)();
            }}
            sx={{ borderBottom: "1px solid #f0f0f0" }}
          >
            <ListItemText
              primary="Contact"
              primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }}
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        {topLevelFamilies.map(
          (famille) =>
            categoriesByFamily[famille] && (
              <Box key={famille}>
                <ListItem
                  button
                  onClick={() => handleSubMenuClick(famille)}
                  sx={{ borderBottom: "1px solid #f0f0f0" }}
                >
                  <ListItemText
                    primary={familyNames[famille] || famille}
                    primaryTypographyProps={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                    }}
                  />
                  {openSubMenu[famille] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse
                  in={openSubMenu[famille]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {categoriesByFamily[famille].map((cat) => (
                      <ListItem
                        button
                        key={cat._id}
                        sx={{ pl: 4 }}
                        onClick={() => {
                          navigate(`/categorie/${cat._id}`);
                          toggleMobileDrawer(false)();
                        }}
                      >
                        <ListItemText
                          primary={cat.nom}
                          primaryTypographyProps={{ fontSize: "0.85rem" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            )
        )}
      </Box>
    </Drawer>
  );

  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 0,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          minWidth: 180,
        },
      }}
    >
      {isAuthenticated ? (
        [
          <MenuItem
            key="profile"
            onClick={() => {
              handleMenuClose();
              navigate("/profil");
            }}
            sx={{ fontSize: "0.9rem", py: 1.5 }}
          >
            Mon Profil
          </MenuItem>,
          <MenuItem
            key="orders"
            onClick={() => {
              handleMenuClose();
              navigate("/commandes");
            }}
            sx={{ fontSize: "0.9rem", py: 1.5 }}
          >
            Mes Commandes
          </MenuItem>,
          <MenuItem
            key="logout"
            onClick={handleLogout}
            sx={{ fontSize: "0.9rem", py: 1.5 }}
          >
            Déconnexion
          </MenuItem>,
        ]
      ) : (
        <MenuItem
          key="login"
          onClick={handleLogin}
          sx={{ fontSize: "0.9rem", py: 1.5 }}
        >
          Connexion
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <>
      {/* Niveau 1: Barre de contact - Même couleur que le niveau 3 */}
      {!isMobile && (
        <Box
          sx={{
            backgroundColor: "#f8f5f2",
            color: "#5D4037",
            py: 0.5,
            px: 2,
            fontSize: "0.8rem",
            borderBottom: "1px solid #e0e0e0",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: (theme) => theme.zIndex.drawer + 2,
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Button
                color="inherit"
                onClick={() => navigate("/contact")}
                sx={{
                  fontSize: "0.8rem",
                  textTransform: "none",
                  color: "#5D4037",
                  "&:hover": {
                    backgroundColor: "rgba(93, 64, 55, 0.05)",
                  },
                }}
              >
                Contact
              </Button>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 16, color: "#5D4037" }} />
                <Typography variant="body2" sx={{ color: "#5D4037" }}>
                  +216 44 123 432
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon sx={{ fontSize: 16, color: "#5D4037" }} />
                <Typography variant="body2" sx={{ color: "#5D4037" }}>
                  contact@nawara.tn
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      )}

      {/* Niveau 2: Logo, recherche et icônes */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "white",
          color: "#5D4037",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          top: { xs: 0, md: "32px" }, // Ajuster la position pour la barre de contact
        }}
      >
        <Toolbar sx={{ minHeight: "90px !important", py: 2 }}>
          <Container
            maxWidth="xl"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo rond */}
            <Avatar
              src="https://res.cloudinary.com/dx90dxjb0/image/upload/v1754422758/Capture_d_%C3%A9cran_2025-08-05_203339_tx4rmd.png"
              alt="Nawara.tn"
              sx={{
                width: 70,
                height: 70,
                cursor: "pointer",
                border: "2px solid #f8f5f2",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              onClick={() => navigate("/")}
            />

            {/* Barre de recherche centrée */}
            {!isMobile && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flex: 1,
                  mx: 4,
                }}
              >
                {renderSearchBar()}
              </Box>
            )}

            {/* Icônes à droite */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                color="inherit"
                onClick={handleCartClick}
                sx={{ color: "#5D4037" }}
              >
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              <IconButton
                edge="end"
                color="inherit"
                onClick={handleProfileMenuOpen}
                sx={{ color: "#5D4037" }}
              >
                <AccountCircleIcon />
              </IconButton>

              {isMobile && (
                <IconButton
                  color="inherit"
                  onClick={toggleMobileDrawer(true)}
                  sx={{ color: "#5D4037" }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      {/* Niveau 3: Familles de catégories */}
      {!isMobile && (
        <Box
          sx={{
            backgroundColor: "#f8f5f2",
            borderBottom: "1px solid #e0e0e0",
            py: 1.5,
            position: "fixed",
            top: { xs: "90px", md: "122px" }, // Position en dessous de l'AppBar
            left: 0,
            right: 0,
            zIndex: (theme) => theme.zIndex.drawer,
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
              }}
            >
              {/* Lien Accueil */}
              <Button
                color="inherit"
                onClick={() => navigate("/")}
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  textTransform: "uppercase",
                  color: "#5D4037",
                  "&:hover": {
                    backgroundColor: "rgba(93, 64, 55, 0.05)",
                  },
                }}
              >
                Accueil
              </Button>

              {topLevelFamilies.map(
                (famille) =>
                  categoriesByFamily[famille] && (
                    <Box key={famille} sx={{ position: "relative" }}>
                      <Button
                        color="inherit"
                        onClick={(e) => handleSubMenuClick(famille, e)}
                        sx={{
                          fontWeight: 700,
                          fontSize: "1rem",
                          textTransform: "uppercase",
                          color: "#5D4037",
                          "&:hover": {
                            backgroundColor: "rgba(93, 64, 55, 0.05)",
                          },
                        }}
                        endIcon={
                          openSubMenu[famille] ? <ExpandLess /> : <ExpandMore />
                        }
                      >
                        {familyNames[famille] || famille}
                      </Button>
                      <Menu
                        anchorEl={subMenuAnchor[famille]}
                        open={Boolean(openSubMenu[famille])}
                        onClose={() => handleSubMenuClose(famille)}
                        sx={{
                          mt: 1,
                          "& .MuiPaper-root": {
                            borderRadius: 0,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            minWidth: 200,
                          },
                        }}
                      >
                        {categoriesByFamily[famille].map((cat) => (
                          <MenuItem
                            key={cat._id}
                            onClick={() => {
                              navigate(`/categorie/${cat._id}`);
                              handleSubMenuClose(famille);
                            }}
                            sx={{
                              fontSize: "0.9rem",
                              py: 1.5,
                              "&:hover": {
                                backgroundColor: "rgba(193, 151, 136, 0.1)",
                              },
                            }}
                          >
                            {cat.nom}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  )
              )}
            </Box>
          </Container>
        </Box>
      )}

      {renderProfileMenu}
      {isMobile && renderMobileMenu()}
    </>
  );
};

export default ClientMenu;
