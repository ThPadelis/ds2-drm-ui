<script setup>
import { useAuthRouter } from '@/composables/useAuthRouter';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { navigateIfAuthorized } = useAuthRouter();
const { isLoggedIn } = storeToRefs(authStore);

const goToDashboard = () => {
    navigateIfAuthorized('dashboard', []);
};
</script>

<template>
    <div class="flex flex-col md:flex-row h-screen justify-center">
        <!-- Left side with image and logo -->
        <div class="w-2/3 flex flex-col justify-center items-center bg-gradient-to-br from-white to-primary-50">
            <img src="/images/ds2-logo.png" alt="DataSpace 2 logo" class="absolute top-8 left-8 w-24" />
            <img src="/images/main.png" alt="Illustration" class="hidden md:block w-2/3 max-w-xl" />
        </div>

        <!-- Right side with login box -->
        <div class="w-full md:w-1/3 flex items-center justify-center">
            <div class="text-center max-w-sm px-6 font-['Questrial']">
                <h1 class="text-4xl font-bold text-primary mb-4">Welcome to DS2</h1>
                <p class="text-xl text-gray-600 mb-2">Trusted data exchange across sectors</p>
                <p class="font-semibold text-gray-800 mb-6">
                    <span class="text-black">secure</span> | <span class="text-black">sovereign</span> |
                    <span class="text-black">scalable</span>
                </p>

                <div class="flex flex-col justify-center items-center mb-4">
                    <dash-button
                        v-if="!isLoggedIn"
                        keycloak-uri="https://keycloak.ds2.icelab.cloud/"
                        realm="ds2"
                        client-id="dashbtn"
                        auth-method="check-sso"
                        portal-url="/"
                        show-post-login-text="false"
                        primary-color="#126f66"
                        secondary-color="#22d6c5"
                        menu-view-type="list"
                    ></dash-button>
                    <Button v-else class="!px-8 !py-4" label="Go to Dashboard" size="large" @click="goToDashboard" />
                </div>

                <p class="text-gray-600">
                    Not registered yet?
                    <a href="https://portal.ds2.icelab.cloud/register" class="text-primary hover:underline">Create an account</a>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
