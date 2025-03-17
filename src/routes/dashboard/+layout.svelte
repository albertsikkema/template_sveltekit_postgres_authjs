<script lang="js">
	import Sidebar from '../../components/Side.svelte';
	let { children } = $props();
</script>

<div class="w-full">
	<Sidebar />
	<main class="md:ml-48">
		{@render children()}
	</main>
</div>
