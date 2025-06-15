import axios from 'axios';
import { endOfDay, startOfDay } from 'date-fns';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
export const useLogsStore = defineStore(
    'logs',
    () => {
        const state = ref({
            isLoading: false,
            data: [],
            error: null,
            startDate: null,
            endDate: null
        });

        /**
         * Fetch all logs from the server
         * @param {'all' | 'connector' | 'component' | 'policy'} logType - Type of logs to fetch. Default is 'all'.
         * @returns {Promise<void>}
         */
        const getLogs = async (logType = 'all') => {
            state.value.isLoading = true;
            try {
                const { data } = await axios.post('/api/ledger/readAll', {
                    userID: 'user2Org1TEST',
                    organization: 'Org1MSP',
                    logType
                });
                state.value.data = data;
            } catch (error) {
                state.value.data = [];
                state.value.error = error;
                console.log(error);
            } finally {
                state.value.isLoading = false;
            }
        };

        const updateDate = (date, value) => {
            state.value[date] = value;
        };

        const data = computed(() => state.value.data || []);
        const filteredData = computed(() => {
            return data.value.filter((log) => {
                const date = new Date(log.created);
                const minDate = state.value.startDate ? new Date(state.value.startDate) : null;
                const maxDate = state.value.endDate ? new Date(state.value.endDate) : null;

                const interval = {
                    start: minDate ? startOfDay(minDate) : undefined,
                    end: maxDate ? endOfDay(maxDate) : undefined
                };
                return (interval.start == null || date >= interval.start) && (interval.end == null || date <= interval.end);
            });
        });
        const isLoading = computed(() => state.value.isLoading);

        const reset$ = () => {
            state.value.startDate = null;
            state.value.endDate = null;
            state.value.data = [];
            state.value.isLoading = false;
            state.value.error = null;
        };
        return { state, data, filteredData, isLoading, getLogs, updateDate, reset$ };
    },
    {
        persist: {
            key: 'ilab-ds2-drm-logs',
            storage: localStorage
        }
    }
);
