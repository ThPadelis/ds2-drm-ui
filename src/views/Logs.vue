<script setup>
import { useLogsStore } from '@/stores/logsStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const logsStore = useLogsStore();
const { isLoading, filteredData } = storeToRefs(logsStore);
const { getLogs, reset$ } = logsStore;

const onTabSelected = (tab) => {
    switch (tab) {
        case '0':
            getLogs();
            break;
        case '1':
            getLogs('connector');
            break;
        case '2':
            getLogs('component');
            break;
        case '3':
            getLogs('policy');
            break;
        default:
            getLogs();
            break;
    }
};

onMounted(() => {
    reset$();
    getLogs();
});
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12">
            <div class="rounded-2xl shadow-custom p-4">
                <Tabs value="0" scrollable @update:value="onTabSelected">
                    <TabList>
                        <Tab value="0">All Document Types</Tab>
                        <Tab value="1">Connector Logs</Tab>
                        <Tab value="2">Component Logs</Tab>
                        <Tab value="3">Policy Logs</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel value="0">
                            <LogsTable :logs="filteredData" :isLoading="isLoading" />
                        </TabPanel>
                        <TabPanel value="1">
                            <LogsTable :logs="filteredData" :isLoading="isLoading" />
                        </TabPanel>
                        <TabPanel value="2">
                            <LogsTable :logs="filteredData" :isLoading="isLoading" />
                        </TabPanel>
                        <TabPanel value="3">
                            <LogsTable :logs="filteredData" :isLoading="isLoading" />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    </div>
</template>
