<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	type Props = {
		title: string;
		icon: Component;
		tint?: string;
		children: Snippet;
	};

	let { title, icon: Icon, tint = 'text-label-secondary', children }: Props = $props();
</script>

<article
	class="flex min-h-36 w-[72%] shrink-0 snap-start flex-col rounded-3xl glass p-4 shadow-[0_18px_40px_-28px_rgb(0_0_0/0.35)] ring-1 ring-black/5 sm:w-[44%] lg:w-auto dark:ring-white/10"
>
	<p class="flex items-center gap-1.5 text-[13px] font-semibold text-label-secondary uppercase">
		<Icon class={['size-4', tint]} strokeWidth={2.25} />
		{title}
	</p>
	<div class="flex flex-1 flex-col pt-2">{@render children()}</div>
</article>
