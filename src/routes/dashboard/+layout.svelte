<script lang="js">
	import Sidebar from '$lib/components/Side.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

</script>

<div class="flex min-h-screen">
	<Sidebar />
	<main class="mx-auto mt-16 h-full max-w-6xl flex-grow md:ml-48">
		{@render children()}
	</main>
	<Footer />
</div>
