export function prettyPrintTimeSince(date: Date | number): string {
    const MS_PER_UNIT = {
        'year': 1000 * 60 * 60 * 24 * 365,
        'month': 1000 * 60 * 60 * 24 * 28,
        'day': 1000 * 60 * 60 * 24,
        'hour': 1000 * 60 * 60,
        'minute': 1000 * 60,
        'second': 1000,
        'millisecond': 1,
    };

    const now = Date.now();
    const diff = now - (typeof date === 'number' ? date : date.getTime());

    for (const [name, msPer] of Object.entries(MS_PER_UNIT)) {
        const n = Math.floor(diff / msPer);
        if (n >= 1) {
            return `${n} ${name}${n == 1 ? '' : 's'} ago`;
        }
    }

    return '0 milliseconds ago';
}
