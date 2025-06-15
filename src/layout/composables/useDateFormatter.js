export function useDateFormatter(defaultOptions = {}) {
    const { locale = 'en-US', dateTimeFormatOptions = {}, defaultFormat = 'yyyy-MM-dd HH:mm:ss' } = defaultOptions;

    function parseDate(date) {
        if (date === undefined || date === null) return new Date();
        if (date instanceof Date) return date;

        const parsed = new Date(date);
        if (!isNaN(parsed)) return parsed;

        console.warn('Invalid date, falling back to current date');
        return new Date();
    }

    function intlFormat(date, overrideOptions = {}) {
        const parsedDate = parseDate(date);
        const { locale: overrideLocale, ...restOptions } = { ...dateTimeFormatOptions, ...overrideOptions };

        const formatter = new Intl.DateTimeFormat(overrideLocale || locale, restOptions);

        return formatter.format(parsedDate);
    }

    function patternFormat(date, formatStr = defaultFormat) {
        const d = parseDate(date);

        const patterns = {
            yyyy: d.getFullYear(),
            yy: d.getFullYear().toString().slice(-2),
            MM: (d.getMonth() + 1).toString().padStart(2, '0'),
            M: d.getMonth() + 1,
            dd: d.getDate().toString().padStart(2, '0'),
            d: d.getDate(),
            HH: d.getHours().toString().padStart(2, '0'),
            hh: (d.getHours() % 12 || 12).toString().padStart(2, '0'),
            mm: d.getMinutes().toString().padStart(2, '0'),
            ss: d.getSeconds().toString().padStart(2, '0'),
            SSS: d.getMilliseconds().toString().padStart(3, '0'),
            a: d.getHours() < 12 ? 'AM' : 'PM',
            EEE: d.toLocaleDateString(locale, { weekday: 'short' }),
            EEEE: d.toLocaleDateString(locale, { weekday: 'long' })
        };

        return formatStr.replace(/(yyyy|yy|MM|M|dd|d|HH|hh|mm|ss|SSS|a|EEE|EEEE)/g, (match) => patterns[match] || match);
    }

    function useRelativeTime(date, baseDate = new Date()) {
        const parsedDate = parseDate(date);
        const diff = parsedDate - parseDate(baseDate);
        const absDiff = Math.abs(diff);

        const units = [
            { limit: 60000, unit: 'second' },
            { limit: 3600000, unit: 'minute' },
            { limit: 86400000, unit: 'hour' },
            { limit: 604800000, unit: 'day' },
            { limit: 2629800000, unit: 'week' },
            { limit: 31557600000, unit: 'month' },
            { limit: Infinity, unit: 'year' }
        ];

        const { unit, divisor } = units.find(({ limit }) => absDiff < limit);
        const value = Math.round(diff / divisor);

        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
        return rtf.format(value, unit);
    }

    return {
        intlFormat,
        patternFormat,
        useRelativeTime
    };
}
