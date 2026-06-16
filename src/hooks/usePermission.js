import { useState, useEffect } from "react";

export function usePermission() {
  const [permissions, setPermissions] = useState([]);

  const loadPermissions = () => {
    const stored = localStorage.getItem("wa_permissions");
    setPermissions(stored ? JSON.parse(stored) : []);
  };

  useEffect(() => {
    loadPermissions();

    const handler = () => loadPermissions();
    window.addEventListener("auth:updated", handler);

    return () => {
      window.removeEventListener("auth:updated", handler);
    };
  }, []);

  const includePermission = (permission) => {
    const requiredPermissions = Array.isArray(permission)
      ? permission
      : [permission];

    return requiredPermissions.some((p) => permissions.includes(p));
  };

  return { includePermission, permissions };
}