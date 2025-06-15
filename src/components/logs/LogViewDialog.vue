<script setup>
import { useDateFilter } from '@/layout/composables/useDateFilter';
import { useStringTransformer } from '@/layout/composables/useStringTransformer';
import { computed, inject, onMounted } from 'vue';

const { toIso } = useDateFilter();
const { toSentence } = useStringTransformer();
const dialogRef = inject('dialogRef');
const data = computed(() => dialogRef.value.data);

const close = () => {
    dialogRef.value.close();
};

onMounted(() => {
    const params = dialogRef.value.data;
    console.log('Dialog params:', params);
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="grid grid-cols-[50px_repeat(5,minmax(150px,_1fr))] gap-4">
            <div class="flex flex-col gap-2 text-sm">
                <span class="text-[#666666]">ID:</span>
                <span>{{ data.Key }}</span>
            </div>

            <div class="flex flex-col gap-2 text-sm">
                <span class="text-[#666666]">Type:</span>
                <span>{{ toSentence(data.type) }}</span>
            </div>

            <div class="flex flex-col gap-2 text-sm">
                <span class="text-[#666666]">Author ID:</span>
                <span>{{ data.authorID }}</span>
            </div>

            <div class="flex flex-col gap-2 text-sm">
                <span class="text-[#666666]">Document Type:</span>
                <span>{{ toSentence(data.docType) }}</span>
            </div>

            <div class="flex flex-col gap-2 text-sm">
                <span class="text-[#666666]">Created Date:</span>
                <span>{{ toIso(data.created) }}</span>
            </div>

            <div class="flex flex-col gap-2 text-sm">
                <span class="text-[#666666]">Modified Date:</span>
                <span>{{ toIso(data.modified) }}</span>
            </div>
        </div>

        <div class="flex flex-col gap-1">
            <p class="mb-0">Payload:</p>
            <div class="block p-4 bg-[#494949] text-white whitespace-pre">
                <pre>{{ data.payload }}</pre>
            </div>
        </div>
    </div>
</template>
