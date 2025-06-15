import AppLayout from '@/layout/AppLayout.vue';
import { useAuthStore } from '@/stores/authStore';
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
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/pages/notfound'
        }
    ]
});

router.beforeEach((to, from, next) => {
    const auth = useAuthStore();
    if (to.meta.requiresAuth && !auth.isLoggedIn) {
        next('/auth/login');
    } else {
        next();
    }
});

export default router;
