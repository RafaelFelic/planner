<script lang="ts">
	import Banknote from '@lucide/svelte/icons/banknote';
	import Bitcoin from '@lucide/svelte/icons/bitcoin';
	import Clock from '@lucide/svelte/icons/clock';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Navigation from '@lucide/svelte/icons/navigation';
	import { fade } from 'svelte/transition';
	import { formatMoney, markets } from '$lib/services/markets.svelte';
	import { weather } from '$lib/services/weather.svelte';
	import { now } from '$lib/state/now.svelte';
	import { formatDate, fromDateKey, LOCALE } from '$lib/utils/date';
	import Widget from './Widget.svelte';

	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const city = timeZone.split('/').at(-1)?.replaceAll('_', ' ') ?? timeZone;

	const SAO_PAULO = 'America/Sao_Paulo';

	const clockParts = (date: Date, zone?: string) =>
		date
			.toLocaleTimeString(LOCALE, { timeZone: zone, hour: 'numeric', minute: '2-digit' })
			.split(' ');

	const clock = $derived(clockParts(now.current));
	const offset = $derived(
		new Intl.DateTimeFormat(LOCALE, { timeZoneName: 'shortOffset' })
			.formatToParts(now.current)
			.find((part) => part.type === 'timeZoneName')?.value
	);

	const saoPaulo = $derived.by(() => {
		const local = new Date(now.current);
		local.setSeconds(0, 0);
		const parts = Object.fromEntries(
			new Intl.DateTimeFormat('en-US', {
				timeZone: SAO_PAULO,
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				hourCycle: 'h23'
			})
				.formatToParts(local)
				.map((part) => [part.type, Number(part.value)])
		);
		const remote = new Date(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
		const hours = Math.round((remote.getTime() - local.getTime()) / 1_800_000) / 2;
		const day =
			remote.getDate() === local.getDate() ? 'Today' : remote < local ? 'Yesterday' : 'Tomorrow';
		const difference =
			hours === 0 ? 'Same time' : `${Math.abs(hours)}h ${hours < 0 ? 'behind' : 'ahead'}`;
		return { time: clockParts(now.current, SAO_PAULO), day, difference };
	});

	$effect(() => weather.start());
	$effect(() => markets.start());
</script>

{#snippet skeleton(lines: number)}
	<div class="flex flex-1 flex-col justify-end gap-2" aria-busy="true">
		{#each { length: lines }, index (index)}
			<span class={['h-4 animate-pulse rounded-md bg-fill', index === 0 ? 'h-8 w-2/3' : 'w-1/2']}
			></span>
		{/each}
	</div>
{/snippet}

<div
	class="-mx-4 no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0"
>
	<Widget title="Weather" icon={weather.forecast ? weather.icon : MapPin} tint="text-accent">
		{#if weather.status === 'ready' && weather.forecast}
			{@const Icon = weather.icon}
			<div in:fade class="flex flex-1 flex-col">
				<p class="flex items-center gap-1 truncate text-[15px] font-semibold">
					{weather.forecast.place}
					<Navigation class="size-3 fill-current" />
				</p>
				<div class="flex items-center justify-between">
					<p class="text-[44px] leading-none font-light tracking-tight tabular-nums">
						{weather.forecast.temperature}°
					</p>
					<Icon class="size-9 text-warning" strokeWidth={1.75} />
				</div>
				<p class="mt-auto text-[13px] font-medium">
					{weather.forecast.condition.label}
					<span class="text-label-secondary">
						H:{weather.forecast.high}° L:{weather.forecast.low}°
					</span>
				</p>
			</div>
		{:else if weather.status === 'locating'}
			{@render skeleton(2)}
		{:else}
			<div class="flex flex-1 flex-col justify-end gap-2">
				<p class="text-[15px] text-label-secondary">
					{#if weather.status === 'denied'}
						Location access is turned off for this site.
					{:else if weather.status === 'error'}
						Weather is unavailable right now.
					{:else}
						See the conditions where you are.
					{/if}
				</p>
				{#if weather.status !== 'denied'}
					<button
						type="button"
						class="self-start rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-white transition active:scale-95"
						onclick={() => weather.load()}
					>
						{weather.status === 'error' ? 'Try Again' : 'Use My Location'}
					</button>
				{/if}
			</div>
		{/if}
	</Widget>

	<Widget title="Clock" icon={Clock} tint="text-label-secondary">
		<p class="flex items-baseline gap-1.5 truncate text-[15px] font-semibold">
			{city}
			<span class="text-[13px] font-normal text-label-secondary">{offset}</span>
		</p>
		<p class="mb-3 text-[44px] leading-none font-light tracking-tight tabular-nums">
			{clock[0]}<span class="ml-1 text-[20px] font-normal text-label-secondary">{clock[1]}</span>
		</p>
		{#if timeZone !== SAO_PAULO}
			<div class="mt-auto flex items-end justify-between gap-3 border-t border-separator pt-2">
				<div class="min-w-0">
					<p class="truncate text-[13px] font-semibold">São Paulo</p>
					<p class="truncate text-[12px] text-label-secondary">
						{saoPaulo.day} · {saoPaulo.difference}
					</p>
				</div>
				<p class="text-[24px] leading-none font-light tracking-tight tabular-nums">
					{saoPaulo.time[0]}<span class="ml-0.5 text-[13px] font-normal text-label-secondary"
						>{saoPaulo.time[1]}</span
					>
				</p>
			</div>
		{/if}
	</Widget>

	<Widget title="Exchange" icon={Banknote} tint="text-success">
		{#if markets.exchange}
			<dl in:fade class="flex flex-1 flex-col justify-center gap-1.5">
				{#each ['USD', 'AUD'] as const as code (code)}
					<div class="flex items-baseline justify-between gap-3">
						<dt class="text-[15px] font-semibold">1 {code}</dt>
						<dd class="text-[26px] leading-tight font-light tracking-tight tabular-nums">
							{formatMoney(markets.exchange[code], 'BRL')}
						</dd>
					</div>
				{/each}
			</dl>
			<p class="text-[13px] text-label-secondary">
				ECB reference · {formatDate(fromDateKey(markets.exchange.date), {
					day: 'numeric',
					month: 'short'
				})}
			</p>
		{:else if markets.exchangeFailed}
			<p class="mt-auto text-[15px] text-label-secondary">Exchange rates are unavailable.</p>
		{:else}
			{@render skeleton(2)}
		{/if}
	</Widget>

	<Widget title="Bitcoin" icon={Bitcoin} tint="text-warning">
		{#if markets.bitcoin}
			<div in:fade class="flex flex-1 flex-col">
				<p class="text-[15px] font-semibold">BTC · USD</p>
				<p class="text-[34px] leading-tight font-light tracking-tight tabular-nums">
					{formatMoney(markets.bitcoin.USD, 'USD', 0)}
				</p>
				<p class="mt-auto flex flex-wrap gap-x-3 text-[13px] text-label-secondary tabular-nums">
					<span>{formatMoney(markets.bitcoin.AUD, 'AUD', 0)} AUD</span>
					<span>{formatMoney(markets.bitcoin.BRL, 'BRL', 0)}</span>
				</p>
			</div>
		{:else if markets.bitcoinFailed}
			<p class="mt-auto text-[15px] text-label-secondary">Bitcoin price is unavailable.</p>
		{:else}
			{@render skeleton(2)}
		{/if}
	</Widget>
</div>
