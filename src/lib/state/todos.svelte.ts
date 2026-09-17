import { Persisted, readStored } from './persisted.svelte';

export type Todo = {
	id: string;
	title: string;
	done: boolean;
	createdAt: number;
};

export type TodoFilter = 'all' | 'active' | 'done';

function migrateLegacy(): Todo[] {
	const legacy = readStored<{ task: string; completed: boolean }[]>('todos') ?? [];
	return legacy
		.filter((item) => typeof item?.task === 'string' && item.task.trim())
		.map((item, index) => ({
			id: crypto.randomUUID(),
			title: item.task.trim(),
			done: Boolean(item.completed),
			createdAt: Date.now() - index
		}));
}

class TodoStore {
	#store = new Persisted<Todo[]>('planner.todos', migrateLegacy);
	filter = $state<TodoFilter>('all');

	get items() {
		return this.#store.current;
	}

	get remaining() {
		return this.items.filter((todo) => !todo.done).length;
	}

	get completed() {
		return this.items.length - this.remaining;
	}

	get visible() {
		if (this.filter === 'active') return this.items.filter((todo) => !todo.done);
		if (this.filter === 'done') return this.items.filter((todo) => todo.done);
		return this.items;
	}

	add(title: string) {
		const trimmed = title.trim();
		if (!trimmed) return;
		this.items.unshift({
			id: crypto.randomUUID(),
			title: trimmed,
			done: false,
			createdAt: Date.now()
		});
	}

	toggle(id: string) {
		const todo = this.items.find((item) => item.id === id);
		if (todo) todo.done = !todo.done;
	}

	rename(id: string, title: string) {
		const todo = this.items.find((item) => item.id === id);
		const trimmed = title.trim();
		if (todo && trimmed) todo.title = trimmed;
	}

	remove(id: string) {
		this.#store.current = this.items.filter((item) => item.id !== id);
	}

	clearCompleted() {
		this.#store.current = this.items.filter((item) => !item.done);
	}
}

export const todos = new TodoStore();
