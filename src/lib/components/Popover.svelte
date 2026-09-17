<script lang="ts">
	import type { Snippet } from 'svelte';
	import { scale } from 'svelte/transition';

	type Props = {
		open: boolean;
		trigger: Snippet;
		children: Snippet;
		class?: string;
	};

	let { open = $bindable(), trigger, children, class: className }: Props = $props();
	let root: HTMLElement;

	function dismiss(event: PointerEvent) {
		if (open && !root.contains(event.target as Node)) open = false;
	}
</script>

<svelte:window
	onpointerdown={dismiss}
	onkeydown={(event) => {
		if (event.key === 'Escape') open = false;
	}}
/>

<div bind:this={root} class="relative">
	{@render trigger()}
	{#if open}
		<div
			transition:scale={{ start: 0.92, duration: 180, opacity: 0 }}
			class={[
				'absolute top-full right-0 z-40 mt-2 origin-top-right rounded-2xl bg-elevated p-1.5 shadow-[0_20px_50px_-12px_rgb(0_0_0/0.35)] ring-1 ring-black/5 backdrop-blur-2xl dark:ring-white/10',
				className
			]}
		>
			{@render children()}
		</div>
	{/if}
</div>
