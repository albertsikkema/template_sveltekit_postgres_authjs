<script lang="js">
	import Sidebar from '../../components/Side.svelte';
	let { children } = $props();
</script>

<div class="w-full ">
	<Sidebar />
	<main class="flex flex-col justify-center items-center md:ml-48 ">
		<div class="w-full flex justify-between items-center px-4 max-w-7xl">
		{@render children()}
		</div>
	</main>
</div>
