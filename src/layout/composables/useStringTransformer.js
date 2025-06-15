export function useStringTransformer() {
    const processWords = (words) => {
        if (!words?.length) return '';
        return words
            .map((word) => word.toLowerCase())
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const camelToSentence = (str) => {
        return processWords(str.split(/(?=[A-Z])/));
    };

    const pascalToSentence = (str) => {
        return processWords(str.split(/(?=[A-Z])/));
    };

    const snakeToSentence = (str) => {
        return processWords(str.split(/_+/));
    };

    const kebabToSentence = (str) => {
        return processWords(str.split(/-+/));
    };

    const titleToSentence = (str) => {
        return processWords(str.split(/\s+/));
    };

    const autoToSentence = (str) => {
        if (/_/.test(str)) return snakeToSentence(str);
        if (/-/.test(str)) return kebabToSentence(str);
        if (/\s/.test(str)) return titleToSentence(str);
        if (/^[A-Z]/.test(str)) return pascalToSentence(str);
        return camelToSentence(str);
    };

    return {
        camelToSentence,
        pascalToSentence,
        snakeToSentence,
        kebabToSentence,
        titleToSentence,
        autoToSentence,
        toSentence: autoToSentence
    };
}
