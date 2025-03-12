<script lang="js">
	import Sidebar from '../../components/Side.svelte';
	import Footer from '../../components/Footer.svelte';

	let { children } = $props();

</script>

<div class="flex  ">
	<Sidebar />
	<main class="min-h-screen w-full  max-w-6xl  md:ml-48">
		{@render children()}
	</main>
	<Footer />
</div>
