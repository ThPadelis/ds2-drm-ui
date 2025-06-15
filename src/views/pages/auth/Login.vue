<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'primevue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const toast = useToast();
const { push } = useRouter();
const authStore = useAuthStore();

const username = ref(''); // user2Org1TEST
const organisation = ref(''); // Org1MSP

const canActivate = computed(() => {
    const _username = username.value.trim();
    const _organisation = organisation.value.trim();
    return _username.length !== 0 && _organisation.length !== 0;
});

const onSubmit = () => {
    authStore
        .login(username.value, organisation.value)
        .then(() => {
            toast.add({
                severity: 'success',
                summary: 'Login Successful',
                detail: 'Welcome back!',
                life: 3000
            });
            setTimeout(() => {
                push({ name: 'dashboard' });
            }, 2000);
        })
        .catch((error) => {
            toast.add({
                severity: 'error',
                summary: 'Login Failed',
                detail: 'Invalid username or organisation',
                life: 3000
            });
            console.error('Login failed:', error);
        });
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden relative">
        <div class="absolute top-0 left-0 p-4 w-full h-28 md:h-32 lg:h-[174px] transition-all">
            <img src="/images/ds2-logo.png" alt="DS2 Logo" class="w-auto h-full object-contain" />
        </div>
        <div class="flex flex-col items-center justify-center">
            <div class="p-4 rounded-md shadow-custom-xl">
                <div class="flex flex-col w-full gap-6">
                    <div class="title">Sign in</div>
                    <InputText type="text" placeholder="Username" class="w-full md:w-[320px]" v-model="username" variant="filled" />
                    <InputText type="text" placeholder="Organisation" fluid="" v-model="organisation" variant="filled" />
                    <!-- <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" fluid :feedback="false" variant="filled"></Password> -->
                    <Button label="Sign In" class="w-full" @click="onSubmit" :disabled="!canActivate"></Button>
                </div>
            </div>
        </div>
    </div>
    <Toast />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}

.title {
    color: var(--Primary-800, #126f66);
    text-align: center;
    font-feature-settings:
        'liga' off,
        'clig' off;

    font-family: 'Questrial', sans-serif;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0.15px;
}
</style>
