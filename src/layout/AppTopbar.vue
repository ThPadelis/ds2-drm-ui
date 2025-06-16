<script setup>
import { useLayout } from '@/layout/composables/layout';
const { toggleMenu } = useLayout();
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
                    <dash-button
                        keycloak-uri="https://keycloak.ds2.icelab.cloud/"
                        realm="ds2"
                        client-id="dashbtn"
                        auth-method="check-sso"
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
