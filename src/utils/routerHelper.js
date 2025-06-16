export const routeHelpers = {
    // Check if current route requires auth
    requiresAuth: (route) => {
        return route.matched.some((record) => record.meta.requiresAuth);
    },

    // Get required roles for current route
    getRequiredRoles: (route) => {
        const matched = route.matched.find((record) => record.meta.requiresRole);
        return matched ? matched.meta.requiresRole : [];
    },

    // Get required permissions for current route
    getRequiredPermissions: (route) => {
        const matched = route.matched.find((record) => record.meta.requiresPermission);
        return matched ? matched.meta.requiresPermission : [];
    }
};
