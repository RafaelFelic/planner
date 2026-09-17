<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ListChecks from '@lucide/svelte/icons/list-checks';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash from '@lucide/svelte/icons/trash-2';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { todos, type TodoFilter } from '$lib/state/todos.svelte';
	import EmptyState from './EmptyState.svelte';
	import Panel from './Panel.svelte';
	import SegmentedControl from './SegmentedControl.svelte';

	let { class: className }: { class?: string } = $props();

	let draft = $state('');

	const filters: { value: TodoFilter; label: string }[] = [
		{ value: 'all', label: 'All' },
		{ value: 'active', label: 'Active' },
		{ value: 'done', label: 'Done' }
	];

	const subtitle = $derived.by(() => {
		if (todos.items.length === 0) return 'Nothing planned yet';
		if (todos.remaining === 0) return 'All done';
		return `${todos.remaining} remaining`;
	});

	const empty = $derived(
		{
			all: { title: 'No Tasks', message: 'Add something above to get your day moving.' },
			active: { title: 'All Caught Up', message: 'Every task on your list is complete.' },
			done: { title: 'Nothing Done Yet', message: 'Completed tasks will show up here.' }
		}[todos.filter]
	);

	function submit(event: SubmitEvent) {
		event.preventDefault();
		todos.add(draft);
		draft = '';
	}
</script>

<Panel title="Tasks" {subtitle} class={className}>
	{#snippet actions()}
		{#if todos.completed > 0}
			<button
				type="button"
				class="rounded-full px-3 py-1.5 text-[15px] text-accent transition hover:bg-fill active:scale-95"
				onclick={() => todos.clearCompleted()}
			>
				Clear Done
			</button>
		{/if}
	{/snippet}

	{#snippet toolbar()}
		<form
			onsubmit={submit}
			class="flex items-center gap-2 rounded-xl bg-fill pr-1.5 pl-3 transition focus-within:ring-2 focus-within:ring-accent/40"
		>
			<Plus class="size-5 shrink-0 text-label-secondary" />
			<input
				bind:value={draft}
				placeholder="New task"
				aria-label="New task"
				autocomplete="off"
				enterkeyhint="done"
				class="h-11 min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:text-label-tertiary"
			/>
			{#if draft.trim()}
				<button
					type="submit"
					transition:fly={{ x: 8, duration: 150 }}
					class="rounded-lg bg-accent px-3 py-1.5 text-[15px] font-semibold text-white active:scale-95"
				>
					Add
				</button>
			{/if}
		</form>
		<SegmentedControl label="Filter tasks" options={filters} bind:value={todos.filter} />
	{/snippet}

	{#if todos.visible.length > 0}
		<ul class="px-2">
			{#each todos.visible as todo (todo.id)}
				<li
					animate:flip={{ duration: 300 }}
					transition:fly={{ y: 10, duration: 220 }}
					class="group flex items-center gap-3 border-b border-separator last:border-b-0"
				>
					<button
						type="button"
						role="checkbox"
						aria-checked={todo.done}
						aria-label={todo.done ? 'Mark as not done' : 'Mark as done'}
						class={[
							'grid size-[22px] shrink-0 place-items-center rounded-full border-[1.5px] transition duration-300 ease-spring active:scale-85',
							todo.done ? 'border-accent bg-accent' : 'border-label-tertiary hover:border-accent'
						]}
						onclick={() => todos.toggle(todo.id)}
					>
						{#if todo.done}
							<span in:fly={{ y: 2, duration: 180 }}>
								<Check class="size-3.5 text-white" strokeWidth={3.5} />
							</span>
						{/if}
					</button>
					<input
						value={todo.title}
						aria-label="Task title"
						enterkeyhint="done"
						class={[
							'min-w-0 flex-1 bg-transparent py-3 text-[17px] transition-colors outline-none',
							todo.done && 'text-label-secondary line-through decoration-label-tertiary'
						]}
						onchange={(event) => todos.rename(todo.id, event.currentTarget.value)}
						onblur={(event) => (event.currentTarget.value = todo.title)}
						onkeydown={(event) => {
							if (event.key === 'Enter') event.currentTarget.blur();
						}}
					/>
					<button
						type="button"
						aria-label="Delete task"
						class="grid size-8 shrink-0 place-items-center rounded-full text-label-tertiary transition group-focus-within:opacity-100 group-hover:opacity-100 hover:bg-danger/10 hover:text-danger focus-visible:opacity-100 pointer-fine:opacity-0"
						onclick={() => todos.remove(todo.id)}
					>
						<Trash class="size-[18px]" />
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<EmptyState icon={ListChecks} title={empty.title} message={empty.message} />
	{/if}
</Panel>
