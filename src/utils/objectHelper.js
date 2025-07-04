import { useStringTransformer } from '@/layout/composables/useStringTransformer';
import { formatDate } from 'date-fns';

const stringFormatter = useStringTransformer();

export const flattenObject = (obj, parentKey = '', result = {}) => {
    for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
            const newKey = parentKey ? `${parentKey}.${key}` : key;
            const value = obj[key];

            if (value && typeof value === 'object' && !Array.isArray(value)) {
                // Recursively flatten nested objects
                flattenObject(value, newKey, result);
            } else if (Array.isArray(value)) {
                if (value.length === 0) {
                    result[newKey] = [];
                } else if (value.every((item) => !item || typeof item !== 'object')) {
                    // Array of primitives - join with comma
                    result[newKey] = value.join(',');
                } else {
                    // Array of objects - flatten each object recursively
                    value.forEach((item, index) => {
                        const arrayKey = `${newKey}[${index}]`;
                        if (item && typeof item === 'object' && !Array.isArray(item)) {
                            flattenObject(item, arrayKey, result);
                        } else {
                            result[arrayKey] = item;
                        }
                    });
                }
            } else {
                result[newKey] = value;
            }
        }
    }
    return result;
};

export const generateColumns = (flattenedObj, keepLastPart = true) => {
    return Object.keys(flattenedObj).map((key) => {
        return {
            field: key,
            header: stringFormatter.toSentence(keepLastPart ? key.split('.').pop() : key), // Last part of key as header
            formatter: (value) => {
                if (key.toLowerCase().includes('timestamp') || key === 'created' || key === 'modified') {
                    const num = Number(value);
                    if (!isNaN(num)) {
                        return num > 1e12
                            ? formatDate(num, 'EEEE, MMMM dd, yyyy HH:mm') // new Date(num).toLocaleString() // Milliseconds
                            : formatDate(num * 1000, 'EEEE, MMMM dd, yyyy HH:mm'); // new Date(num * 1000).toLocaleString(); // Seconds
                    }
                }

                return value !== null && typeof value === 'object' ? value : String(value);
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
