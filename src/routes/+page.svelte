<script lang="ts">
	import NotesPanel from '$lib/components/NotesPanel.svelte';
	import SchedulePanel from '$lib/components/SchedulePanel.svelte';
	import TabBar, { type Tab } from '$lib/components/TabBar.svelte';
	import TasksPanel from '$lib/components/TasksPanel.svelte';
	import Widgets from '$lib/components/Widgets.svelte';
	import { Persisted } from '$lib/state/persisted.svelte';
	import { now } from '$lib/state/now.svelte';
	import { schedule } from '$lib/state/schedule.svelte';
	import { todos } from '$lib/state/todos.svelte';
	import { formatDate, toDateKey } from '$lib/utils/date';

	const tab = new Persisted<Tab>('planner.tab', () => 'tasks');

	const hour = $derived(now.current.getHours());
	const greeting = $derived(
		hour < 5
			? 'Good night'
			: hour < 12
				? 'Good morning'
				: hour < 18
					? 'Good afternoon'
					: 'Good evening'
	);

	const summary = $derived.by(() => {
		const plans = Object.keys(schedule.day(toDateKey(now.current))).length;
		const parts = [
			todos.remaining === 1 ? '1 task left' : `${todos.remaining || 'No'} tasks left`,
			plans === 1 ? '1 plan today' : `${plans || 'No'} plans today`
		];
		return parts.join(' · ');
	});
</script>

<div
	class="mx-auto flex max-w-[1600px] flex-col gap-5 px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-32 sm:px-6 lg:h-dvh lg:min-h-[760px] lg:gap-6 lg:px-8 lg:pt-8 lg:pb-6"
>
	<header class="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
		<div>
			<p class="text-[13px] font-semibold tracking-wide text-label-secondary uppercase">
				{formatDate(now.current, { weekday: 'long', day: 'numeric', month: 'long' })}
			</p>
			<h1 class="text-[34px] leading-tight font-bold tracking-tight lg:text-[40px]">{greeting}</h1>
		</div>
		<p class="text-[15px] text-label-secondary">{summary}</p>
	</header>

	<Widgets />

	<main class="grid grid-cols-1 gap-5 lg:min-h-0 lg:flex-1 lg:grid-cols-3 lg:gap-6">
		<TasksPanel class={tab.current === 'tasks' ? '' : 'max-lg:hidden'} />
		<SchedulePanel class={tab.current === 'schedule' ? '' : 'max-lg:hidden'} />
		<NotesPanel class={tab.current === 'notes' ? '' : 'max-lg:hidden'} />
	</main>

	<footer class="text-center text-[12px] text-label-tertiary lg:-mt-2">
		© 2023–{now.current.getFullYear()}
		<a href="mailto:rafaelfelic@gmail.com" class="transition-colors hover:text-label-secondary">
			Rafael Feliciano
		</a>
	</footer>
</div>

<TabBar bind:value={tab.current} />
