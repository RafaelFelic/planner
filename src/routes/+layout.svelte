<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
	<div class="absolute -top-40 -left-32 size-[36rem] rounded-full bg-(--glow-1) blur-3xl"></div>
	<div class="absolute top-1/3 -right-40 size-[32rem] rounded-full bg-(--glow-2) blur-3xl"></div>
	<div class="absolute -bottom-48 left-1/4 size-[30rem] rounded-full bg-(--glow-3) blur-3xl"></div>
</div>

{@render children()}
