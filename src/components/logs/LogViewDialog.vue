<script setup>
import { useDateFormatter } from '@/layout/composables/useDateFormatter';
import { useStringTransformer } from '@/layout/composables/useStringTransformer';
import { generateColumns, getValueByPath } from '@/utils/objectHelper';
import { computed, inject } from 'vue';

const { toSentence } = useStringTransformer();
const dialogRef = inject('dialogRef');
const { formatDate } = useDateFormatter();
const data = computed(() => dialogRef.value.data);

const tableData = computed(() => [data.value.payload]);
const columns = generateColumns(data.value.payload);
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
                <span>{{ data.type }}</span>
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
                <span>{{ formatDate(data.created, 'EEEE, MMMM dd, yyyy HH:mm') }}</span>
            </div>

            <div class="flex flex-col gap-2 text-sm">
                <span class="text-[#666666]">Modified Date:</span>
                <span>{{ formatDate(data.modified, 'EEEE, MMMM dd, yyyy HH:mm') }}</span>
            </div>
        </div>

        <div class="flex flex-col gap-1">
            <p class="mb-0">Details:</p>

            <DataTable :value="tableData" scrollable>
                <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" class="min-w-52">
                    <template #body="{ data }">
                        {{ col.formatter(getValueByPath(data, col.field)) }}
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
