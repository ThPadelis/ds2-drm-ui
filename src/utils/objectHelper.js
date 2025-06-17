import { useStringTransformer } from '@/layout/composables/useStringTransformer';
import { formatDate } from 'date-fns';

const stringFormatter = useStringTransformer();

export const flattenObject = (obj, parentKey = '', result = {}) => {
    for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
            const newKey = parentKey ? `${parentKey}.${key}` : key;
            const value = obj[key];

            if (value && typeof value === 'object' && !Array.isArray(value)) {
                flattenObject(value, newKey, result);
            } else {
                result[newKey] = Array.isArray(value) ? JSON.stringify(value) : value;
            }
        }
    }
    return result;
};

export const generateColumns = (flattenedObj) => {
    return Object.keys(flattenedObj).map((key) => {
        return {
            field: key,
            header: stringFormatter.toSentence(key.split('.').pop()), // Last part of key as header
            formatter: (value) => {
                if (key.toLowerCase().includes('timestamp') || key === 'created' || key === 'modified') {
                    const num = Number(value);
                    if (!isNaN(num)) {
                        return num > 1e12
                            ? formatDate(num, 'EEEE, MMMM dd, yyyy HH:mm') // new Date(num).toLocaleString() // Milliseconds
                            : formatDate(num * 1000, 'EEEE, MMMM dd, yyyy HH:mm'); // new Date(num * 1000).toLocaleString(); // Seconds
                    }
                }

                return value !== null && typeof value === 'object' ? JSON.stringify(value) : String(value);
            }
        };
    });
};

export const getNestedValue = (obj, path) => {
    return path.split('.').reduce((o, p) => o?.[p], obj);
};

export const getValueByPath = (obj, path) => {
    return path.split('.').reduce((acc, part) => {
        return acc && acc[part] !== undefined ? acc[part] : null;
    }, obj);
};
