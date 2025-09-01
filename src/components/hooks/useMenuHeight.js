import { useTheme, useMediaQuery } from "@mui/material";

const useMenuHeight = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  if (isMobile) {
    return 90;
  } else {
    return 154;
  }
};

export default useMenuHeight;
