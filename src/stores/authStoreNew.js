import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const DEFAULT_KEYCLOAK_KEY = 'keycloak';

export const useAuthStore = defineStore('auth', () => {
    // State
    const isAuthenticated = ref(false);
    const keycloakData = ref(null);
    const user = ref(null);
    const token = ref(null);
    const refreshToken = ref(null);
    const tokenExpiry = ref(null);
    const roles = ref([]);
    const permissions = ref([]);

    // LocalStorage watcher reference
    let unwatchKeycloak = null;

    // Getters
    const isLoggedIn = computed(() => isAuthenticated.value);
    const userName = computed(() => user.value?.name || user.value?.preferred_username || null);
    const userEmail = computed(() => user.value?.email || null);
    const userRoles = computed(() => roles.value);
    const isTokenExpired = computed(() => {
        if (!tokenExpiry.value) return true;
        return Date.now() >= tokenExpiry.value * 1000;
    });

    // Actions
    function setAuthData(keycloakValue) {
        try {
            // Parse keycloak data if it's a string
            const parsedData = typeof keycloakValue === 'string' ? JSON.parse(keycloakValue) : keycloakValue;

            // Update store state
            keycloakData.value = parsedData;
            isAuthenticated.value = true;

            // Extract token information
            if (parsedData.token) {
                token.value = parsedData.token;
            }

            if (parsedData.refreshToken) {
                refreshToken.value = parsedData.refreshToken;
            }

            if (parsedData.tokenParsed) {
                tokenExpiry.value = parsedData.tokenParsed.exp;
                user.value = {
                    id: parsedData.tokenParsed.sub,
                    name: parsedData.tokenParsed.name,
                    preferred_username: parsedData.tokenParsed.preferred_username,
                    email: parsedData.tokenParsed.email,
                    email_verified: parsedData.tokenParsed.email_verified,
                    given_name: parsedData.tokenParsed.given_name,
                    family_name: parsedData.tokenParsed.family_name,
                    ...parsedData.tokenParsed
                };

                // Extract roles
                roles.value = parsedData.tokenParsed.realm_access?.roles || [];

                // Extract resource access/permissions
                permissions.value = Object.keys(parsedData.tokenParsed.resource_access || {});
            }

            // If userInfo is available, merge it
            if (parsedData.userInfo) {
                user.value = { ...user.value, ...parsedData.userInfo };
            }

            console.log('User authenticated:', user.value);
        } catch (error) {
            console.error('Error parsing keycloak data:', error);
            clearAuth();
        }
    }

    function clearAuth() {
        // Reset all auth-related state
        isAuthenticated.value = false;
        keycloakData.value = null;
        user.value = null;
        token.value = null;
        refreshToken.value = null;
        tokenExpiry.value = null;
        roles.value = [];
        permissions.value = [];

        console.log('User logged out - auth store cleared');
    }

    async function checkKeycloakStorage() {
        const keycloakValue = localStorage.getItem(DEFAULT_KEYCLOAK_KEY);

        if (keycloakValue) {
            setAuthData(keycloakValue);
        } else {
            clearAuth();
        }
    }

    function initializeWatcher() {
        // Check initial state
        checkKeycloakStorage();

        // Set up localStorage watcher
        if (typeof window !== 'undefined' && window.localStorageWatcher) {
            unwatchKeycloak = window.localStorageWatcher.watch(
                DEFAULT_KEYCLOAK_KEY,
                (newValue, oldValue) => {
                    if (newValue) {
                        setAuthData(newValue);
                    } else {
                        clearAuth();
                    }
                },
                { deep: true }
            ); // Watch changes from other tabs too
        } else {
            // Fallback: Use storage event listener
            const handleStorageChange = (e) => {
                if (e.key === DEFAULT_KEYCLOAK_KEY) {
                    if (e.newValue) {
                        setAuthData(e.newValue);
                    } else {
                        clearAuth();
                    }
                }
            };

            window.addEventListener('storage', handleStorageChange);

            // Return cleanup function
            unwatchKeycloak = () => {
                window.removeEventListener('storage', handleStorageChange);
            };
        }

        // Poll for keycloak data after redirect (for 3rd party components)
        // This handles cases where the component sets localStorage after Vue app loads
        let pollAttempts = 0;
        const maxPollAttempts = 50; // Poll for 5 seconds max

        const pollForKeycloak = () => {
            if (pollAttempts >= maxPollAttempts) {
                return; // Stop polling after max attempts
            }

            const keycloakValue = localStorage.getItem(DEFAULT_KEYCLOAK_KEY);
            if (keycloakValue && !isAuthenticated.value) {
                console.log('Keycloak data detected via polling, updating auth state');
                setAuthData(keycloakValue);
                return; // Stop polling when found
            }

            pollAttempts++;
            setTimeout(pollForKeycloak, 100); // Poll every 100ms
        };

        // Start polling if not already authenticated
        if (!isAuthenticated.value) {
            setTimeout(pollForKeycloak, 100); // Start polling after 100ms
        }
    }

    function destroyWatcher() {
        if (unwatchKeycloak) {
            unwatchKeycloak();
            unwatchKeycloak = null;
        }
    }

    // Utility methods
    function hasRole(role) {
        return roles.value.includes(role);
    }

    function hasAnyRole(roleList) {
        return roleList.some((role) => roles.value.includes(role));
    }

    function hasAllRoles(roleList) {
        return roleList.every((role) => roles.value.includes(role));
    }

    function hasPermission(resource) {
        return permissions.value.includes(resource);
    }

    function logout() {
        // Remove from localStorage
        localStorage.removeItem(DEFAULT_KEYCLOAK_KEY);

        // Clear store (this will be triggered by the watcher)
        clearAuth();
    }

    function refreshAuthState() {
        checkKeycloakStorage();
    }

    // Add method to manually trigger auth check (useful for 3rd party components)
    function forceAuthCheck() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 50;

            const checkAuth = () => {
                const keycloakValue = localStorage.getItem(DEFAULT_KEYCLOAK_KEY);

                if (keycloakValue) {
                    setAuthData(keycloakValue);
                    resolve(true);
                    return;
                }

                attempts++;
                if (attempts >= maxAttempts) {
                    resolve(false);
                    return;
                }

                setTimeout(checkAuth, 100);
            };

            checkAuth();
        });
    }

    // Add method to wait for authentication (useful in router guards)
    function waitForAuth(timeout = 5000) {
        return new Promise((resolve) => {
            if (isAuthenticated.value) {
                resolve(true);
                return;
            }

            const startTime = Date.now();

            const checkAuth = () => {
                if (isAuthenticated.value) {
                    resolve(true);
                    return;
                }

                if (Date.now() - startTime >= timeout) {
                    resolve(false);
                    return;
                }

                setTimeout(checkAuth, 100);
            };

            checkAuth();
        });
    }

    // Initialize watcher when store is created
    initializeWatcher();

    return {
        // State
        isAuthenticated,
        keycloakData,
        user,
        token,
        refreshToken,
        tokenExpiry,
        roles,
        permissions,

        // Getters
        isLoggedIn,
        userName,
        userEmail,
        userRoles,
        isTokenExpired,

        // Actions
        setAuthData,
        clearAuth,
        checkKeycloakStorage,
        initializeWatcher,
        destroyWatcher,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        hasPermission,
        logout,
        refreshAuthState,
        forceAuthCheck,
        waitForAuth
    };
});
