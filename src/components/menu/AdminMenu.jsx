import React from "react";
import { menuItems } from "./menuConfig";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Button,
  ListItemButton, // ← Ajouter ListItemButton
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  ShoppingBasket as ProductIcon,
  Receipt as OrderIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  ShoppingCart as CartIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

function AdminMenu({ role, onLogout }) {
  const icons = {
    "/admin": <DashboardIcon />,
    "/admin/categories": <CategoryIcon />,
    "/admin/produits": <ProductIcon />,
    "/admin/commandes": <OrderIcon />,
    "/admin/clients": <PeopleIcon />,
    "/admin/messages": <EmailIcon />,
    "/admin/paniers": <CartIcon />,
    "/commandes": <OrderIcon />,
  };

  return (
    <>
      {/* Top bar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: "white",
          color: "#5D4037",
          boxShadow: "none",
          borderBottom: "1px solid #EDE7E3",
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 600 }}>
            Tableau de Bord ({role})
          </Typography>
          <Avatar
            src="https://res.cloudinary.com/dx90dxjb0/image/upload/v1754422758/Capture_d_%C3%A9cran_2025-08-05_203339_tx4rmd.png"
            sx={{ width: 40, height: 40 }}
          />
          {onLogout && (
            <Button
              onClick={onLogout}
              startIcon={<LogoutIcon />}
              sx={{
                ml: 2,
                color: "#5D4037",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "#F8F5F2",
                },
              }}
            >
              Déconnexion
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "white",
            borderRight: "1px solid #EDE7E3",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80px !important",
          }}
        >
          <Avatar
            src="https://res.cloudinary.com/dx90dxjb0/image/upload/v1754422758/Capture_d_%C3%A9cran_2025-08-05_203339_tx4rmd.png"
            sx={{
              width: 60,
              height: 60,
              border: "2px solid #C29788",
            }}
          />
        </Toolbar>

        <Divider />

        <List>
          {menuItems[role].map((item) => (
            // REMPLACER ListItem par ListItemButton
            <ListItemButton
              key={item.path}
              component="a"
              href={item.path}
              sx={{
                px: 3,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#F8F5F2",
                  "& .MuiListItemIcon-root": {
                    color: "#C29788",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: "#5D4037", minWidth: "40px" }}>
                {icons[item.path]}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 500,
                  color: "#5D4037",
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default AdminMenu;
