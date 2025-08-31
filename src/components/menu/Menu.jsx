import React from "react";
import AdminMenu from "./AdminMenu";
import ClientMenu from "./ClientMenu";

function Menu({ role = "user", isAuthenticated = false, cartItemCount = 0, onLogout }) {
  if (role === "admin") {
    return <AdminMenu role={role} onLogout={onLogout} />;
  }

  return (
    <ClientMenu
      isAuthenticated={isAuthenticated}
      cartItemCount={cartItemCount}
      onLogout={onLogout}
    />
  );
}

export default Menu;
