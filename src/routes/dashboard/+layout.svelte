<script lang="js">
	import Sidebar from '../../components/Side.svelte';
	import { invalidate } from '$app/navigation';
	$effect(() => {
		invalidate();
	});
	let { children } = $props();
</script>

<div class="w-full">
	<Sidebar />
	<main class="flex flex-col items-center justify-center md:ml-48">
		<div class="flex w-full max-w-7xl items-center justify-between px-4">
			{@render children()}
		</div>
	</main>
</div>
