import { createSubscriber } from 'svelte/reactivity';

class Now {
	#subscribe = createSubscriber((update) => {
		const interval = setInterval(update, 1000);
		return () => clearInterval(interval);
	});

	get current() {
		this.#subscribe();
		return new Date();
	}
}

export const now = new Now();
