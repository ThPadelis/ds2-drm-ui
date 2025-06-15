import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAuthStore = defineStore(
    'auth',
    () => {
        const user = ref(null);
        const isLoggedIn = ref(false);

        const login = async (username, organization) => {
            try {
                const verified = await axios.post('/api/enroll/verify', { userID: username, organization });
                user.value = { username, organization };
                isLoggedIn.value = true;
                return Promise.resolve();
            } catch (error) {
                console.error('Login failed:', error);
                isLoggedIn.value = false;
                user.value = null;
                return Promise.reject('Something went wrong. Please try again.');
            }
        };

        const logout = () => {
            user.value = null;
            isLoggedIn.value = false;
            localStorage.removeItem('ilab-ds2-drm-auth');
        };

        const username = computed(() => {
            return user.value ? user.value?.username : null;
        });

        return {
            user,
            username,
            isLoggedIn,
            login,
            logout
        };
    },
    {
        persist: {
            key: 'ilab-ds2-drm-auth',
            storage: localStorage
        }
    }
);
