import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  styled,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  getDailySales,
  getCommandeCount,
} from "../../services/commandeService";
import { getProduitCount } from "../../services/produitService";
import { getCategorieCount } from "../../services/categorieService";
import { getContactsToday } from "../../services/contactService";

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  backgroundColor: "#F8F5F2",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "translateY(-3px)",
  },
}));

function Dashboard() {
  const [stats, setStats] = useState({
    produits: 0,
    categories: 0,
    commandes: 0,
    dailySales: 0,
    newContacts: 0,
    todayOrders: 0,
    recentContacts: [],
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [produits, categories, commandes, dailySales, contacts] =
          await Promise.all([
            getProduitCount(),
            getCategorieCount(),
            getCommandeCount(),
            getDailySales(),
            getContactsToday(),
          ]);

        setStats({
          produits: produits,
          categories: categories,
          commandes: commandes,
          dailySales: dailySales,
          todayOrders: dailySales.count,
          newContacts: contacts.count,
          recentContacts: contacts.list.slice(0, 3),
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  if (stats.loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "1200px", mx: "auto", p: 2 }}>
      {/* En-tête */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: "#5D4037" }}>
          Tableau de Bord
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#795548" }}>
          Bienvenue dans l'administration Nawara
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "#795548" }}>
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Typography>
      </Box>

      {/* Première ligne - Statistiques principales */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { name: "Produits", value: stats.produits },
          { name: "Catégories", value: stats.categories },
          { name: "Commandes", value: stats.commandes },
        ].map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <StatCard>
              <Typography variant="subtitle1" sx={{ color: "#C29788" }}>
                {stat.name}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stat.value}
              </Typography>
            </StatCard>
          </Grid>
        ))}
      </Grid>

      {/* Deuxième ligne - Récapitulatif journalier */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { name: "Commandes aujourd'hui", value: stats.todayOrders },
          {
            name: "Chiffre d'affaires",
            value: `${stats.dailySales.total} TND`,
          },
          { name: "Nouveaux contacts", value: stats.newContacts },
        ].map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <StatCard>
              <Typography variant="subtitle1" sx={{ color: "#C29788" }}>
                {stat.name}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stat.value}
              </Typography>
            </StatCard>
          </Grid>
        ))}
      </Grid>

      {/* Section Messages récents - version large */}
      <Paper
        sx={{
          p: 3,
          mt: 4,
          borderRadius: "12px",
          backgroundColor: "#F8F5F2",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#5D4037",
            mb: 3,
            fontWeight: 600,
            pb: 1,
            borderBottom: "1px solid #E0E0E0",
          }}
        >
          Messages récents
        </Typography>

        {stats.recentContacts.length > 0 ? (
          <List sx={{ width: "100%" }}>
            {stats.recentContacts.map((contact, index) => (
              <React.Fragment key={index}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    mb: 2,
                    p: 2,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {contact.nom}
                        </Typography>
                        <Chip
                          label={new Date(contact.date).toLocaleTimeString(
                            "fr-FR"
                          )}
                          size="small"
                          sx={{ backgroundColor: "#EFEBE9" }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ display: "block", mb: 1 }}
                        >
                          {contact.email} • {contact.sujet}
                        </Typography>
                        {`${contact.message.substring(0, 120)}${
                          contact.message.length > 120 ? "..." : ""
                        }`}
                      </>
                    }
                  />
                </ListItem>
                {index < stats.recentContacts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="body1" sx={{ color: "#795548" }}>
              Aucun nouveau message aujourd'hui
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Dashboard;
