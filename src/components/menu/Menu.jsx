import React from "react";
import AdminMenu from "./AdminMenu";
import ClientMenu from "./ClientMenu";

function Menu({ role = "user", isAuthenticated = false, cartItemCount = 0 }) {
  if (role === "admin") {
    return <AdminMenu role={role} />;
  }

  return (
    <ClientMenu
      isAuthenticated={isAuthenticated}
      cartItemCount={cartItemCount}
    />
  );
}

export default Menu;
