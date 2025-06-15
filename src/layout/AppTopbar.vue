<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const authStore = useAuthStore();
const { push } = useRouter();
const { username } = storeToRefs(authStore);
const menu = ref();
const items = ref([
    {
        // label: 'Options',
        items: [
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => {
                    authStore.logout();
                    push('/auth/login');
                }
            }
        ]
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu"></div>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <Button type="button" icon="pi pi-user" plain text rounded @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
                    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
                        <template #start>
                            <div class="block px-6 pt-6">
                                <div class="px-2 pb-2 text-primary-800 border-b border-[#E3E8EF]">{{ username }}</div>
                            </div>
                        </template>
                    </Menu>

                    <dash-button
                        keycloak-uri="https://keycloak.ds2.icelab.cloud/"
                        realm="ds2"
                        client-id="dashbtn"
                        auth-method="login-required"
                        show-post-login-text="false"
                        primary-color="#126f66"
                        secondary-color="#22d6c5"
                        menu-view-type="list"
                    ></dash-button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.p-menu-submenu-label {
    display: none !important;
}
</style>
