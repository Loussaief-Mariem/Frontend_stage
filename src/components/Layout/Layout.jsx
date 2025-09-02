import { Box } from "@mui/material";
import useMenuHeight from "../hooks/useMenuHeight";

const Layout = ({ children }) => {
  const menuHeight = useMenuHeight();

  return (
    <Box
      sx={{
        pt: `${menuHeight + 50}px`,
        minHeight: "100vh",
        backgroundColor: "#fafafa",
      }}
    >
      {children}
    </Box>
  );
};

export default Layout;
