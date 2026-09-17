<script lang="ts" module>
	export type Tab = 'tasks' | 'schedule' | 'notes';
</script>

<script lang="ts">
	import CalendarClock from '@lucide/svelte/icons/calendar-clock';
	import ListChecks from '@lucide/svelte/icons/list-checks';
	import NotebookPen from '@lucide/svelte/icons/notebook-pen';

	let { value = $bindable() }: { value: Tab } = $props();

	const tabs = [
		{ value: 'tasks', label: 'Tasks', icon: ListChecks },
		{ value: 'schedule', label: 'Schedule', icon: CalendarClock },
		{ value: 'notes', label: 'Notes', icon: NotebookPen }
	] as const;

	const index = $derived(tabs.findIndex((tab) => tab.value === value));
</script>

<nav
	aria-label="Sections"
	class="fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
>
	<div
		class="relative grid w-full max-w-sm grid-cols-3 rounded-full glass p-1 shadow-[0_12px_40px_-8px_rgb(0_0_0/0.35)] ring-1 ring-black/5 dark:ring-white/15"
	>
		<span
			aria-hidden="true"
			class="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-fill transition-transform duration-500 ease-spring"
			style:transform="translateX({index * 100}%)"
		></span>
		{#each tabs as tab (tab.value)}
			{@const Icon = tab.icon}
			<button
				type="button"
				aria-current={tab.value === value ? 'page' : undefined}
				class={[
					'relative flex flex-col items-center gap-0.5 rounded-full py-2 text-[11px] font-semibold transition-colors active:scale-95',
					tab.value === value ? 'text-accent' : 'text-label-secondary'
				]}
				onclick={() => {
					value = tab.value;
					window.scrollTo({ top: 0, behavior: 'smooth' });
				}}
			>
				<Icon class="size-[22px]" strokeWidth={tab.value === value ? 2.25 : 1.75} />
				{tab.label}
			</button>
		{/each}
	</div>
</nav>
