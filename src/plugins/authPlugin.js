import { useAuthStore } from '@/stores/authStoreNew';

export const authPlugin = {
    install(app) {
        const authStore = useAuthStore();

        // Initialize on app startup
        authStore.initializeWatcher();

        // Cleanup on app unmount
        app.config.globalProperties.$onUnmount = () => {
            authStore.destroyWatcher();
        };
    }
};
