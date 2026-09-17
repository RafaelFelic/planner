<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title?: string;
		subtitle?: string;
		header?: Snippet;
		actions?: Snippet;
		toolbar?: Snippet;
		children: Snippet;
		class?: string;
		body?: HTMLElement;
	};

	let {
		title,
		subtitle,
		header,
		actions,
		toolbar,
		children,
		class: className,
		body = $bindable()
	}: Props = $props();
</script>

<section
	class={[
		'flex min-h-0 min-w-0 flex-col rounded-[28px] glass shadow-[0_24px_60px_-32px_rgb(0_0_0/0.35)] ring-1 ring-black/5 dark:ring-white/10',
		className
	]}
>
	{#if header}
		{@render header()}
	{:else}
		<header class="flex items-start justify-between gap-3 px-5 pt-5">
			<div class="min-w-0">
				<h2 class="text-[26px] leading-tight font-bold tracking-tight">{title}</h2>
				{#if subtitle}
					<p class="mt-0.5 truncate text-[15px] text-label-secondary">{subtitle}</p>
				{/if}
			</div>
			{#if actions}
				<div class="flex shrink-0 items-center gap-1 pt-1">{@render actions()}</div>
			{/if}
		</header>
	{/if}

	{#if toolbar}
		<div class="flex flex-col gap-3 px-5 pt-4 pb-2">{@render toolbar()}</div>
	{/if}

	<div
		bind:this={body}
		class="relative min-h-0 flex-1 scroll-thin overflow-y-auto rounded-b-[28px] px-3 pt-1 pb-4"
	>
		{@render children()}
	</div>
</section>
