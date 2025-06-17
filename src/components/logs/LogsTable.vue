<script setup>
import { useDateFormatter } from '@/layout/composables/useDateFormatter';
import { useStringTransformer } from '@/layout/composables/useStringTransformer';
import { useLogsStore } from '@/stores/logsStore';
import { FilterMatchMode } from '@primevue/core/api';
import { storeToRefs } from 'pinia';
import { useDialog } from 'primevue';
import { defineAsyncComponent, markRaw, ref } from 'vue';
const LogViewFooterDialog = defineAsyncComponent(() => import('./LogViewFooterDialog.vue'));
const LogViewDialog = defineAsyncComponent(() => import('./LogViewDialog.vue'));

const dialog = useDialog();
const { toSentence } = useStringTransformer();
const logsStore = useLogsStore();
const { typeOptions, authorOptions, docTypeOptions } = storeToRefs(logsStore);
const { formatDate } = useDateFormatter();

const { logs, isLoading } = defineProps({
    logs: {
        type: Array,
        default: () => []
    },
    isLoading: {
        type: Boolean,
        default: false
    }
});

const perPageOptions = [5, 10, 20, 50];
const selectedPerPage = ref(5);

const showLogViewDialog = (data) => {
    dialog.open(LogViewDialog, {
        data,
        props: {
            header: 'View log',
            style: {
                width: '65vw'
            },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            modal: true,
            draggable: false,
            closable: true,
            closeOnEscape: true
        },
        templates: {
            footer: markRaw(LogViewFooterDialog)
        }
    });
};

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    type: { value: null, matchMode: FilterMatchMode.IN },
    authorID: { value: null, matchMode: FilterMatchMode.IN },
    docType: { value: null, matchMode: FilterMatchMode.IN },
    created: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
    modified: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO }
});

const onDateValueChange = (key, $event) => {
    filters.value[key].value = +new Date($event);
};
</script>

<template>
    <DataTable dataKey="uuid" filterDisplay="row" paginator stripedRows scrollable :rows="5" :filters="filters" :autoLayout="true" :value="logs" :loading="isLoading" :globalFilterFields="['type', 'authorID', 'docType']" tableStyle="min-width: 70rem">
        <template #header>
            <div class="flex justify-end">
                <IconField>
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </IconField>
            </div>
        </template>

        <Column filterField="type" header="Type" :showFilterMenu="false" class="w-[20rem]">
            <template #body="{ data }">{{ data.type }}</template>
            <template #filter="{}">
                <MultiSelect v-model="filters['type'].value" :options="typeOptions" placeholder="Any" :maxSelectedLabels="1">
                    <template #option="slotProps">
                        <div class="flex items-center gap-2">
                            <span>{{ slotProps.option }}</span>
                        </div>
                    </template>
                </MultiSelect>
            </template>
        </Column>

        <Column filterField="authorID" header="Author" :showFilterMenu="false" class="w-[20rem]">
            <template #body="{ data }">{{ data.authorID }}</template>
            <template #filter="{}">
                <MultiSelect v-model="filters['authorID'].value" :options="authorOptions" placeholder="Any" :maxSelectedLabels="1">
                    <template #option="slotProps">
                        <div class="flex items-center gap-2">
                            <span>{{ slotProps.option }}</span>
                        </div>
                    </template>
                </MultiSelect>
            </template>
        </Column>

        <Column filterField="docType" header="Entry Type" :showFilterMenu="false" class="w-[20rem]">
            <template #body="{ data }">{{ toSentence(data.docType) }}</template>
            <template #filter="{}">
                <MultiSelect v-model="filters['docType'].value" :options="docTypeOptions" placeholder="Any" :maxSelectedLabels="1">
                    <template #option="slotProps">
                        <div class="flex items-center gap-2">
                            <span>{{ slotProps.option }}</span>
                        </div>
                    </template>
                </MultiSelect>
            </template>
        </Column>

        <Column field="created" header="Created Date" dataType="numeric" :showFilterMenu="false" class="w-[20rem]">
            <template #body="{ data }"> {{ formatDate(data.created, 'MMMM dd, yyyy') }} </template>
            <template #filter="{ filterCallback }">
                <DatePicker
                    dateFormat="dd/mm/yy"
                    placeholder="dd/mm/yyyy"
                    showButtonBar
                    @update:model-value="
                        onDateValueChange('created', $event);
                        filterCallback();
                    "
                />
            </template>
        </Column>

        <Column field="modified" header="Modified Date" dataType="date" :showFilterMenu="false" class="w-[20rem]">
            <template #body="{ data }"> {{ formatDate(data.modified, 'MMMM dd, yyyy') }} </template>
            <template #filter="{}">
                <DatePicker
                    dateFormat="dd/mm/yy"
                    placeholder="dd/mm/yyyy"
                    showButtonBar
                    @update:model-value="
                        onDateValueChange('modified', $event);
                        filterCallback();
                    "
                />
            </template>
        </Column>

        <Column class="w-10 text-center">
            <template #body="{ data }">
                <Button icon="pi pi-search" @click="showLogViewDialog(data)" plain text rounded></Button>
            </template>
        </Column>

        <template #empty> No logs found. </template>

        <template #paginatorcontainer="{ first, last, page, pageCount, prevPageCallback, nextPageCallback, totalRecords, rowChangeCallback }">
            <div class="flex justify-end items-center gap-4 bg-transparent w-full py-4">
                <div class="flex items-center gap-2">
                    <span>Rows per page: </span>
                    <Select v-model="selectedPerPage" :options="perPageOptions" @valueChange="rowChangeCallback($event)" />
                </div>
                <div>
                    <span>{{ first }}-{{ last }} of {{ totalRecords }}</span>
                </div>
                <div class="flex items-center gap-0">
                    <Button icon="pi pi-chevron-left" rounded text size="sm" @click="prevPageCallback" :disabled="page === 0" />
                    <Button icon="pi pi-chevron-right" rounded text size="sm" @click="nextPageCallback" :disabled="page === pageCount - 1" />
                </div>
            </div>
        </template>
    </DataTable>
</template>

<style lang="scss" scoped>
.p-inputtext {
    border-width: 2px;
    width: 100%;
}

.p-datepicker {
    width: 100%;

    .p-inputtext {
        border-width: 2px;
    }
}

.p-multiselect {
    width: 100%;
}
</style>
