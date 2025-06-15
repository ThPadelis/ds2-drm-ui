<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

const title = ref('');

watch(
    route,
    (value) => {
        title.value = value.meta.title;
    },
    { immediate: true, deep: true, flush: 'pre' }
);
</script>

<template>
    <div class="!mb-0 !p-[10px]">
        <span class="text-2xl line font-['Questrial']">{{ title }}</span>
    </div>
</template>
