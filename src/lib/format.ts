export type DATE_FORMAT_OPTIONS = "DD-MM-YYYY"
    | "YYYY-MM-DD"
    | "DD Month YYYY"
    | "DD Mon YYYY"
    | "Month YYYY"
    | "Mon YYYY";


export const formatDate = (date: Date | string, format: DATE_FORMAT_OPTIONS = "DD-MM-YYYY"): string => {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = { timeZone: 'America/Toronto' };

    const day = d.toLocaleString('en-CA', { ...options, day: '2-digit' });
    const month = d.toLocaleString('en-CA', { ...options, month: '2-digit' });
    const year = d.toLocaleString('en-CA', { ...options, year: 'numeric' });
    const monthLong = d.toLocaleString('en-CA', { ...options, month: 'long' });
    const monthShort = d.toLocaleString('en-CA', { ...options, month: 'short' });
    const dayShort = d.toLocaleString('en-CA', { ...options, weekday: 'short' });
    const dayLong = d.toLocaleString('en-CA', { ...options, weekday: 'long' });

    switch (format) {
        case "DD-MM-YYYY":
            return `${day}-${month}-${year}`;
        case "YYYY-MM-DD":
            return `${year}-${month}-${day}`;
        case "DD Month YYYY":
            return `${day} ${monthLong} ${year}`;
        case "DD Mon YYYY":
            return `${day} ${monthShort} ${year}`;
        case "Month YYYY":
            return `${monthLong} ${year}`;
        case "Mon YYYY":
            return `${monthShort} ${year}`;
        default:
            return `${day}-${month}-${year}`;
    }
}
