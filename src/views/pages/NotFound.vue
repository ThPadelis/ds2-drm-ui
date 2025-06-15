<script setup></script>

<template>
    <div class="flex items-center justify-center min-h-screen overflow-hidden">
        <div class="flex flex-col items-center justify-center w-[75vw] md:w-[320px]">
            <div class="flex w-full flex-col items-center py-14 px-4 rounded-md shadow-custom-xl">
                <span class="text-primary font-bold text-3xl">404</span>
                <h1 class="text-surface-900 dark:text-surface-0 font-bold text-3xl lg:text-5xl mb-2">Not Found</h1>
                <div class="text-surface-600 dark:text-surface-200 mb-8">Requested resource is not available.</div>
                <Button as="router-link" label="Go to Dashboard" to="/" />
            </div>
        </div>
    </div>
</template>
