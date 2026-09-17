export const LOCALE = 'en-AU';

const pad = (value: number) => value.toString().padStart(2, '0');

export function toDateKey(date: Date) {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromDateKey(key: string) {
	const [year, month, day] = key.split('-').map(Number);
	return new Date(year, month - 1, day);
}

export function addDays(date: Date, amount: number) {
	const next = new Date(date);
	next.setDate(next.getDate() + amount);
	return next;
}

export function isSameDay(a: Date, b: Date) {
	return toDateKey(a) === toDateKey(b);
}

export function startOfWeek(date: Date) {
	const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const offset = (start.getDay() + 6) % 7;
	return addDays(start, -offset);
}

export const TIME_SLOTS = Array.from({ length: 38 }, (_, index) => {
	const minutes = 5 * 60 + index * 30;
	return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
});

export function slotFor(date: Date) {
	const rounded = Math.floor((date.getHours() * 60 + date.getMinutes()) / 30) * 30;
	return `${pad(Math.floor(rounded / 60))}:${pad(rounded % 60)}`;
}

export function formatDate(date: Date, options: Intl.DateTimeFormatOptions) {
	return date.toLocaleDateString(LOCALE, options);
}

export function formatTime(date: Date) {
	return date.toLocaleTimeString(LOCALE, { hour: 'numeric', minute: '2-digit' });
}

export function formatRelative(timestamp: number) {
	const date = new Date(timestamp);
	const today = new Date();
	if (isSameDay(date, today)) return formatTime(date);
	if (isSameDay(date, addDays(today, -1))) return 'Yesterday';
	if (date.getFullYear() === today.getFullYear()) {
		return formatDate(date, { day: 'numeric', month: 'short' });
	}
	return formatDate(date, { day: 'numeric', month: 'short', year: 'numeric' });
}
