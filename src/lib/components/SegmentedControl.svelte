<script lang="ts" generics="T extends string">
	type Option = { value: T; label: string };

	type Props = {
		options: Option[];
		value: T;
		label: string;
	};

	let { options, value = $bindable(), label }: Props = $props();

	const index = $derived(
		Math.max(
			0,
			options.findIndex((option) => option.value === value)
		)
	);
</script>

<div role="radiogroup" aria-label={label} class="relative flex rounded-[10px] bg-fill p-0.5">
	<span
		aria-hidden="true"
		class="absolute inset-y-0.5 left-0.5 rounded-[8px] bg-white shadow-[0_3px_8px_rgb(0_0_0/0.12),0_3px_1px_rgb(0_0_0/0.04)] transition-transform duration-300 ease-spring dark:bg-[#636366]"
		style:width="calc((100% - 4px) / {options.length})"
		style:transform="translateX({index * 100}%)"
	></span>
	{#each options as option (option.value)}
		<button
			type="button"
			role="radio"
			aria-checked={option.value === value}
			class={[
				'relative flex-1 rounded-[8px] py-1.5 text-[13px] transition-colors',
				option.value === value ? 'font-semibold text-label' : 'font-medium text-label-secondary'
			]}
			onclick={() => (value = option.value)}
		>
			{option.label}
		</button>
	{/each}
</div>
