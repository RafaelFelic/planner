import { Persisted, readStored } from './persisted.svelte';

export type Note = {
	id: string;
	body: string;
	updatedAt: number;
};

function migrateLegacy(): Note[] {
	const legacy = readStored<{ id: string; content: string }[]>('notes') ?? [];
	return legacy
		.filter((item) => typeof item?.content === 'string' && item.content.trim())
		.map((item, index) => ({
			id: crypto.randomUUID(),
			body: item.content,
			updatedAt: Date.now() - index
		}));
}

export function noteTitle(note: Note) {
	return (
		note.body
			.split('\n')
			.find((line) => line.trim())
			?.trim() ?? 'New Note'
	);
}

export function notePreview(note: Note) {
	const lines = note.body.split('\n').filter((line) => line.trim());
	return lines[1]?.trim() ?? 'No additional text';
}

class NoteStore {
	#store = new Persisted<Note[]>('planner.notes', migrateLegacy);
	query = $state('');
	openId = $state<string | null>(null);

	get items() {
		return this.#store.current.toSorted((a, b) => b.updatedAt - a.updatedAt);
	}

	get visible() {
		const query = this.query.trim().toLowerCase();
		if (!query) return this.items;
		return this.items.filter((note) => note.body.toLowerCase().includes(query));
	}

	get open() {
		return this.#store.current.find((note) => note.id === this.openId) ?? null;
	}

	create() {
		const id = crypto.randomUUID();
		this.#store.current.push({ id, body: '', updatedAt: Date.now() });
		this.openId = id;
	}

	update(id: string, body: string) {
		const note = this.#store.current.find((item) => item.id === id);
		if (!note) return;
		note.body = body;
		note.updatedAt = Date.now();
	}

	remove(id: string) {
		this.#store.current = this.#store.current.filter((note) => note.id !== id);
		if (this.openId === id) this.openId = null;
	}

	close() {
		const note = this.open;
		if (note && !note.body.trim()) this.remove(note.id);
		this.openId = null;
	}
}

export const notes = new NoteStore();
