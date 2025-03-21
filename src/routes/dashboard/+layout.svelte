<script lang="js">
	import Sidebar from '../../components/Side.svelte';
	import Breadcrumb from '../../components/Breadcrumb.svelte';

	let { children } = $props();
</script>

<div class="w-full">
	<Sidebar />
	<main class="flex flex-col items-center justify-center md:ml-48">
		<div class="w-full px-4 py-2">
			<Breadcrumb />
		</div>
		<div class="flex w-full max-w-7xl items-center justify-between px-4">
			{@render children()}
		</div>
	</main>
</div>
