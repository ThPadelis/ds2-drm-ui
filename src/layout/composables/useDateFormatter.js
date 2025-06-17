import { addDays, endOfMonth, endOfWeek, format, formatDistance, formatRelative, isValid, parseISO, startOfMonth, startOfWeek, subDays } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { computed, ref } from 'vue';

/**
 * Vue 3 composable for date formatting using date-fns
 * @param {Date|string|null} initialDate - Initial date value
 * @param {object} options - Configuration options
 * @returns {object} Date formatting utilities
 */
export function useDateFormatter(initialDate = null, options = {}) {
    const { locale = enGB, defaultFormat = 'dd/MM/yyyy' } = options;

    // Reactive date state
    const currentDate = ref(initialDate);

    // Computed property for parsed date
    const parsedDate = computed(() => {
        if (!currentDate.value) return null;

        if (typeof currentDate.value === 'string') {
            const parsed = parseISO(currentDate.value);
            return isValid(parsed) ? parsed : null;
        }

        return isValid(currentDate.value) ? currentDate.value : null;
    });

    // Basic formatting function
    const formatDate = (date = currentDate.value, formatStr = defaultFormat) => {
        if (!date) return '';

        const dateToFormat = typeof date === 'string' ? parseISO(date) : date;

        if (!isValid(dateToFormat)) return 'Invalid Date';

        try {
            return format(dateToFormat, formatStr, { locale });
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Format Error';
        }
    };

    // Common format shortcuts
    const formatters = {
        // Standard formats
        short: (date) => formatDate(date, 'dd/MM/yyyy'),
        medium: (date) => formatDate(date, 'MMM dd, yyyy'),
        long: (date) => formatDate(date, 'MMMM dd, yyyy'),
        full: (date) => formatDate(date, 'EEEE, MMMM dd, yyyy'),

        // Time formats
        time: (date) => formatDate(date, 'HH:mm'),
        time12: (date) => formatDate(date, 'h:mm a'),
        datetime: (date) => formatDate(date, 'yyyy-MM-dd HH:mm'),
        datetime12: (date) => formatDate(date, 'MMM dd, yyyy h:mm a'),

        // ISO formats
        iso: (date) => formatDate(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        isoDate: (date) => formatDate(date, 'yyyy-MM-dd'),

        // Relative formats
        relative: (date, baseDate = new Date()) => {
            if (!date) return '';
            const dateToFormat = typeof date === 'string' ? parseISO(date) : date;
            if (!isValid(dateToFormat)) return 'Invalid Date';

            try {
                return formatRelative(dateToFormat, baseDate, { locale });
            } catch (error) {
                console.error('Relative formatting error:', error);
                return 'Format Error';
            }
        },

        distance: (date, baseDate = new Date()) => {
            if (!date) return '';
            const dateToFormat = typeof date === 'string' ? parseISO(date) : date;
            if (!isValid(dateToFormat)) return 'Invalid Date';

            try {
                return formatDistance(dateToFormat, baseDate, { locale });
            } catch (error) {
                console.error('Distance formatting error:', error);
                return 'Format Error';
            }
        }
    };

    // Date manipulation utilities
    const manipulate = {
        addDays: (days, date = currentDate.value) => {
            if (!date) return null;
            const dateToManipulate = typeof date === 'string' ? parseISO(date) : date;
            return isValid(dateToManipulate) ? addDays(dateToManipulate, days) : null;
        },

        subDays: (days, date = currentDate.value) => {
            if (!date) return null;
            const dateToManipulate = typeof date === 'string' ? parseISO(date) : date;
            return isValid(dateToManipulate) ? subDays(dateToManipulate, days) : null;
        },

        startOfWeek: (date = currentDate.value) => {
            if (!date) return null;
            const dateToManipulate = typeof date === 'string' ? parseISO(date) : date;
            return isValid(dateToManipulate) ? startOfWeek(dateToManipulate) : null;
        },

        endOfWeek: (date = currentDate.value) => {
            if (!date) return null;
            const dateToManipulate = typeof date === 'string' ? parseISO(date) : date;
            return isValid(dateToManipulate) ? endOfWeek(dateToManipulate) : null;
        },

        startOfMonth: (date = currentDate.value) => {
            if (!date) return null;
            const dateToManipulate = typeof date === 'string' ? parseISO(date) : date;
            return isValid(dateToManipulate) ? startOfMonth(dateToManipulate) : null;
        },

        endOfMonth: (date = currentDate.value) => {
            if (!date) return null;
            const dateToManipulate = typeof date === 'string' ? parseISO(date) : date;
            return isValid(dateToManipulate) ? endOfMonth(dateToManipulate) : null;
        }
    };

    // Computed formatted values for the current date
    const formatted = computed(() => ({
        short: formatters.short(parsedDate.value),
        medium: formatters.medium(parsedDate.value),
        long: formatters.long(parsedDate.value),
        full: formatters.full(parsedDate.value),
        time: formatters.time(parsedDate.value),
        time12: formatters.time12(parsedDate.value),
        datetime: formatters.datetime(parsedDate.value),
        datetime12: formatters.datetime12(parsedDate.value),
        iso: formatters.iso(parsedDate.value),
        isoDate: formatters.isoDate(parsedDate.value),
        relative: formatters.relative(parsedDate.value),
        distance: formatters.distance(parsedDate.value)
    }));

    // Utility functions
    const setDate = (date) => {
        currentDate.value = date;
    };

    const isValidDate = (date = currentDate.value) => {
        if (!date) return false;
        const dateToCheck = typeof date === 'string' ? parseISO(date) : date;
        return isValid(dateToCheck);
    };

    const parseDate = (dateString) => {
        try {
            return parseISO(dateString);
        } catch (error) {
            console.error('Date parsing error:', error);
            return null;
        }
    };

    return {
        // State
        currentDate,
        parsedDate,

        // Core functions
        formatDate,
        formatters,
        formatted,

        // Utilities
        setDate,
        isValidDate,
        parseDate,
        manipulate,

        // Configuration
        locale,
        defaultFormat
    };
}
