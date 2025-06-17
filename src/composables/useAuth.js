import { useAuthStore } from '@/stores/authStore';
import { onMounted, onUnmounted } from 'vue';

export function useAuth() {
    const authStore = useAuthStore();

    // Initialize watcher when composable is used
    onMounted(() => {
        authStore.initializeWatcher();
    });

    // Cleanup when component unmounts
    onUnmounted(() => {
        authStore.destroyWatcher();
    });

    return authStore;
}
