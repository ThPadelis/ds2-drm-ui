<script setup></script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12">
            <div class="rounded-2xl grid grid-cols-2 lg:grid-cols-[400px_1fr] gap-x-4 shadow-custom">
                <div class="p-4">
                    <div class="h-[150px] lg:h-[373px] w-full">
                        <img src="/images/ds2-logo.png" alt="DS2 Logo" class="h-full w-full object-contain" />
                    </div>
                </div>
                <div class="p-4 flex flex-col items-start justify-center gap-6">
                    <p class="mb-0 font-['Questrial'] text-2xl">We’re glad to have you here! Take a look around!</p>
                    <Button asChild v-slot="slotProps">
                        <RouterLink to="/logs" :class="slotProps.class">All Logs</RouterLink>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
