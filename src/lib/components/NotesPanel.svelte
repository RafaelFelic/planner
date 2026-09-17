<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import NotebookPen from '@lucide/svelte/icons/notebook-pen';
	import Search from '@lucide/svelte/icons/search';
	import SquarePen from '@lucide/svelte/icons/square-pen';
	import Trash from '@lucide/svelte/icons/trash-2';
	import X from '@lucide/svelte/icons/x';
	import { untrack } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import { notePreview, notes, noteTitle } from '$lib/state/notes.svelte';
	import { formatDate, formatRelative, formatTime } from '$lib/utils/date';
	import EmptyState from './EmptyState.svelte';
	import IconButton from './IconButton.svelte';
	import Panel from './Panel.svelte';

	let { class: className }: { class?: string } = $props();

	const subtitle = $derived(
		notes.items.length === 1 ? '1 note' : `${notes.items.length || 'No'} notes`
	);
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape' && notes.open) notes.close();
	}}
/>

{#if notes.open}
	{@const note = notes.open}
	<Panel class={className}>
		{#snippet header()}
			<header class="flex items-center justify-between gap-2 px-2 pt-3">
				<button
					type="button"
					class="flex items-center rounded-full py-1.5 pr-3 pl-1 text-[17px] text-accent transition hover:bg-fill active:scale-95"
					onclick={() => notes.close()}
				>
					<ChevronLeft class="size-6" />
					Notes
				</button>
				<IconButton label="Delete note" destructive onclick={() => notes.remove(note.id)}>
					<Trash />
				</IconButton>
			</header>
		{/snippet}

		<div
			in:fly={{ x: 24, duration: 260 }}
			class="flex h-full min-h-[60dvh] flex-col px-2 lg:min-h-0"
		>
			<p class="pt-1 pb-3 text-center text-[13px] text-label-tertiary">
				{formatDate(new Date(note.updatedAt), { day: 'numeric', month: 'long', year: 'numeric' })}
				at {formatTime(new Date(note.updatedAt))}
			</p>
			<textarea
				value={note.body}
				aria-label="Note"
				placeholder="Start writing…"
				class="w-full flex-1 resize-none bg-transparent text-[17px] leading-relaxed outline-none placeholder:text-label-tertiary"
				oninput={(event) => notes.update(note.id, event.currentTarget.value)}
				{@attach (node) => {
					if (!untrack(() => note.body)) node.focus();
				}}></textarea>
		</div>
	</Panel>
{:else}
	<Panel title="Notes" {subtitle} class={className}>
		{#snippet actions()}
			<IconButton label="New note" onclick={() => notes.create()}>
				<SquarePen />
			</IconButton>
		{/snippet}

		{#snippet toolbar()}
			{#if notes.items.length > 0}
				<label
					class="flex items-center gap-2 rounded-xl bg-fill px-3 transition focus-within:ring-2 focus-within:ring-accent/40"
				>
					<Search class="size-[18px] shrink-0 text-label-secondary" />
					<input
						bind:value={notes.query}
						type="search"
						placeholder="Search"
						aria-label="Search notes"
						class="h-10 min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:text-label-tertiary [&::-webkit-search-cancel-button]:hidden"
					/>
					{#if notes.query}
						<button
							type="button"
							aria-label="Clear search"
							class="grid size-5 place-items-center rounded-full bg-label-tertiary text-canvas"
							onclick={() => (notes.query = '')}
						>
							<X class="size-3" strokeWidth={3} />
						</button>
					{/if}
				</label>
			{/if}
		{/snippet}

		{#if notes.visible.length > 0}
			<ul in:fade={{ duration: 180 }} class="px-2">
				{#each notes.visible as note (note.id)}
					<li animate:flip={{ duration: 280 }} class="border-b border-separator last:border-b-0">
						<button
							type="button"
							class="w-full rounded-xl px-2 py-3 text-left transition hover:bg-fill/60 active:scale-[0.99]"
							onclick={() => (notes.openId = note.id)}
						>
							<p class="truncate text-[17px] font-semibold">{noteTitle(note)}</p>
							<p class="mt-0.5 flex gap-2 text-[15px]">
								<span class="shrink-0 text-label">{formatRelative(note.updatedAt)}</span>
								<span class="truncate text-label-secondary">{notePreview(note)}</span>
							</p>
						</button>
					</li>
				{/each}
			</ul>
		{:else if notes.query}
			<EmptyState icon={Search} title="No Results" message={`Nothing matches “${notes.query}”.`} />
		{:else}
			<EmptyState icon={NotebookPen} title="No Notes" message="Capture ideas, lists and thoughts.">
				<button
					type="button"
					class="mt-3 rounded-full bg-accent px-4 py-2 text-[15px] font-semibold text-white transition active:scale-95"
					onclick={() => notes.create()}
				>
					New Note
				</button>
			</EmptyState>
		{/if}
	</Panel>
{/if}
