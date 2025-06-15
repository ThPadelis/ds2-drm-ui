<script setup>
import { useDateFilter } from '@/layout/composables/useDateFilter';
import { useStringTransformer } from '@/layout/composables/useStringTransformer';
import { useLogsStore } from '@/stores/logsStore';
import { useDialog } from 'primevue';
import { defineAsyncComponent, markRaw, ref } from 'vue';
const LogViewFooterDialog = defineAsyncComponent(() => import('./LogViewFooterDialog.vue'));
const LogViewDialog = defineAsyncComponent(() => import('./LogViewDialog.vue'));

const dialog = useDialog();
const { toIso } = useDateFilter();
const { toSentence } = useStringTransformer();
const logsStore = useLogsStore();
const { updateDate } = logsStore;

const { logs } = defineProps({
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
const selectedRow = ref(null);
const menu = ref();
const items = ref([
    {
        label: 'Options',
        items: [
            {
                label: 'View',
                icon: 'pi pi-pencil',
                command: () => {
                    console.log('View clicked');
                    console.log('Selected Row:', selectedRow.value);
                    showLogViewDialog(selectedRow.value);
                }
            }
        ]
    }
]);

const toggle = (event, data) => {
    menu.value.toggle(event);
    selectedRow.value = data;
};

const showLogViewDialog = (data) => {
    const dialogRef = dialog.open(LogViewDialog, {
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

const startDate = ref();
const endDate = ref();
const maxDate = ref(new Date());
</script>

<template>
    <div class="mb-6">
        <div class="mb-6">Filter by Time Range</div>

        <div class="grid grid-cols-4 gap-6">
            <div>
                <DatePicker
                    showButtonBar
                    :maxDate="maxDate"
                    @clear-click="updateDate('startDate', null)"
                    @date-select="updateDate('startDate', +new Date($event))"
                    dateFormat="dd/mm/yy"
                    variant="filled"
                    placeholder="Start Date Time"
                    v-model="startDate"
                    showIcon
                    fluid
                    iconDisplay="input"
                />
            </div>
            <div>
                <DatePicker
                    showButtonBar
                    :maxDate="maxDate"
                    @clear-click="updateDate('endDate', null)"
                    @date-select="updateDate('endDate', +new Date($event))"
                    dateFormat="dd/mm/yy"
                    variant="filled"
                    placeholder="End Date Time"
                    v-model="endDate"
                    showIcon
                    fluid
                    iconDisplay="input"
                />
            </div>
        </div>
    </div>
    <DataTable :value="logs" scrollable :loading="isLoading" tableStyle="min-width: 50rem" paginator :rows="5">
        <Column field="Key" header="ID"></Column>
        <Column field="type" header="Type">
            <template #body="{ data }"> {{ data.type }} </template>
        </Column>
        <Column field="authorID" header="Author"></Column>
        <Column field="docType" header="Document Type">
            <template #body="{ data }"> {{ toSentence(data.docType) }} </template>
        </Column>
        <Column field="created" header="Created Date">
            <template #body="{ data }"> {{ toIso(data.created) }} </template>
        </Column>
        <Column field="modified" header="Modified Date">
            <template #body="{ data }"> {{ toIso(data.modified) }} </template>
        </Column>
        <Column header="Action">
            <template #body="{ data }">
                <Button type="button" icon="pi pi-ellipsis-v" plain text @click="toggle($event, data)" aria-haspopup="true" aria-controls="overlay_menu" />
                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
            </template>
        </Column>
        <template #empty> No logs found. </template>

        <template #paginatorcontainer="{ first, last, page, pageCount, prevPageCallback, nextPageCallback, totalRecords, rowChangeCallback, rows }">
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
    background: red !important;
}
</style>
