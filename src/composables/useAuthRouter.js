import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

// Composable for programmatic navigation with auth checks
export function useAuthRouter() {
    const authStore = useAuthStore();
    const router = useRouter();

    const navigateIfAuthorized = (routeName, requiredRoles = [], requiredPermissions = []) => {
        if (!authStore.isLoggedIn) {
            router.push({
                name: 'login',
                query: { redirect: router.currentRoute.value.fullPath }
            });
            return false;
        }

        if (requiredRoles.length > 0 && !authStore.hasAnyRole(requiredRoles)) {
            router.push({
                name: 'dashboard',
                query: { error: 'insufficient_permissions' }
            });
            return false;
        }

        if (requiredPermissions.length > 0 && !requiredPermissions.some((p) => authStore.hasPermission(p))) {
            router.push({
                name: 'dashboard',
                query: { error: 'insufficient_permissions' }
            });
            return false;
        }

        router.push({ name: routeName });
        return true;
    };

    const redirectAfterLogin = () => {
        const redirect = router.currentRoute.value.query.redirect;
        if (redirect && typeof redirect === 'string') {
            router.push(redirect);
        } else {
            router.push({ name: 'Dashboard' });
        }
    };

    return {
        navigateIfAuthorized,
        redirectAfterLogin
    };
}
