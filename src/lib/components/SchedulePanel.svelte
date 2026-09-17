<script lang="ts">
	import CalendarDays from '@lucide/svelte/icons/calendar-days';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import Eraser from '@lucide/svelte/icons/eraser';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import { tick, untrack } from 'svelte';
	import { now } from '$lib/state/now.svelte';
	import { schedule } from '$lib/state/schedule.svelte';
	import {
		addDays,
		formatDate,
		isSameDay,
		slotFor,
		startOfWeek,
		TIME_SLOTS,
		toDateKey
	} from '$lib/utils/date';
	import Calendar from './Calendar.svelte';
	import IconButton from './IconButton.svelte';
	import MenuItem from './MenuItem.svelte';
	import Panel from './Panel.svelte';
	import Popover from './Popover.svelte';

	let { class: className }: { class?: string } = $props();

	let selected = $state(new Date());
	let calendarOpen = $state(false);
	let menuOpen = $state(false);
	let confirmReset = $state(false);
	let scroller = $state<HTMLElement>();
	let list = $state<HTMLElement>();

	const dateKey = $derived(toDateKey(selected));
	const entries = $derived(schedule.day(dateKey));
	const isToday = $derived(isSameDay(selected, now.current));
	const currentSlot = $derived(isToday ? slotFor(now.current) : null);
	const nowOffset = $derived((now.current.getMinutes() % 30) / 30);
	const week = $derived(
		Array.from({ length: 7 }, (_, index) => addDays(startOfWeek(selected), index))
	);

	$effect(() => {
		dateKey;
		untrack(() => scrollToFocus());
	});

	$effect(() => {
		if (!menuOpen) confirmReset = false;
	});

	async function scrollToFocus() {
		await tick();
		if (!scroller || !list || scroller.scrollHeight <= scroller.clientHeight) return;
		const target = currentSlot ?? TIME_SLOTS.find((time) => entries[time]) ?? '08:00';
		const row = list.querySelector<HTMLElement>(`[data-slot="${target}"]`);
		if (row) scroller.scrollTop = row.offsetTop - scroller.clientHeight / 3;
	}

	function select(date: Date) {
		selected = date;
		calendarOpen = false;
	}

	function focusNext(time: string) {
		const index = TIME_SLOTS.indexOf(time);
		const next = list?.querySelector<HTMLInputElement>(
			`[data-slot="${TIME_SLOTS[index + 1]}"] input`
		);
		next?.focus();
	}
</script>

<Panel
	title="Schedule"
	subtitle={formatDate(selected, {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	})}
	class={className}
	bind:body={scroller}
>
	{#snippet actions()}
		{#if !isToday}
			<button
				type="button"
				class="rounded-full px-3 py-1.5 text-[15px] text-accent transition hover:bg-fill active:scale-95"
				onclick={() => (selected = new Date())}
			>
				Today
			</button>
		{/if}
		<Popover bind:open={calendarOpen}>
			{#snippet trigger()}
				<IconButton
					label="Pick a date"
					active={calendarOpen}
					onclick={() => (calendarOpen = !calendarOpen)}
				>
					<CalendarDays />
				</IconButton>
			{/snippet}
			<Calendar {selected} onselect={select} marked={(key) => schedule.hasEntries(key)} />
		</Popover>
		<Popover bind:open={menuOpen} class="w-56">
			{#snippet trigger()}
				<IconButton label="More options" active={menuOpen} onclick={() => (menuOpen = !menuOpen)}>
					<Ellipsis />
				</IconButton>
			{/snippet}
			<MenuItem
				disabled={!schedule.hasEntries(dateKey)}
				onclick={() => {
					schedule.clearDay(dateKey);
					menuOpen = false;
				}}
			>
				Clear This Day <Eraser />
			</MenuItem>
			<div class="mx-3 my-1 h-px bg-separator"></div>
			<MenuItem
				destructive
				onclick={() => {
					if (!confirmReset) {
						confirmReset = true;
						return;
					}
					schedule.clearAll();
					menuOpen = false;
				}}
			>
				{confirmReset ? 'Tap Again to Confirm' : 'Reset All Days'}
				<RotateCcw />
			</MenuItem>
		</Popover>
	{/snippet}

	{#snippet toolbar()}
		<div class="flex items-center gap-1">
			<IconButton label="Previous week" onclick={() => (selected = addDays(selected, -7))}>
				<ChevronLeft />
			</IconButton>
			<div class="grid flex-1 grid-cols-7">
				{#each week as day (day.getTime())}
					{@const isSelected = isSameDay(day, selected)}
					{@const isDayToday = isSameDay(day, now.current)}
					<button
						type="button"
						aria-pressed={isSelected}
						aria-label={formatDate(day, { weekday: 'long', day: 'numeric', month: 'long' })}
						class="group flex flex-col items-center gap-1 py-1"
						onclick={() => (selected = day)}
					>
						<span class="text-[11px] font-semibold text-label-tertiary uppercase">
							{formatDate(day, { weekday: 'narrow' })}
						</span>
						<span
							class={[
								'relative grid size-9 place-items-center rounded-full text-[17px] tabular-nums transition duration-300 ease-spring group-active:scale-90',
								isSelected && isDayToday && 'bg-danger font-semibold text-white',
								isSelected && !isDayToday && 'bg-label font-semibold text-canvas',
								!isSelected && isDayToday && 'font-semibold text-danger',
								!isSelected && 'group-hover:bg-fill'
							]}
						>
							{day.getDate()}
						</span>
						<span
							class={[
								'size-1 rounded-full',
								schedule.hasEntries(toDateKey(day)) ? 'bg-label-tertiary' : 'bg-transparent'
							]}
						></span>
					</button>
				{/each}
			</div>
			<IconButton label="Next week" onclick={() => (selected = addDays(selected, 7))}>
				<ChevronRight />
			</IconButton>
		</div>
	{/snippet}

	<ol bind:this={list} class="px-2">
		{#each TIME_SLOTS as time (time)}
			{@const text = entries[time] ?? ''}
			{@const onHour = time.endsWith(':00')}
			<li data-slot={time} class="relative flex items-stretch gap-3">
				<span
					class={[
						'w-11 shrink-0 pt-2.5 text-right text-[12px] tabular-nums',
						onHour ? 'font-medium text-label-secondary' : 'text-label-tertiary'
					]}
				>
					{time}
				</span>
				<div
					class={[
						'relative flex-1 border-t py-0.5',
						onHour ? 'border-separator' : 'border-dashed border-separator/50'
					]}
				>
					<input
						value={text}
						aria-label={`Plan for ${time}`}
						autocomplete="off"
						enterkeyhint="next"
						class={[
							'w-full rounded-[10px] px-3 py-2 text-[15px] transition outline-none focus:bg-fill',
							text
								? 'bg-accent/12 font-medium text-label shadow-[inset_3px_0_0_var(--accent)] focus:bg-accent/18'
								: 'hover:bg-fill/60'
						]}
						oninput={(event) => schedule.set(dateKey, time, event.currentTarget.value)}
						onblur={() => schedule.commit(dateKey, time)}
						onkeydown={(event) => {
							if (event.key === 'Enter') focusNext(time);
						}}
					/>
				</div>
				{#if time === currentSlot}
					<div
						aria-hidden="true"
						class="pointer-events-none absolute right-0 left-14 z-10 flex items-center"
						style:top="{nowOffset * 100}%"
					>
						<span class="-ml-1 size-2 rounded-full bg-danger"></span>
						<span class="h-[1.5px] flex-1 bg-danger"></span>
					</div>
				{/if}
			</li>
		{/each}
	</ol>
</Panel>
