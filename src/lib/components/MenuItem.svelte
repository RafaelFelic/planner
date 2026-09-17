<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = HTMLButtonAttributes & {
		destructive?: boolean;
		children: Snippet;
	};

	let { destructive = false, children, class: className, ...rest }: Props = $props();
</script>

<button
	type="button"
	class={[
		'flex w-full items-center justify-between gap-6 rounded-[10px] px-3 py-2.5 text-left text-[15px] whitespace-nowrap transition-colors hover:bg-fill disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-[18px]',
		destructive ? 'text-danger' : 'text-label',
		className
	]}
	{...rest}
>
	{@render children()}
</button>
