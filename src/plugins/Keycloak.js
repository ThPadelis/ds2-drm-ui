import Keycloak from 'keycloak-js';

let keycloak;

export default {
    install: (app, options) => {
        const keycloakInstance = new Keycloak({
            url: options.url,
            realm: options.realm,
            clientId: options.clientId
        });

        keycloak = keycloakInstance;

        app.config.globalProperties.$keycloak = keycloakInstance;

        app.provide('keycloak', keycloakInstance); // Optional: inject()

        keycloak
            .init({
                onLoad: 'login-required', // or 'check-sso'
                // silentCheckSsoRedirectUri: window.location.origin, //  + '/silent-check-sso.html',
                pkceMethod: 'S256'
            })
            .then((authenticated) => {
                console.log('[Keycloak] Authenticated:', authenticated);
                if (!authenticated) {
                    // You can trigger login manually if needed
                    console.warn('[Keycloak] Not authenticated');
                }
            })
            .catch((err) => {
                console.error('[Keycloak] Initialization failed', err);
            });
    }
};

export { keycloak };
