<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	type Props = {
		icon: Component;
		title: string;
		message: string;
		children?: Snippet;
	};

	let { icon: Icon, title, message, children }: Props = $props();
</script>

<div
	in:fade={{ duration: 200 }}
	class="flex h-full min-h-56 flex-col items-center justify-center gap-2 px-6 py-10 text-center"
>
	<div class="mb-2 grid size-14 place-items-center rounded-full bg-fill text-label-tertiary">
		<Icon class="size-7" strokeWidth={1.75} />
	</div>
	<p class="text-[17px] font-semibold">{title}</p>
	<p class="max-w-64 text-[15px] text-label-secondary">{message}</p>
	{@render children?.()}
</div>
