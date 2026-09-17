import { Persisted, readStored } from './persisted.svelte';

type Day = Record<string, string>;
type ScheduleData = Record<string, Day>;

function migrateLegacy(): ScheduleData {
	const legacy = readStored<{ id: string; value: string }[]>('schedule') ?? [];
	const data: ScheduleData = {};
	for (const { id, value } of legacy) {
		if (typeof id !== 'string' || id.length !== 12 || !value?.trim()) continue;
		const time = `${id.slice(0, 2)}:${id.slice(2, 4)}`;
		const dateKey = `${id.slice(8, 12)}-${id.slice(6, 8)}-${id.slice(4, 6)}`;
		data[dateKey] ??= {};
		data[dateKey][time] = value.trim();
	}
	return data;
}

class ScheduleStore {
	#store = new Persisted<ScheduleData>('planner.schedule', migrateLegacy);

	day(dateKey: string): Day {
		return this.#store.current[dateKey] ?? {};
	}

	hasEntries(dateKey: string) {
		return Object.keys(this.day(dateKey)).length > 0;
	}

	set(dateKey: string, time: string, text: string) {
		const data = this.#store.current;
		if (text) {
			data[dateKey] ??= {};
			data[dateKey][time] = text;
			return;
		}
		if (!data[dateKey]) return;
		delete data[dateKey][time];
		if (Object.keys(data[dateKey]).length === 0) delete data[dateKey];
	}

	commit(dateKey: string, time: string) {
		const text = this.day(dateKey)[time];
		if (text !== undefined) this.set(dateKey, time, text.trim());
	}

	clearDay(dateKey: string) {
		delete this.#store.current[dateKey];
	}

	clearAll() {
		this.#store.current = {};
	}
}

export const schedule = new ScheduleStore();
