import AppLayout from '@/layout/AppLayout.vue';
import { useAuthStore } from '@/stores/authStoreNew';
// import { useAuthStore } from '@/stores/authStore';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: {
                        requiresAuth: true,
                        title: 'Hi, Welcome 👋'
                    }
                },
                {
                    path: '/logs',
                    name: 'logs',
                    component: () => import('@/views/Logs.vue'),
                    meta: {
                        requiresAuth: true,
                        title: 'All Logs'
                    }
                }
            ]
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue'),
            meta: {
                requiresGuest: true
            }
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/pages/notfound'
        }
    ]
});

// router.beforeEach((to, from, next) => {
//     const auth = useAuthStore();
//     if (to.meta.requiresAuth && !auth.isLoggedIn) {
//         next('/auth/login');
//     } else {
//         next();
//     }
// });

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // Ensure auth store is initialized and wait for potential auth data
    await authStore.checkKeycloakStorage();

    // If navigating to a protected route and not authenticated, wait a bit for 3rd party components
    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        // Wait for potential authentication (useful after Keycloak redirect)
        const isAuthenticatedAfterWait = await authStore.waitForAuth(2000); // Wait up to 2 seconds

        if (!isAuthenticatedAfterWait) {
            console.log('Access denied: User not authenticated');
            return next({
                name: 'login',
                query: {
                    redirect: to.fullPath, // Save intended destination
                    reason: 'auth_required'
                }
            });
        }
    }

    // Check if route requires authentication
    if (to.meta.requiresAuth) {
        if (!authStore.isLoggedIn) {
            console.log('Access denied: User not authenticated');
            return next({
                name: 'login',
                query: {
                    redirect: to.fullPath, // Save intended destination
                    reason: 'auth_required'
                }
            });
        }

        // Check if token is expired
        if (authStore.isTokenExpired) {
            console.log('Access denied: Token expired');
            authStore.logout();
            return next({
                name: 'login',
                query: {
                    redirect: to.fullPath,
                    reason: 'token_expired'
                }
            });
        }

        // // Check role requirements
        // if (to.meta.requiresRole) {
        //     const hasRequiredRole = authStore.hasAnyRole(to.meta.requiresRole);
        //     if (!hasRequiredRole) {
        //         console.log('Access denied: Insufficient role permissions');
        //         return next({
        //             name: 'Dashboard', // Redirect to dashboard instead of login
        //             query: { error: 'insufficient_permissions' }
        //         });
        //     }
        // }

        // // Check permission requirements
        // if (to.meta.requiresPermission) {
        //     const hasRequiredPermission = to.meta.requiresPermission.some((permission) => authStore.hasPermission(permission));
        //     if (!hasRequiredPermission) {
        //         console.log('Access denied: Insufficient permissions');
        //         return next({
        //             name: 'Dashboard',
        //             query: { error: 'insufficient_permissions' }
        //         });
        //     }
        // }
    }

    // Check if route requires guest (not logged in)
    if (to.meta.requiresGuest && authStore.isLoggedIn) {
        console.log('Redirecting authenticated user away from guest-only page');
        return next({ name: 'dashboard' });
    }

    // Check for nested route auth requirements
    const matchedRoutes = to.matched;
    for (const route of matchedRoutes) {
        if (route.meta.requiresAuth && !authStore.isLoggedIn) {
            return next({
                name: 'login',
                query: { redirect: to.fullPath }
            });
        }
    }

    next();
});

// Global after navigation guard
router.afterEach((to, from) => {
    // Analytics, logging, etc.
    console.log(`Navigated from ${from.name} to ${to.name}`);
});

export default router;
