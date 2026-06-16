let cachedPermissions = [];

const loadPermissions = () => {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("wa_permissions");
  cachedPermissions = stored ? JSON.parse(stored) : [];
};

// Initial load
if (typeof window !== "undefined") {
  loadPermissions();

  // 🔔 Live sync when refresh token updates
  window.addEventListener("auth:updated", loadPermissions);
}

export function includePermission(permission) {
  if (typeof window === "undefined") return false;

  const requiredPermissions = Array.isArray(permission)
    ? permission
    : [permission];

  return requiredPermissions.some((p) => cachedPermissions.includes(p));
}