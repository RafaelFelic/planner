import { browser } from '$app/environment';

export function readStored<T>(key: string): T | undefined {
	if (!browser) return undefined;
	try {
		const raw = localStorage.getItem(key);
		return raw === null ? undefined : (JSON.parse(raw) as T);
	} catch {
		return undefined;
	}
}

export class Persisted<T> {
	current = $state() as T;

	constructor(key: string, initial: () => T) {
		this.current = readStored<T>(key) ?? initial();

		if (!browser) return;

		$effect.root(() => {
			$effect(() => {
				try {
					localStorage.setItem(key, JSON.stringify(this.current));
				} catch {}
			});
		});

		window.addEventListener('storage', (event) => {
			if (event.key !== key || event.newValue === null) return;
			try {
				this.current = JSON.parse(event.newValue) as T;
			} catch {}
		});
	}
}
