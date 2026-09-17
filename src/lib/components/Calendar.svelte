<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { untrack } from 'svelte';
	import { formatDate, isSameDay, startOfWeek, addDays, toDateKey } from '$lib/utils/date';
	import IconButton from './IconButton.svelte';

	type Props = {
		selected: Date;
		onselect: (date: Date) => void;
		marked: (dateKey: string) => boolean;
	};

	let { selected, onselect, marked }: Props = $props();

	let month = $state(untrack(() => new Date(selected.getFullYear(), selected.getMonth(), 1)));

	const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

	const days = $derived.by(() => {
		const first = startOfWeek(month);
		const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
		const count = Math.ceil(((last.getTime() - first.getTime()) / 86_400_000 + 1) / 7) * 7;
		return Array.from({ length: count }, (_, index) => addDays(first, index));
	});

	function shift(amount: number) {
		month = new Date(month.getFullYear(), month.getMonth() + amount, 1);
	}
</script>

<div class="w-72 p-2">
	<div class="mb-2 flex items-center justify-between pl-2">
		<p class="text-[17px] font-semibold">
			{formatDate(month, { month: 'long', year: 'numeric' })}
		</p>
		<div class="flex">
			<IconButton label="Previous month" onclick={() => shift(-1)}><ChevronLeft /></IconButton>
			<IconButton label="Next month" onclick={() => shift(1)}><ChevronRight /></IconButton>
		</div>
	</div>

	<div class="grid grid-cols-7 text-center">
		{#each weekdays as weekday, index (index)}
			<span class="pb-1 text-[11px] font-semibold text-label-tertiary uppercase">{weekday}</span>
		{/each}

		{#each days as day (day.getTime())}
			{@const isSelected = isSameDay(day, selected)}
			{@const isToday = isSameDay(day, new Date())}
			{@const outside = day.getMonth() !== month.getMonth()}
			<button
				type="button"
				aria-label={formatDate(day, { weekday: 'long', day: 'numeric', month: 'long' })}
				aria-pressed={isSelected}
				class={[
					'relative mx-auto grid size-9 place-items-center rounded-full text-[15px] tabular-nums transition hover:bg-fill active:scale-90',
					isSelected && 'bg-accent font-semibold text-white hover:bg-accent',
					!isSelected && isToday && 'font-semibold text-accent',
					!isSelected && outside && 'text-label-tertiary'
				]}
				onclick={() => onselect(day)}
			>
				{day.getDate()}
				{#if marked(toDateKey(day))}
					<span
						class={[
							'absolute bottom-1 size-1 rounded-full',
							isSelected ? 'bg-white' : 'bg-label-tertiary'
						]}
					></span>
				{/if}
			</button>
		{/each}
	</div>
</div>
