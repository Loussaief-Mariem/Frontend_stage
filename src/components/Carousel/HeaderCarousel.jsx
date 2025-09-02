import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { getActiveHeaders } from "../../services/headerService";

const HeaderCarousel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [headers, setHeaders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const data = await getActiveHeaders();
        setHeaders(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeaders();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === headers.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? headers.length - 1 : prevIndex - 1
    );
  };

  // Auto-play
  useEffect(() => {
    if (headers.length > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [headers.length]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="600px"
        bgcolor="grey.100"
      >
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  if (headers.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="600px"
        bgcolor="grey.100"
      >
        <Typography>Aucun header disponible</Typography>
      </Box>
    );
  }

  const currentHeader = headers[currentIndex];

  return (
    <Box sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
      {/* Image du header */}
      <Box
        sx={{
          height: isMobile ? "400px" : "600px",
          backgroundImage: `url(${currentHeader.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          transition: "background-image 0.5s ease",
          width: "100%",
          minHeight: isMobile ? "400px" : "600px",
        }}
      >
        {/* Overlay sombre */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        />

        {/* Contenu texte */}
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, height: "100%", display: "flex", alignItems: "flex-end", pb: 4 }}>
          <Box
            sx={{
              textAlign: "left",
              color: "white",
              maxWidth: "600px",
              margin: "0",
              pl: 0,
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: isMobile ? "1.2rem" : "1.6rem",
                mb: 1,
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {currentHeader.title}
            </Typography>

            {currentHeader.description && (
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontSize: isMobile ? "0.7rem" : "0.9rem",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                {currentHeader.description}
              </Typography>
            )}
          </Box>
        </Container>

        {/* Navigation */}
        {headers.length > 1 && (
          <>
            <IconButton
              onClick={prevSlide}
              sx={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                zIndex: 3,
              }}
            >
              <ChevronLeft fontSize="large" />
            </IconButton>

            <IconButton
              onClick={nextSlide}
              sx={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                zIndex: 3,
              }}
            >
              <ChevronRight fontSize="large" />
            </IconButton>
          </>
        )}
      </Box>

      {/* Indicateurs */}
      {headers.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
            zIndex: 3,
          }}
        >
          {headers.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor:
                  currentIndex === index ? "white" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default HeaderCarousel;
