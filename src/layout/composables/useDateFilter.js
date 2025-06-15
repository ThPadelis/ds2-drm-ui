/**
 * Provides a utility to convert Unix timestamps into ISO strings.
 */
export function useDateFilter() {
    /**
     * Convert a Unix timestamp (in seconds or milliseconds) to ISO-8601.
     * @param {number|string} ts  Unix timestamp
     * @returns {string} ISO string or empty on invalid input
     */
    function toIso(ts) {
        const n = typeof ts === 'string' ? Number(ts) : ts;
        if (isNaN(n)) return '';
        const ms = n < 1e12 ? n * 1000 : n;
        try {
            return new Date(ms).toISOString();
        } catch {
            return '';
        }
    }

    return { toIso };
}
