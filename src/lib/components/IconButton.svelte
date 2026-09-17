<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = HTMLButtonAttributes & {
		label: string;
		active?: boolean;
		destructive?: boolean;
		children: Snippet;
	};

	let {
		label,
		active = false,
		destructive = false,
		children,
		class: className,
		...rest
	}: Props = $props();
</script>

<button
	type="button"
	aria-label={label}
	title={label}
	class={[
		'grid size-9 place-items-center rounded-full transition duration-200 ease-spring active:scale-90 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-5',
		destructive ? 'text-danger hover:bg-danger/10' : 'text-accent hover:bg-fill',
		active && 'bg-fill',
		className
	]}
	{...rest}
>
	{@render children()}
</button>
